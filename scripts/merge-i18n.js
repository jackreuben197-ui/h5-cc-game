#!/usr/bin/env node
/**
 * merge-i18n.js
 *
 * 将 h5-game/public/assets/resources/config/ 和 pokerqueen/assets/resources/config/
 * 下的 4 个 i18n 文件合并，去除重复 id，输出到 build-templates 和 preview-templates。
 *
 * 用法: node scripts/merge-i18n.js
 *   或:  npm run merge:i18n
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const FILES = ['USER_ZH.txt', 'USER_EN.txt', 'USER_TW.txt', 'USER_PT.txt']

// 输入目录
const SRC_COCOS = path.join(ROOT, 'assets', 'resources', 'config')
const SRC_H5 = path.join(ROOT, '..', 'h5-game', 'public', 'assets', 'resources', 'config')

// 输出目录（包括 cocos 源目录，使编辑器预览也能加载合并后的文件）
const OUT_DIRS = [
    path.join(ROOT, 'assets', 'resources', 'config'),
    path.join(ROOT, 'build-templates', 'web-mobile', 'assets', 'resources', 'config'),
    path.join(ROOT, 'preview-templates', 'assets', 'resources', 'config'),
]

// CC 编辑器预览专用路径（避免 /assets/ 被 Cocos 资源管线拦截）
const PREVIEW_H5_I18N = path.join(ROOT, 'preview-templates', 'h5-i18n')

/**
 * 解析 i18n 文件，每行格式为 id=value（按第一个 = 分割）
 * 返回 Map<id, value>
 */
function parseI18n(content) {
    const map = new Map()
    const lines = content.split(/\r?\n/)
    for (const line of lines) {
        if (!line) continue
        const idx = line.indexOf('=')
        if (idx === -1) continue
        const id = line.substring(0, idx)
        const value = line.substring(idx + 1)
        map.set(id, value)
    }
    return map
}

/**
 * 将 Map 序列化为 i18n 文本（LF 换行）
 */
function serializeI18n(map) {
    const lines = []
    for (const [id, value] of map) {
        lines.push(`${id}=${value}`)
    }
    return lines.join('\n')
}

/**
 * 读取输出目录下已有的 i18n 文件条数（用于显示合并前旧数据）
 */
function countExistingIds(filePath) {
    if (!fs.existsSync(filePath)) return 0
    const content = fs.readFileSync(filePath, 'utf-8')
    return content.split(/\r?\n/).filter(l => l.includes('=')).length
}

// ─── 主流程 ─────────────────────────────────────────────

console.log('┌────────────────────────────────────────────────────────────────────────────┐')
console.log('│ i18n 合并：h5-game + pokerqueen → assets + build-templates & preview-templates │')
console.log('└────────────────────────────────────────────────────────────────────────────┘')
console.log('')

// 表头
const hdr = '  文件'.padEnd(18) + '旧条数'.padStart(6) + '  │  cocos'.padEnd(10) + 'h5'.padStart(6) + '  │  合并后'.padEnd(10) + '新增'.padStart(5) + '  去重'.padStart(5)
console.log(hdr)
console.log('  ' + '─'.repeat(hdr.length - 2))

let totalOld = 0
let totalMerged = 0

for (const file of FILES) {
    const cocosPath = path.join(SRC_COCOS, file)
    const h5Path = path.join(SRC_H5, file)
    const oldPath = path.join(OUT_DIRS[0], file)

    const cocosExists = fs.existsSync(cocosPath)
    const h5Exists = fs.existsSync(h5Path)

    if (!cocosExists && !h5Exists) {
        console.log(`  ${file.padEnd(16)} 跳过（两处都不存在）`)
        continue
    }

    const cocosMap = cocosExists ? parseI18n(fs.readFileSync(cocosPath, 'utf-8')) : new Map()
    const h5Map = h5Exists ? parseI18n(fs.readFileSync(h5Path, 'utf-8')) : new Map()

    // h5 的 id 如果和 cocos 重复，以 cocos 为准（cocos 是主项目）
    const merged = new Map(h5Map)
    for (const [id, value] of cocosMap) {
        merged.set(id, value)
    }

    const oldCount = countExistingIds(oldPath)
    const duplicates = cocosMap.size + h5Map.size - merged.size
    const added = merged.size - oldCount
    const text = serializeI18n(merged)

    for (const outDir of OUT_DIRS) {
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true })
        }
        fs.writeFileSync(path.join(outDir, file), text, 'utf-8')
    }

    // CC 编辑器预览：写入 h5-i18n/ 目录，绕过 Cocos 资源管线
    if (!fs.existsSync(PREVIEW_H5_I18N)) {
        fs.mkdirSync(PREVIEW_H5_I18N, { recursive: true })
    }
    fs.writeFileSync(path.join(PREVIEW_H5_I18N, file), text, 'utf-8')

    const name = file.replace('.txt', '').padEnd(14)
    console.log(
        `  ${name}` +
        `${String(oldCount).padStart(5)}条  │  `.padStart(0) +
        `${String(cocosMap.size).padStart(5)}条  `.padStart(0) +
        `${String(h5Map.size).padStart(5)}条  │  `.padStart(0) +
        `${String(merged.size).padStart(5)}条  `.padStart(0) +
        `${added >= 0 ? '+' : ''}${added}条  `.padStart(0) +
        `${duplicates}个`.padStart(5)
    )

    totalOld += oldCount
    totalMerged += merged.size
}

console.log('')
console.log(`  合并完成！共 ${totalMerged} 条，已写入 assets/ + build-templates/ + preview-templates/`)
