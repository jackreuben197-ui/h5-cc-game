import { i18nMgr } from './i18nMgr';

export class CPErrorCode {
    public static ServerErrorDescription(errorCode: number): string {
        const errorKey = `ServerErrorCode_${errorCode}`;
        const errDes = i18nMgr.Get(errorKey);
        return errDes && errDes !== errorKey ? errDes : '';
    }

    public static LanguageDescription(LanguageCode: number, strParams: any[] = null): string {
        let errDes = i18nMgr.Get(`adaptation${LanguageCode}`);
        //LanguageManager.Get($"adaptation{LanguageCode}");
        if (errDes == null) {
            errDes = `LanguageCodeIsNull(${LanguageCode})`;
        }
        if (null == strParams) return errDes;
        strParams.forEach(item => {
            errDes = errDes.replace('##', item);
        });
        return errDes;
    }
}

(window as any).CPErrorCode = CPErrorCode;
