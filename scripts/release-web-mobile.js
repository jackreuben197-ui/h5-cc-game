#!/usr/bin/env node
/**
 * release-web-mobile.js
 *
 * 复制 build/web-mobile → 目标目录
 * 默认目标: ../cocos_release/web-mobile
 *
 * 用法: npm run release:web-mobile [目标目录]
 */

const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const SRC = path.join(ROOT, 'build', 'web-mobile')
const DEFAULT_DEST = path.join(ROOT, '..', 'cocos_release', 'web-mobile')
const dest = process.argv[2] ? path.resolve(process.argv[2]) : DEFAULT_DEST

if (!fs.existsSync(SRC)) {
    console.error('源目录不存在:', SRC)
    process.exit(1)
}

fs.mkdirSync(dest, { recursive: true })
fs.cpSync(SRC, dest, { recursive: true })

console.log('已复制到:', dest)
