const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const prettier = require('prettier');

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

const scriptSnapshots = new Map();
const scriptVersions = new Map();

function readFile(fileName) {
    if (!scriptSnapshots.has(fileName)) {
        if (!fs.existsSync(fileName)) return undefined;
        scriptSnapshots.set(fileName, fs.readFileSync(fileName, 'utf8'));
        scriptVersions.set(fileName, 0);
    }
    const content = scriptSnapshots.get(fileName);
    return ts.ScriptSnapshot.fromString(content);
}

const serviceHost = {
    getScriptFileNames: () => files,
    getScriptVersion: (fileName) => String(scriptVersions.get(fileName) || 0),
    getScriptSnapshot: (fileName) => {
        if (scriptSnapshots.has(fileName)) {
            return ts.ScriptSnapshot.fromString(scriptSnapshots.get(fileName));
        }
        if (!fs.existsSync(fileName)) return undefined;
        const content = fs.readFileSync(fileName, 'utf8');
        scriptSnapshots.set(fileName, content);
        scriptVersions.set(fileName, 0);
        return ts.ScriptSnapshot.fromString(content);
    },
    getCurrentDirectory: () => ROOT,
    getCompilationSettings: () => ({
        module: ts.ModuleKind.CommonJS,
        target: ts.ScriptTarget.ES5,
        experimentalDecorators: true,
        allowJs: false,
        checkJs: false,
    }),
    getDefaultLibFileName: () => 'lib.d.ts',
    fileExists: (fileName) => fs.existsSync(fileName),
    readFile: (fileName) => fs.readFileSync(fileName, 'utf8'),
    readDirectory: ts.sys.readDirectory,
    getNewLine: () => '\n',
};

const service = ts.createLanguageService(serviceHost, ts.createDocumentRegistry());

async function main() {
    let updated = 0;
    for (const file of files) {
        try {
            const content = fs.readFileSync(file, 'utf8');
            scriptSnapshots.set(file, content);
            scriptVersions.set(file, (scriptVersions.get(file) || 0) + 1);

            const changes = service.organizeImports(
                { type: 'file', fileName: file },
                {},
                {}
            );
            const fileChanges = changes.find(c => c.fileName === file);
            if (fileChanges && fileChanges.textChanges.length > 0) {
                let result = content;
                for (let i = fileChanges.textChanges.length - 1; i >= 0; i--) {
                    const c = fileChanges.textChanges[i];
                    result = result.slice(0, c.span.start) + c.newText + result.slice(c.span.start + c.span.length);
                }
                // Format with Prettier to avoid cycling with fmt-blanklines
                try {
                    result = await prettier.format(result, { ...PRETTIER_OPTS, filepath: file });
                } catch (e) {
                    // Prettier failed, continue with raw organizeImports result
                }
                if (result !== content) {
                    fs.writeFileSync(file, result, 'utf8');
                    scriptSnapshots.set(file, result);
                    updated++;
                }
            }
        } catch (e) {
            console.error(`  Error in ${path.basename(file)}: ${e.message}`);
        }
    }
    console.log(`Done: ${updated} files updated`);
}

main().catch(e => { console.error(e); process.exit(1); });
