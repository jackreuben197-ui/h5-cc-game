import CCTools from '../tools/CCTools';
import StorageKey from './StorageKey';

class LocalStoreManager {
    private static _instance: LocalStoreManager = null;
    static get instance() {
        if (!LocalStoreManager._instance) {
            LocalStoreManager._instance = new LocalStoreManager();
        }
        return LocalStoreManager._instance;
    }
    private _keyPre = 'moyu_';
    get keyPre() {
        // let userId = GC?.data?.user?.info?.user_id || "";
        let userId = '';
        return `${this._keyPre}${userId}`;
    }
    set keyPre(value: string) {
        value && (this._keyPre = value);
    }

    setItem(key: string, value: any) {
        if (CCTools.isNull(value)) {
            value = null;
        }
        cc.sys.localStorage.setItem(this.keyPre + key, this.encryptData(value));
    }

    getItem(key: string, df: any = null) {
        let value = cc.sys.localStorage.getItem(this.keyPre + key);
        if (Boolean(value)) {
            df = this.decodeData(value);
        }
        return df;
    }

    removeItem(key: string) {
        cc.sys.localStorage.removeItem(this.keyPre + key);
    }

    clear() {
        cc.sys.localStorage.clear();
    }

    //加密压缩
    private encryptData(value: Record<string, any>) {
        let str = JSON.stringify(value);
        return str;
    }

    //解密 解压缩
    private decodeData(value: string) {
        value = JSON.parse(value);
        return value;
    }

    public get canShowSquidIntroDialog(): boolean {
        const lastUploadTimeStr = this.getItem(StorageKey.SHOW_SQULD_INTRO_DIALOG) || '';
        if (!lastUploadTimeStr) {
            return true;
        }
        const lastUploadTime = new Date(lastUploadTimeStr);
        if (Number.isNaN(lastUploadTime.getTime())) {
            return true;
        }
        return Date.now() - lastUploadTime.getTime() >= 24 * 60 * 60 * 1000;
    }
    public set canShowSquidIntroDialog(b: boolean) {
        if (b) {
            this.setItem(StorageKey.SHOW_SQULD_INTRO_DIALOG, new Date().toISOString());
        } else {
            this.setItem(StorageKey.SHOW_SQULD_INTRO_DIALOG, '');
        }
    }
}

const storageManager = LocalStoreManager.instance;

export default storageManager;
