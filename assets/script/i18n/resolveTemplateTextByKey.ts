import i18n from '@silenthill/h5-cc-i18n';
import { i18nMgr } from './i18nMgr';

const PUBLIC_CACHE_DB_NAME = 'public_cache';

const PUBLIC_CACHE_DB_VERSION = 3;

const MULTI_LANGUAGE_TEMPLATE_STORE = 'multi_language_template';

interface MultiLanguageTemplateRecord {
    template_id?: string;
    cn_name?: string;
    us_name?: string;
    br_name?: string;
    multi_language?: MultiLanguageTemplateRecord;
}

const templateCache: Map<string, MultiLanguageTemplateRecord> = new Map();

/**
 * Cocos 端解析 H5 公共缓存中的多语言模板。
 * 名称仅用于展示，读取失败时会输出明确日志并保留原始模板 key，不影响进桌。
 */
export async function resolveTemplateTextByKey(rawName: string): Promise<string> {
    const safeName = typeof rawName === 'string' ? rawName.trim() : '';
    if (!safeName) {
        console.error('[resolveTemplateTextByKey] 赛事名称模板 key 为空');
        return '';
    }
    const [templateKey, ...suffixParts] = safeName.split('-');
    let record = templateCache.get(templateKey);
    if (!record) {
        try {
            record = await readTemplateRecord(templateKey);
            if (record) {
                templateCache.set(templateKey, record);
            }
        } catch (error) {
            console.error('[resolveTemplateTextByKey] 读取 multi_language_template 失败', templateKey, error);
            return safeName;
        }
    }
    if (!record) {
        console.error('[resolveTemplateTextByKey] 未找到多语言模板', templateKey);
        return safeName;
    }
    const source = record.multi_language && typeof record.multi_language === 'object' ? record.multi_language : record;
    const currentLocale = i18nMgr.getCurrentLocale();
    const localeField = getLocaleField(currentLocale);
    const localizedName = normalizeText(source[localeField]) || normalizeText(source.us_name);
    if (!localizedName) {
        console.error('[resolveTemplateTextByKey] 多语言模板没有可用名称', templateKey, currentLocale);
        return safeName;
    }
    return suffixParts.length > 0 ? `${localizedName}-${suffixParts.join('-')}` : localizedName;
}

function getLocaleField(locale: string): 'cn_name' | 'us_name' | 'br_name' {
    if (locale == i18n.LANG_PT) return 'br_name';
    if (locale == i18n.LANG_EN) return 'us_name';
    return 'cn_name';
}

function normalizeText(value: unknown): string {
    return typeof value === 'string' ? value.trim() : '';
}

function readTemplateRecord(templateKey: string): Promise<MultiLanguageTemplateRecord | null> {
    return openPublicCache().then(
        db =>
            new Promise<MultiLanguageTemplateRecord | null>((resolve, reject) => {
                if (!db.objectStoreNames.contains(MULTI_LANGUAGE_TEMPLATE_STORE)) {
                    db.close();
                    reject(new Error(`缺少 ${MULTI_LANGUAGE_TEMPLATE_STORE} object store`));
                    return;
                }
                const request = db.transaction(MULTI_LANGUAGE_TEMPLATE_STORE, 'readonly').objectStore(MULTI_LANGUAGE_TEMPLATE_STORE).get(templateKey);
                request.onsuccess = () => {
                    db.close();
                    resolve((request.result as MultiLanguageTemplateRecord | undefined) ?? null);
                };
                request.onerror = () => {
                    db.close();
                    reject(request.error);
                };
            })
    );
}

function openPublicCache(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
        if (!cc.sys.isBrowser || !window.indexedDB) {
            reject(new Error('当前运行环境不支持 IndexedDB'));
            return;
        }
        const request = window.indexedDB.open(PUBLIC_CACHE_DB_NAME, PUBLIC_CACHE_DB_VERSION);
        request.onupgradeneeded = () => {
            // Cocos 只读公共缓存；库尚未由 H5 创建时中止建库，避免生成缺少 store 的空库。
            request.transaction?.abort();
        };
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}
