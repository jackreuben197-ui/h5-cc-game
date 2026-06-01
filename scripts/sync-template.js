#!/usr/bin/env node
/**
 * sync-template.js
 *
 * 从 build-templates/web-mobile/index.html 提取 H5 Vite 资源引用，
 * 替换到 preview-templates/index.html 中。
 *
 * 用法: npm run sync:template
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const BUILD_DIR = path.join(ROOT, 'build-templates', 'web-mobile')
const PREVIEW_DIR = path.join(ROOT, 'preview-templates')
const BUILD_HTML = path.join(BUILD_DIR, 'index.html')
const PREVIEW_HTML = path.join(PREVIEW_DIR, 'index.html')

// ─── 工具函数 ─────────────────────────────────────────────
function copyDirSync(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true })
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name)
    const destPath = path.join(dest, entry.name)
    if (entry.isDirectory()) {
      copyDirSync(srcPath, destPath)
    } else {
      fs.copyFileSync(srcPath, destPath)
    }
  }
}

function copyFileSync(src, dest) {
  const dir = path.dirname(dest)
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true })
  fs.copyFileSync(src, dest)
}

// ─── 步骤 1：同步 i18n 文件 assets/ → build-templates/ → preview-templates/
const I18N_FILES = ['USER_ZH.txt', 'USER_EN.txt', 'USER_TW.txt', 'USER_PT.txt']
const I18N_SRC_DIR = path.join(ROOT, 'assets', 'resources', 'config')
const I18N_BUILD_DIR = path.join(BUILD_DIR, 'assets', 'resources', 'config')
const I18N_PREVIEW_DIR = path.join(PREVIEW_DIR, 'assets', 'resources', 'config')

let i18nSynced = 0
for (const file of I18N_FILES) {
  const src = path.join(I18N_SRC_DIR, file)
  if (!fs.existsSync(src)) continue
  const destBuild = path.join(I18N_BUILD_DIR, file)
  const destPreview = path.join(I18N_PREVIEW_DIR, file)
  copyFileSync(src, destBuild)
  copyFileSync(src, destPreview)
  i18nSynced++
}
if (i18nSynced) {
  console.log(`同步 i18n: assets/resources/config/ → build-templates + preview-templates (${i18nSynced} 个文件)`)
  console.log('  ✓ i18n 已同步')
}

// ─── 步骤 2：同步 build-templates/assets/ → preview-templates/assets/ ──
const buildAssets = path.join(BUILD_DIR, 'assets')
const previewAssets = path.join(PREVIEW_DIR, 'assets')
if (fs.existsSync(buildAssets)) {
  console.log('同步 assets: build-templates/web-mobile/assets/ → preview-templates/assets/')
  copyDirSync(buildAssets, previewAssets)
  console.log('  ✓ assets 已同步')
}

// ─── 步骤 3：读取 build index.html ──────────────────────
const src = fs.readFileSync(BUILD_HTML, 'utf-8')

// ─── 提取 H5 资源（正则宽松匹配，兼容 ./assets/ 和 ./assets/js/ 等子目录） ──

function one(html, re) {
  const m = html.match(re)
  return m ? m[0] : ''
}

function all(html, re) {
  const out = []
  const g = new RegExp(re.source, re.flags.includes('g') ? re.flags : re.flags + 'g')
  let m
  while ((m = g.exec(html)) !== null) out.push(m[0])
  return out
}

function insertBefore(html, marker, content) {
  if (html.includes(content)) return html
  if (!html.includes(marker)) return html
  return html.replace(marker, `${content}\n${marker}`)
}

const polyfills       = one(src, /<script type="module" crossorigin src="\.\/assets\/[^"]*polyfills-[^"]+\.js"><\/script>/)
const entry           = one(src, /<script type="module" crossorigin src="\.\/assets\/[^"]*index-[^"]+\.js"><\/script>/)
const preloads        = all(src, /<link rel="modulepreload" crossorigin href="\.\/assets\/[^"]+\.js">/)
const cssLinks        = all(src, /<link rel="stylesheet" crossorigin href="\.\/assets\/[^"]+\.css">/)
const legacyPolyfill  = one(src, /<script nomodule crossorigin id="vite-legacy-polyfill" src="\.\/assets\/[^"]+\.js"><\/script>/)
const legacyEntry     = one(src, /<script nomodule crossorigin id="vite-legacy-entry"[^>]*>.*?<\/script>/s)

// 校验
const checks = { polyfills, entry, legacyPolyfill, legacyEntry }
const missing = Object.entries(checks).filter(([, v]) => !v).map(([k]) => k)
if (missing.length) {
  console.error('提取失败:', missing.join(', '))
  process.exit(1)
}
if (!cssLinks.length) {
  console.error('提取失败: cssLinks')
  process.exit(1)
}

console.log('提取到 H5 资源:')
console.log('  polyfills:', polyfills.match(/polyfills-[^"\/]+/)?.[0])
console.log('  entry:    ', entry.match(/index-[^"\/]+\.js/)?.[0])
console.log('  css:      ', cssLinks.map(s => s.match(/[^"\/]+\.css/)?.[0]).join(', '))
console.log('  preloads: ', preloads.length, '个')

// ─── 步骤 4：修补 build-templates index.html 的 #splash ──
// xcopy 从 H5 dist 覆盖后 #splash 是空的，但 CC 的 main.js 需要 .progress-bar > span 子元素
const SPLASH_EMPTY = /<div id="splash"><\/div>/
const SPLASH_CORRECT = '<div id="splash">\n      <div class="progress-bar stripes">\n        <span></span>\n      </div>\n    </div>'

let buildHtml = src
if (SPLASH_EMPTY.test(buildHtml)) {
  buildHtml = buildHtml.replace(SPLASH_EMPTY, SPLASH_CORRECT)
  fs.writeFileSync(BUILD_HTML, buildHtml, 'utf-8')
  console.log('✓ build-templates/web-mobile/index.html #splash 已修补')
} else {
  console.log('✓ build-templates/web-mobile/index.html #splash 无需修补')
}

// ─── 步骤 5：基于 build index 全量生成 preview index，再补充编辑器预览必需代码 ──

const AUTO_GEN_BANNER = `<!--
  * Cocos Creator 2.4.8 编辑器预览模板
  * 由 sync-template.js 从 build-templates/web-mobile/index.html 自动生成
  * 不要手动编辑！修改请更新 build-templates 后运行: npm run sync:template
-->`

const PREVIEW_STYLE_LINK = '<link rel="stylesheet" href="app/editor/static/preview-templates/style.css">'

const I18N_FETCH_PATCH = `    <!-- CC 编辑器预览：拦截 H5 的 i18n fetch，绕过 Cocos 资源管线 -->
  <script>
  (function () {
    var origFetch = window.fetch;
    window.fetch = function (input, init) {
      var url = typeof input === 'string' ? input : input instanceof Request ? input.url : String(input);
      if (/assets\\/resources\\/config\\/USER_\\w+\\.txt/.test(url)) {
        var m = url.match(/USER_\\w+\\.txt/);
        if (m) url = './h5-i18n/' + m[0];
        input = typeof input === 'string' ? url : new Request(url, input);
      }
      return origFetch.call(this, input, init);
    };
  })();
  </script>`

const PREVIEW_TOOLBAR = `
  <!-- ========================================== -->
  <!-- 编辑器工具栏（boot.js 直接引用这些 DOM 元素） -->
  <!-- ========================================== -->
  <div class="toolbar">
    <div class="item">
      <select id="opts-device">
        <option value="0">Default</option>
      </select>
    </div>
    <div class="item">
      <button id="btn-rotate">Rotate</button>
    </div>
    <span class="item" style="font-size: small;">Debug Mode:</span>
    <div class="item">
      <select id="opts-debug-mode">
        <option value="0">None</option>
        <option value="1">Info</option>
        <option value="2">Warn</option>
        <option value="3">Error</option>
        <option value="4">Info For Web Page</option>
        <option value="5">Warn For Web Page</option>
        <option value="6">Error For Web Page</option>
      </select>
    </div>
    <div class="item">
      <button id="btn-show-fps">Show FPS</button>
    </div>
    <div class="item">
      <span class="item" style="font-size: small;">FPS:</span>
      <input id="input-set-fps" type="number">
    </div>
    <div class="item" style="margin-right: 0px;">
      <button id="btn-pause">Pause</button>
    </div>
    <div class="item">
      <button id="btn-step" style="display: none;">Step</button>
    </div>
    <div class="item">
      <button id="btn-recompile">Recompile</button>
    </div>
  </div>
`

const PREVIEW_RECOMPILING = `
  <div id="recompiling">
    <span>Recompiling scripts...</span>
  </div>
`

const PREVIEW_COCOS_DOM = `
  <!-- ========================================== -->
  <!-- Cocos 官方 DOM 结构 -->
  <!-- content > contentWrap > wrapper#GameDiv -->
  <!-- boot.js 依赖这些元素，不可删除 -->
  <!-- ========================================== -->
  <div class="content" id="content">
    <div class="contentWrap">
      <div class="wrapper" id="GameDiv">
        <canvas id="GameCanvas" oncontextmenu="event.preventDefault()" tabindex="0"></canvas>
        <div id="splash">
          <div class="progress-bar stripes">
            <span></span>
          </div>
        </div>
        <div id="bulletin">
          <div class="inner" id="sceneIsEmpty"></div>
        </div>
      </div>
    </div>
  </div>

  <canvas id="drawCanvas"></canvas>
  <input id="OpenImageFile" type="file" accept=".png,.jpg,.jpeg" style="visibility: hidden" />
`

const PREVIEW_COCOS_BOOT = `
  <!-- ================================================== -->
  <!-- Cocos 引擎脚本：严格对齐官方 index.jade 加载顺序 -->
  <!-- ================================================== -->
  <script src="settings.js" charset="utf-8"></script>
  <script src="preview-scripts/__quick_compile__.js" charset="utf-8"></script>
  <script src="app/editor/static/preview-templates/boot.js" charset="utf-8"></script>
  <script src="/socket.io/socket.io.js"></script>
  <script>window.__socket_io__ = window.io;</script>
  <script src="app/engine/bin/<%=cocos2d%>" charset="utf-8"></script>
`

let out = buildHtml

if (!out.includes('<!DOCTYPE html>')) {
  console.error('生成失败: build-templates/web-mobile/index.html 缺少 <!DOCTYPE html>')
  process.exit(1)
}

out = insertBefore(out, '</head>', `    <!-- CSS：编辑器样式 -->\n    ${PREVIEW_STYLE_LINK}`)
out = insertBefore(out, '</head>', I18N_FETCH_PATCH)

if (!out.includes('id="opts-device"')) {
  out = out.replace(/<body[^>]*>/i, m => `${m}${PREVIEW_TOOLBAR}`)
}

// 将 build 的 Cocos 运行 DOM 替换为编辑器预览可用结构，避免重复 id 和空壳容器
const BUILD_COCOS_DOM_RE = /\s*<!-- Cocos 运行节点（与 build-templates\/web-mobile 对齐） -->[\s\S]*?<input id="OpenImageFile"[^>]*>/
if (BUILD_COCOS_DOM_RE.test(out)) {
  out = out.replace(BUILD_COCOS_DOM_RE, `\n${PREVIEW_COCOS_DOM}`)
}

// 将 build 的 Cocos 启动链路替换为编辑器预览脚本链路
const BUILD_COCOS_BOOT_RE = /\s*<!-- Cocos 引擎加载（与旧模板一致） -->[\s\S]*?<\/script>\s*\n\s*<!-- Telegram 初始化（异步按需加载，网络不可达时不阻塞页面） -->/
if (BUILD_COCOS_BOOT_RE.test(out)) {
  out = out.replace(BUILD_COCOS_BOOT_RE, `\n${PREVIEW_COCOS_BOOT}\n\n    <!-- Telegram 初始化（异步按需加载，网络不可达时不阻塞页面） -->`)
} else if (!out.includes('preview-scripts/__quick_compile__.js')) {
  out = insertBefore(out, '</body>', PREVIEW_COCOS_BOOT)
}

if (!out.includes('id="recompiling"')) {
  out = insertBefore(out, '</body>', PREVIEW_RECOMPILING)
}

out = `${AUTO_GEN_BANNER}\n${out}`

// ─── 写入 preview-templates ──────────────────────────────
fs.writeFileSync(PREVIEW_HTML, out, 'utf-8')
console.log('\n✓ preview-templates/index.html 已生成')