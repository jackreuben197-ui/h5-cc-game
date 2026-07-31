import storageManager from '../data/LocalStorage';
import StorageKey from '../data/StorageKey';
import * as i18nLabel from './i18nLabel';
// import * as i18nSprite from './i18nSprite';
import i18n from '@silenthill/h5-cc-i18n';

//var CSV = require("CSV");
//上来先处理数据 当前的语言 0简中 1繁中 2英文 3葡语  let type = ["cn","zh","en","pt"]
var LanguageAllObject: Record<string, { [key: string]: string }> = {
    cn: {},
    zh: {},
    en: {},
    pt: {}
};

//补充一些表格内缺失的,优先判断
var excelAdd = {
    // en: {
    //     UILogin_USER101: "Read and agree to<color = #DCBA82>《User Agreement》</color>",
    //     UISettingPassword001: "Account Management",
    // },
    // cn: {
    //     UISettingPassword001: "账号管理",
    // },
    // zh: {
    //     UISettingPassword001: "賬號管理",
    // },
    // pt: {
    //     UISettingPassword001: "Gestão de contas",
    // }
};

export class i18nMgr {
    public static language = ''; // 当前语言
    private static labelArr: i18nLabel.i18nLabel[] = []; // i18nLabel 列表
    // private static LanguageObject: { [key: string]: string } = {}; // 文字配置
    // private static spriteArr: i18nSprite.i18nSprite[] = []; // i18nSprite 列表
    // private static LanMap = {
    //     cn: "sl_bnftN7UY",
    //     pt: "sl_ptyyPutao",
    //     en: "sl_K8cPNvxU",
    // }
    public static isCN() {
        return this.getCurrentLocale() == i18n.LANG_ZH_CN;
    }

    public static getCurrentLocale(): string {
        return i18n.currentLocale;
    }

    public static initLanguage() {
        // H5 会在握手完成后再同步一次；握手前先沿用页面级 runtime 已设置的语言，
        // 避免 Cocos 延迟初始化把 H5 当前语言覆盖成默认简中。
        this.setLanguage(i18n.currentLocale || 'cn');
    }

    /**
     * 设置语言
     */
    public static setLanguage(language: string): boolean {
        const resolved = this.resolveLanguage(language);
        if (!resolved) return false;

        const changed = this.language !== resolved.code || i18n.currentLocale !== resolved.locale;
        this.language = resolved.code;
        i18n.setLocale(resolved.locale);
        storageManager.setItem(StorageKey.LANGUAGE, this.language);
        if (changed) {
            this.refreshAllLabel();
        }
        // this.reloadSprite();
        //this.resetRemoteSprite();
        return true;
    }

    // 观察所有与多语言有关的图片 重新调用服务器接口
    public static resetRemoteSprite() {
        // zh_CN:简体中文,zh_HK:繁体中文,en_US:英文，pt_BR：葡萄牙语
        // let changeObj = {
        //     cn: "zh_CN",
        //     zh: "zh_HK",
        //     en: "en_US",
        //     pt: "pt_BR"
        // }
        // if (UIMatchBanner.instance) {
        //     UIMatchBanner.instance.initBannerList(changeObj[this.language]);
        // }
    }

    /**
     * 添加或移除 i18nLabel
     */
    public static _addOrDelLabel(label: i18nLabel.i18nLabel, isAdd: boolean) {
        if (isAdd) {
            this.labelArr.push(label);
        } else {
            let index = this.labelArr.indexOf(label);
            if (index !== -1) {
                this.labelArr.splice(index, 1);
            }
        }
    }

    public static _getLabel(opt: string): string {
        return this.Get(opt);
    }

    //从表格获取内容
    public static Get(opt: string): string {
        return i18n.get(opt).replace(/\\n/g, '\n');
        //return this.LanguageObject?.[opt] || opt;
    }

    private static resolveLanguage(language: string): { code: string; locale: string } | null {
        const normalized = String(language || '')
            .trim()
            .toLowerCase()
            .replace(/_/g, '-');

        if (normalized === 'cn' || normalized === 'zh-cn' || normalized === 'zh-hans') {
            return { code: 'cn', locale: i18n.LANG_ZH_CN };
        }
        if (
            normalized === 'zh' ||
            normalized === 'tw' ||
            normalized === 'hk' ||
            normalized === 'zh-tw' ||
            normalized === 'zh-hk' ||
            normalized === 'zh-hant'
        ) {
            return { code: 'zh', locale: i18n.LANG_ZH_TW };
        }
        if (normalized === 'en' || normalized.startsWith('en-')) {
            return { code: 'en', locale: i18n.LANG_EN };
        }
        if (normalized === 'pt' || normalized === 'br' || normalized.startsWith('pt-')) {
            return { code: 'pt', locale: i18n.LANG_PT };
        }
        return null;
    }
    /**
     * 添加或移除 i18nSprite
     */
    // public static _addOrDelSprite(sprite: i18nSprite.i18nSprite, isAdd: boolean) {
    //     if (isAdd) {
    //         this.spriteArr.push(sprite);
    //     } else {
    //         let index = this.spriteArr.indexOf(sprite);
    //         if (index !== -1) {
    //             this.spriteArr.splice(index, 1);
    //         }
    //     }
    // }
    // public static _getSprite(path: string, cb: (spriteFrame: cc.SpriteFrame) => void) {
    //     cc.resources.load('main/i18n/sprite/' + this.language + '/' + path, cc.SpriteFrame, (err, spriteFrame: cc.SpriteFrame) => {
    //         if (err) {
    //             return cb(null);
    //         }
    //         cb(spriteFrame);
    //     });
    // }

    /**
     * @description: 此方法读取Language里面的数据 再根据语言类型分配相应的字符串
     * @return {*}
     */
    private static refreshAllLabel() {
        for (let one of this.labelArr) {
            one._resetValue();
        }
        //GC.notify.post(EventName.switchLanguages);
    }

    public static _praseConfig(language: string, config: cc.TextAsset) {
        if (config && config.text) {
            let list = config.text.split('\n');
            for (let item of list) {
                let eq_index = item.indexOf('=');
                if (~eq_index) {
                    let key = item.slice(0, eq_index);
                    let value = item.slice(eq_index + 1);
                    value = value.replace('\r', '');
                    value = value.replace(/\\n/g, '\n');
                    LanguageAllObject[language][key] = value;
                }
            }
        }
    }

    /**
     * 通过 cc.resources.load 加载词典资源并刷新 UI。
     * 走 Cocos 资源管道，自动享受 md5Cache 缓存刷新。
     */
    public static async loadAndRefreshConfig(): Promise<void> {
        // const tasks = [
        //     this._loadConfig('en', 'config/USER_EN'),
        //     this._loadConfig('pt', 'config/USER_PT'),
        //     this._loadConfig('zh', 'config/USER_TW'),
        //     this._loadConfig('cn', 'config/USER_ZH')
        // ];
        // await Promise.all(tasks);
        // this.LanguageObject = LanguageAllObject[this.language];
        // this.refreshAllLabel();
    }

    private static async _loadConfig(language: string, path: string): Promise<void> {
        // return new Promise(resolve => {
        //     cc.resources.load(path, cc.TextAsset, (err, asset: cc.TextAsset) => {
        //         if (!err && asset) {
        //             i18nMgr._praseConfig(language, asset);
        //         }
        //         resolve();
        //     });
        // });
    }
    // public static get LanguageAllObject() {
    //     return LanguageAllObject;
    // }
    // private static reloadSprite() {
    //     for (let one of this.spriteArr) {
    //         one._resetValue();
    //     }
    // }
}
// //@ts-ignore
// window.i18nMgr = i18nMgr;
// //@ts-ignore
// window.LanguageAllObject = LanguageAllObject;
/**
 * 读取语言配置文件_csv格式
 */
// public static loadLanguage_csv() {
//     return new Promise((resolve, reject) => {
//         cc.resources.load("i18n/Language", (err, data: cc.TextAsset) => {
//             if (err) {
//                 reject(err);
//             } else {
//                 var _csv = new CSV(data.text, { header: true });
//                 var _con = _csv.parse();
//                 for (let i = 0; i < _con.length; i++) {
//                     let val = _con[i];
//                     if (val.key) {
//                         LanguageAllObject.cn[val.key] = val.cn;
//                         LanguageAllObject.zh[val.key] = val.zh;
//                         LanguageAllObject.en[val.key] = val.en;
//                         LanguageAllObject.pt[val.key] = val.pt;
//                     }
//                 }
//                 resolve(1);
//             }
//         });
//     });
// }
