#!/usr/bin/env bash
# Cocos Creator 2.4：同步 H5 → 命令行构建 → 复用现有发布脚本。
# CLI 参数参考：https://docs.cocos.com/creator/2.4/manual/zh/publish/publish-in-command-line.html
set -euo pipefail

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ROOT_DIR="$(cd "$PROJECT_DIR/.." && pwd)"
RELEASE_SCRIPT="$ROOT_DIR/release-web-mobile2.sh"
BUILD_DIR="$PROJECT_DIR/build/web-mobile"
DRY_RUN=false
BUILD_ONLY=false

usage() {
  cat <<'EOF'
用法：./build-release-web-mobile2.sh [选项]
      npm run release:web-mobile:all -- [选项]

默认依次执行：npm run sync:h5-game → Cocos web-mobile 正式构建 → release-web-mobile2.sh

选项：
  --dry-run     只检查环境并显示流程，不同步、不构建、不发布
  --build-only  同步并构建，不执行发布脚本
  -h, --help    显示帮助

可用 COCOS_CREATOR 指定 CocosCreator 可执行文件或 .app 路径。
默认根据 project.json 中的版本查找本机 Cocos Creator。
EOF
}

fail() {
  printf '错误：%s\n' "$*" >&2
  exit 1
}

for arg in "$@"; do
  case "$arg" in
    --dry-run) DRY_RUN=true ;;
    --build-only) BUILD_ONLY=true ;;
    -h|--help) usage; exit 0 ;;
    *) usage >&2; fail "未知参数：$arg" ;;
  esac
done

for command_name in node npm corepack; do
  command -v "$command_name" >/dev/null 2>&1 || fail "未找到 $command_name，请先加载 Node.js 环境。"
done

[[ -f "$PROJECT_DIR/settings/builder.json" ]] || fail '缺少 settings/builder.json 构建配置。'
if [[ "$BUILD_ONLY" == false ]]; then
  [[ -f "$RELEASE_SCRIPT" ]] || fail "未找到发布脚本：$RELEASE_SCRIPT"
fi

CREATOR_VERSION="$(node -p 'require(process.argv[1]).version' "$PROJECT_DIR/project.json")"
[[ "$CREATOR_VERSION" == 2.4.* ]] || fail "此脚本适用于 Cocos Creator 2.4，当前项目版本：$CREATOR_VERSION"
CREATOR_BIN="${COCOS_CREATOR:-}"
if [[ -z "$CREATOR_BIN" ]]; then
  for candidate in \
    "/Applications/Cocos/Creator/$CREATOR_VERSION/CocosCreator.app" \
    "/Applications/CocosCreator/Creator/$CREATOR_VERSION/CocosCreator.app" \
    '/Applications/CocosCreator.app'; do
    if [[ -x "$candidate/Contents/MacOS/CocosCreator" ]]; then
      CREATOR_BIN="$candidate/Contents/MacOS/CocosCreator"
      break
    fi
  done
elif [[ "$CREATOR_BIN" == *.app ]]; then
  CREATOR_BIN="$CREATOR_BIN/Contents/MacOS/CocosCreator"
fi
[[ -n "$CREATOR_BIN" && -x "$CREATOR_BIN" ]] || fail '未找到 Cocos Creator，请用 COCOS_CREATOR 指定可执行文件路径。'

printf '项目：%s\nCocos Creator：%s\n' "$PROJECT_DIR" "$CREATOR_BIN"
if [[ "$DRY_RUN" == true ]]; then
  printf '\n[1/3] 在 %s 执行 npm run sync:h5-game\n' "$PROJECT_DIR"
  printf '[2/3] %q --path %q --build %q\n' "$CREATOR_BIN" "$PROJECT_DIR" 'configPath=<temporary-build-config.json>'
  printf '      合并 settings/builder.json 与 local/builder.json，覆盖为 web-mobile 正式构建、MD5 缓存、build/ 输出。\n'
  if [[ "$BUILD_ONLY" == true ]]; then
    printf '[3/3] 跳过发布（--build-only）\n'
  else
    printf '[3/3] 在 %s 执行 bash %q（包含 Git 提交和推送）\n' "$ROOT_DIR" "$RELEASE_SCRIPT"
  fi
  exit 0
fi

LOG_DIR="$PROJECT_DIR/local/release-web-mobile"
LOCK_DIR="$LOG_DIR/running.lock"
mkdir -p "$LOG_DIR"
mkdir "$LOCK_DIR" 2>/dev/null || fail "已有任务正在运行；如上次被强制中断，请确认没有构建进程后删除空锁目录：$LOCK_DIR"
CONFIG_DIR=''
CONFIG_FILE=''
cleanup() {
  if [[ -n "$CONFIG_FILE" ]]; then
    rm -f "$CONFIG_FILE"
  fi
  if [[ -n "$CONFIG_DIR" ]]; then
    rmdir "$CONFIG_DIR" 2>/dev/null || true
  fi
  rmdir "$LOCK_DIR" 2>/dev/null || true
}
trap cleanup EXIT
trap 'exit 130' INT
trap 'exit 143' TERM

LOG_FILE="$LOG_DIR/$(date '+%Y%m%d-%H%M%S')-$$.log"
exec > >(tee -a "$LOG_FILE") 2>&1
STAGE='准备构建配置'
trap 'printf "错误：%s失败，流程已停止。日志：%s\n" "$STAGE" "$LOG_FILE" >&2' ERR
printf '日志：%s\n' "$LOG_FILE"

# 放在 build/ 之外，因为 sync:h5-game 会删除整个 build/。
CONFIG_DIR="$(mktemp -d "${TMPDIR:-/tmp}/h5-cc-game-build.XXXXXX")"
CONFIG_FILE="$CONFIG_DIR/build-config.json"
node - "$PROJECT_DIR" "$CONFIG_FILE" <<'NODE'
const fs = require('node:fs');
const path = require('node:path');
const [project, output] = process.argv.slice(2);
const read = (file) => JSON.parse(fs.readFileSync(path.join(project, file), 'utf8'));
const local = fs.existsSync(path.join(project, 'local/builder.json')) ? read('local/builder.json') : {};
const config = {
  ...read('settings/builder.json'),
  ...local,
  platform: 'web-mobile',
  actualPlatform: 'web-mobile',
  buildPath: path.join(project, 'build'),
  debug: false,
  md5Cache: true,
  sourceMaps: false,
  embedWebDebugger: false,
  buildScriptsOnly: false,
};
fs.writeFileSync(output, JSON.stringify(config, null, 2));
NODE

STAGE='同步 H5'
printf '\n==> [1/3] 同步并构建最新远程 h5-game\n'
cd "$PROJECT_DIR"
npm run sync:h5-game
[[ ! -e "$BUILD_DIR" ]] || fail "同步后旧构建目录仍存在，无法确认构建是否为本次生成：$BUILD_DIR"

STAGE='Cocos web-mobile 构建'
printf '\n==> [2/3] 使用新的 Cocos Creator 进程构建 web-mobile\n'
BUILD_STATUS=0
"$CREATOR_BIN" --path "$PROJECT_DIR" --build "configPath=$CONFIG_FILE" || BUILD_STATUS=$?
# 常规成功码为 0；兼容 Creator 部分版本使用的 336（POSIX 下为 80）。
if [[ "$BUILD_STATUS" != 0 && "$BUILD_STATUS" != 80 ]]; then
  printf '错误：Cocos 构建失败，退出码 %s。日志：%s\n' "$BUILD_STATUS" "$LOG_FILE" >&2
  exit "$BUILD_STATUS"
fi

STAGE='检查 Cocos 构建产物'
SETTINGS_FILES=("$BUILD_DIR"/src/settings*.js)
MAIN_FILES=("$BUILD_DIR"/main*.js)
ENGINE_FILES=("$BUILD_DIR"/cocos2d-js*.js)
for build_file in "$BUILD_DIR/index.html" "${SETTINGS_FILES[0]}" "${MAIN_FILES[0]}" "${ENGINE_FILES[0]}"; do
  [[ -s "$build_file" ]] || fail "Cocos 构建产物不完整：$build_file。日志：$LOG_FILE"
done

if [[ "$BUILD_ONLY" == true ]]; then
  printf '\n==> 同步和构建完成，产物：%s\n' "$BUILD_DIR"
  printf '已按 --build-only 跳过发布。日志：%s\n' "$LOG_FILE"
  exit 0
fi

STAGE='发布 web-mobile'
printf '\n==> [3/3] 执行现有发布脚本（检查资源、提交并推送）\n'
cd "$ROOT_DIR"
bash "$RELEASE_SCRIPT"
printf '\n==> 同步、构建、发布全部完成。日志：%s\n' "$LOG_FILE"
