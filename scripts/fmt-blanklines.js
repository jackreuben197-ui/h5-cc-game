const fs = require('fs');
const path = require('path');
const prettier = require('prettier');
const { parse } = require('@typescript-eslint/typescript-estree');

const ROOT = path.join(__dirname, '../assets', 'script');
const EXCLUDE_DIRS = new Set(['protobuf']);

const PRETTIER_OPTS = {
    parser: 'typescript',
    tabWidth: 4,
    useTabs: false,
    printWidth: 160,
    singleQuote: true,
    trailingComma: 'none',
    bracketSpacing: true,
    arrowParens: 'avoid',
};

function collectTs(dir) {
    let files = [];
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        if (entry.isDirectory()) {
            if (!EXCLUDE_DIRS.has(entry.name)) {
                files.push(...collectTs(path.join(dir, entry.name)));
            }
        } else if (entry.name.endsWith('.ts') && !entry.name.endsWith('.d.ts')) {
            files.push(path.join(dir, entry.name));
        }
    }
    return files;
}

const files = collectTs(ROOT);
console.log(`Found ${files.length} .ts files to process`);

/**
 * 判断一个节点是否是“类属性/成员变量”（包括普通的 Property 和 MethodDefinition 里的 get/set）
 */
function isPropertyLike(node) {
    if (!node) return false;
    if (node.type === 'PropertyDefinition') return true;
    if (node.type === 'MethodDefinition' && (node.kind === 'get' || node.kind === 'set')) {
        return true;
    }
    return false;
}

/**
 * 判断一个节点是否是“常规函数/方法”（排除 get/set）
 */
function isMethodLike(node) {
    if (!node) return false;
    if (node.type === 'MethodDefinition' && node.kind !== 'get' && node.kind !== 'set') return true;
    if (node.type === 'FunctionDeclaration' && !isTopLevelStatement(node)) return true;
    return false;
}

/**
 * 判断是否是最外层的独立定义或独立执行语句（包括 Class, Interface, 顶层 const 变量, export default 等）
 */
function isTopLevelStatement(node) {
    if (!node) return false;
    if (node.parent && node.parent.type === 'Program' && node.type !== 'ImportDeclaration') return true;
    if (node.parent && (node.parent.type === 'ExportDefaultDeclaration' || node.parent.type === 'ExportNamedDeclaration') && node.parent.parent && node.parent.parent.type === 'Program') return true;
    return false;
}

async function fmt(file) {
    let src = fs.readFileSync(file, 'utf8');

    // 步骤 1：先过一遍 Prettier 保证缩进和基础格式一致
    try {
        src = await prettier.format(src, { ...PRETTIER_OPTS, filepath: file });
    } catch (e) {
        console.warn('  prettier failed for', path.basename(file), '- continuing with AST blank-lines only');
    }

    // 步骤 2：解析 AST 与 Tokens（包含注释）
    let ast;
    try {
        ast = parse(src, { loc: true, tokens: true, comment: true });
    } catch (e) {
        console.error(`  AST Parse Error in ${path.basename(file)}:`, e.message);
        return;
    }

    const lines = src.split(/\r?\n/);
    const totalLines = lines.length;

    const lineType = new Array(totalLines + 1).fill(null);
    const nodeAtLine = new Array(totalLines + 1).fill(null);

    // 递归标记所有节点范围
    function walk(node) {
        if (!node || !node.loc) return;

        let start = node.loc.start.line;
        const end = node.loc.end.line;

        // 【关键修复点】：如果当前节点带有类/属性/方法装饰器，将装饰器首行纳为当前节点的真正起始行号
        if (node.decorators && node.decorators.length > 0) {
            node.decorators.forEach(dec => {
                if (dec.loc && dec.loc.start.line < start) {
                    start = dec.loc.start.line;
                }
            });
        }

        // 规则 1：常规函数/方法体内部，强行标记为 'body'
        if ((node.type === 'BlockStatement' || node.type === 'ClassBody') && (isMethodLike(node.parent) || (node.parent && node.parent.type === 'FunctionDeclaration' && isTopLevelStatement(node.parent)))) {
            for (let l = start + 1; l < end; l++) {
                lineType[l] = 'body';
            }
        }

        // 建立行到顶层或类成员节点的映射（通过优先级覆盖确保子结构紧凑，外层节点包容）
        if (isPropertyLike(node)) {
            for (let l = start; l <= end; l++) { lineType[l] = 'prop'; nodeAtLine[l] = node; }
        } else if (isMethodLike(node)) {
            for (let l = start; l <= end; l++) { lineType[l] = 'method'; nodeAtLine[l] = node; }
        } else if (node.type === 'ImportDeclaration') {
            for (let l = start; l <= end; l++) { lineType[l] = 'import'; nodeAtLine[l] = node; }
        } else if (isTopLevelStatement(node)) {
            let lineNode = node;
            if (node.parent && (node.parent.type === 'ExportDefaultDeclaration' || node.parent.type === 'ExportNamedDeclaration')) {
                lineNode = node.parent;
            }
            for (let l = start; l <= end; l++) {
                if (!lineType[l]) {
                    lineType[l] = 'topDecl';
                    nodeAtLine[l] = lineNode;
                }
            }
        }

        // 遍历子节点
        for (const key in node) {
            if (key === 'parent' || key === 'loc' || key === 'range' || key === 'tokens') {
                continue;
            }

            const child = node[key];
            if (child && typeof child === 'object') {
                if (Array.isArray(child)) {
                    child.forEach(item => {
                        if (item && typeof item === 'object' && item.type) {
                            item.parent = node;
                            walk(item);
                        }
                    });
                } else if (child.type) {
                    child.parent = node;
                    walk(child);
                }
            }
        }
    }

    // 开始遍历 AST
    ast.body.forEach(node => { node.parent = ast; walk(node); });

    // 处理注释：把注释绑定到紧跟其后的非空节点上（规则 2）
    if (ast.comments) {
        ast.comments.forEach(comment => {
            const cStart = comment.loc.start.line;
            const cEnd = comment.loc.end.line;
            let nextValidLine = cEnd + 1;
            while (nextValidLine <= totalLines && lines[nextValidLine - 1].trim() === '') {
                nextValidLine++;
            }
            if (nextValidLine <= totalLines && lineType[nextValidLine]) {
                const targetType = lineType[nextValidLine];
                const targetNode = nodeAtLine[nextValidLine];
                for (let l = cStart; l <= cEnd; l++) {
                    lineType[l] = targetType;
                    nodeAtLine[l] = targetNode;
                }
            }
        });
    }

    // 步骤 3：根据标记，重组所有行
    let out = [];

    for (let i = 1; i <= totalLines; i++) {
        const rawLine = lines[i - 1];
        const isCurrentBlank = rawLine.trim() === '';

        if (i === totalLines && isCurrentBlank) {
            out.push('');
            continue;
        }

        const currentType = lineType[i];
        const currentNode = nodeAtLine[i];

        // 寻找下一个【非空行】的索引和状态
        let nextIdx = i + 1;
        while (nextIdx <= totalLines && lines[nextIdx - 1].trim() === '') {
            nextIdx++;
        }
        const nextType = lineType[nextIdx];
        const nextNode = nodeAtLine[nextIdx];

        // 规则 1：函数内部 (body) 绝对不留空行
        if (currentType === 'body' && isCurrentBlank) {
            continue;
        }

        if (isCurrentBlank) {
            // 原本是空行时，检查是否符合高阶换行保留规则
            if (nextType === 'method' && currentNode !== nextNode) {
                if (out.length > 0 && out[out.length - 1] !== '') out.push('');
            } else if (nextType === 'topDecl' && currentNode !== nextNode) {
                if (out.length > 0 && out[out.length - 1] !== '') out.push('');
            } else if (currentType === 'import' && nextType !== 'import') { 
                if (out.length > 0 && out[out.length - 1] !== '') out.push('');
            }
            continue;
        }

        out.push(rawLine.trimEnd());

        // 主动补齐缺失的空行
        // 规则 5 —— 只要当前行是 import，而下一行【非空行】不是 import 节点，一律强制补一个空行
        if (currentType === 'import' && nextType !== 'import') {
            out.push('');
        } 
        else if (nextType) {
            // 规则 2：函数与函数之间有空行
            if (currentType === 'method' && nextType === 'method' && currentNode !== nextNode) {
                out.push('');
            }
            // 规则 3：属性/类变量之间（包括 get/set）绝不补空行
            else if (currentType === 'prop' && nextType === 'prop') {
                // 保持挨在一起
            }
            // 属性和常规方法切换时，补空行
            else if ((currentType === 'prop' && nextType === 'method') || (currentType === 'method' && nextType === 'prop')) {
                out.push('');
            }
            // 【硬核修复规则 4】：全局独立语句发生切换时
            else if (currentType === 'topDecl' && nextType === 'topDecl') {
                // 如果当前行内容是解构语句、普通变量声明，且下一非空行属于不同的顶级节点（如类声明或带装饰器的类）
                // 或者是由于装饰器重叠导致 currentNode 发生错位变化，只要它俩不是同一个 AST 节点实例，一律强制补空行。
                if (currentNode !== nextNode) {
                    out.push('');
                }
                // 兜底防御：如果下一行是以装饰器 '@' 开头，且不属于同一个节点，也确保必须空一行出来
                else if (lines[nextIdx - 1].trim().startsWith('@') && currentNode !== nextNode) {
                    out.push('');
                }
            }
        }
    }

    // 二次清洗：过滤连续判定残留的重复空行
    let finalOut = [];
    for (let i = 0; i < out.length; i++) {
        if (out[i] === '' && finalOut[finalOut.length - 1] === '') {
            continue;
        }
        finalOut.push(out[i]);
    }

    let result = finalOut.join('\n');
    if (!result.endsWith('\n')) result += '\n';
    fs.writeFileSync(file, result, 'utf8');
}

async function main() {
    let ok = 0, err = 0;
    for (const f of files) {
        try {
            await fmt(f);
            ok++;
        } catch (e) {
            err++;
            console.error('FAIL:', f.slice(ROOT.length), e.message);
        }
    }
    console.log(`Done: ${ok} OK, ${err} failed`);
}

main().catch(e => { console.error(e); process.exit(1); });