import { traceClass } from '../../core/decorator/LogTrace';
import userStore from '../../data/user/UserStore';
import { CPErrorCode } from '../../i18n/CPErrorCode';
import { i18nMgr } from '../../i18n/i18nMgr';
import CCTools from '../../tools/CCTools';
import viewManager from '../../views/UIViewManager';
import { WebClubApplyList, WebClubFundAudit, WebGuildGiveRecyCle } from './WebRequest';

type HttpCallback = Function | null;

type HttpHeaders = Array<[string, string]> | any[] | null;

type HttpSendParams = {
    url?: string;
    body?: any;
    onFailure?: HttpCallback;
    onSuccess?: HttpCallback;
    headers?: HttpHeaders;
    needJuhua?: boolean;
    isJson?: boolean;
    needConsole?: boolean;
    api?: string;
    silentTimeout?: boolean;
    timeoutMs?: number;
};

/**
 * Http端
 */
@traceClass()
export default class HttpClient {
    //超时时间设置(毫秒)
    static TimeOut: number = 10000;

    /**s
     * post 请求
     * headers 头文件 格式 [["name1","value"],["name2","value"]];
     */
    static async post({
        url = '',
        body = {},
        onFailure = null,
        onSuccess = null,
        headers = null,
        needJuhua = true,
        isJson = true,
        needConsole = true,
        api = '',
        silentTimeout = false,
        timeoutMs = HttpClient.TimeOut
    }: HttpSendParams) {
        const rawBody = body;
        if (isJson) {
            body = JSON.stringify(body);
        }
        needConsole && HttpClient.tracelog.debug('>>>>> http post - request : ', url, rawBody);
        needJuhua && viewManager.showPrompting();
        let response: string = await HttpClient.__request(url, false, body, headers, isJson, timeoutMs);
        needJuhua && viewManager.hidePrompting();
        let obj = response;
        if (obj != 'timeout' && obj != 'error') obj = JSON.parse(obj);
        needConsole && HttpClient.tracelog.debug('>>>>> http post - response : ', url, obj);
        HttpClient.__response(response, onFailure, onSuccess, api, silentTimeout);
    }

    /**
     * get 请求
     */
    static async get({
        url = '',
        body = {},
        onFailure = null,
        onSuccess = null,
        headers = null,
        needJuhua = true,
        isJson = true,
        needConsole = true,
        api = '',
        silentTimeout = false,
        timeoutMs = HttpClient.TimeOut
    }: HttpSendParams) {
        body = JSON.stringify(body);
        needConsole && HttpClient.tracelog.debug('>>>>> http get - request : ', url, body);
        needJuhua && viewManager.showPrompting();
        let response: string = await HttpClient.__request(url, true, body, headers, isJson, timeoutMs);
        needJuhua && viewManager.hidePrompting();
        needConsole && HttpClient.tracelog.debug('>>>>> http get - response : ', url, response);
        HttpClient.__response(response, onFailure, onSuccess, api, silentTimeout);
    }

    static __response(response: string, onFailure: HttpCallback, onSuccess: HttpCallback, api: string, silentTimeout: boolean) {
        switch (response) {
            case 'timeout':
                if (!silentTimeout) {
                    viewManager.showToast(CPErrorCode.LanguageDescription(10126));
                }
                onFailure && onFailure(response);
                break;
            case 'error':
                viewManager.showToast(i18nMgr.Get('errorDefault'));
                onFailure && onFailure(response);
                break;
            default:
                let response_json: any;
                try {
                    response_json = JSON.parse(response);
                } catch (e) {
                    //json 解析异常
                    viewManager.showToast(i18nMgr.Get('json_exception'));
                    onFailure && onFailure(null);
                    return;
                }
                if (response_json?.code == 0) {
                    onSuccess && onSuccess(response_json);
                } else {
                    //错误码处理
                    HttpCodeHandler(api, response_json.code, response_json.message);
                    onFailure && onFailure(response_json);
                }
                break;
        }
    }

    static async __request(
        url: string,
        isGet: boolean = false,
        body: any = null,
        headers: HttpHeaders = null,
        isJson: boolean = true,
        timeoutMs: number = HttpClient.TimeOut
    ): Promise<string> {
        return new Promise((resolve, reject) => {
            var xhr = new XMLHttpRequest();
            var isTimeout = false; //是否超时
            var timer = setTimeout(function () {
                isTimeout = true;
                xhr.abort(); //请求中止
                resolve('timeout');
            }, timeoutMs);
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && xhr.status >= 200 && xhr.status < 400) {
                    var response = xhr.responseText;
                    if (isTimeout) return; //请求已经超时，忽略
                    clearTimeout(timer); //取消等待的超时
                    resolve(response);
                }
            };
            xhr.onerror = function () {
                if (isTimeout) return; //请求已经超时，忽略
                clearTimeout(timer); //取消等待的超时d
                resolve('error');
            };
            xhr.ontimeout = function () {
                if (isTimeout) return; //请求已经超时，忽略
                clearTimeout(timer); //取消等待的超时
                resolve('timeout');
            };
            let reqUrl = this.checkGetUrl(url, body, isGet);
            xhr.open(isGet ? 'GET' : 'POST', reqUrl);
            xhr.timeout = timeoutMs;
            if (isJson) {
                xhr.setRequestHeader('Content-Type', 'application/json');
            }
            //xhr.setRequestHeader("Access-Control-Allow-Origin", "*");
            xhr.setRequestHeader('md5at', userStore.token);
            if (headers) {
                for (let header of headers) {
                    xhr.setRequestHeader(header[0], header[1]);
                }
            }
            // let strToDebug: string = this.xhrToCurl(xhr);
            // console.log(strToDebug);
            xhr.send(body ? body : null);
        });
    }

    static xhrToCurl(xhrConfig: any) {
        // 假设 xhrConfig 是你发送请求时的配置对象
        const { method, url, headers, data } = xhrConfig;
        let curl = `curl '${url}'`;
        curl += ` -X ${method}`;
        // 遍历并添加请求头
        for (let key in headers) {
            curl += ` -H '${key}: ${headers[key]}'`;
        }
        // 如果有数据体（如 POST 请求）
        if (data) {
            const body = typeof data === 'object' ? JSON.stringify(data) : data;
            curl += ` --data-raw '${body}'`;
        }
        return curl;
    }

    static checkGetUrl(reqUrl: string, body: any, isGet: boolean) {
        if (isGet) {
            reqUrl = this.getUrlParams(reqUrl, body);
        }
        return reqUrl;
    }

    static getUrlParams(url: string, param: any = null) {
        if (!CCTools.isNull(param)) {
            let paramStr: string = '';
            for (let key in param) {
                paramStr += `&{${key}}={${param[key]}}`;
            }
            url += '?' + paramStr.slice(1);
        }
        return url;
    }
}

let filter_codes = [10014];

//HTTP请求的错误码处理
let HttpCodeHandler = (api: string, code: number, message: string = '') => {
    //充值失败
    if (WebClubFundAudit.API == api) {
        viewManager.showToast(i18nMgr.Get('UISupplememtDetails_cz_fail'));
        return;
    }
    //公会内部桌请求申请列表d
    if (WebClubApplyList.API == api || WebGuildGiveRecyCle.API == api) {
        return;
    }
    if (filter_codes.includes(code)) return;
    switch (code) {
        case 90001:
        case 90003:
        case 20038:
            message?.length > 0 && viewManager.showToast(message);
            break;
        default:
            viewManager.showToast(CPErrorCode.ServerErrorDescription(code));
            break;
    }
};
