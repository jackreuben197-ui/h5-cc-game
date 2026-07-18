/**
 * Http请求接口
 */
import HttpRequest, { HttpRequestParams } from './HttpRequest';
import WebApiCacheCenter, { WebApiCacheContext } from './WebApiCacheCenter';

export class WebCommon {
    public static API: string;
    public static RequestParams: any;
    public static ResponseData: any;
    public static CacheEnabled: boolean = false;
    public static CacheTTL: number = 0;

    public static Request(param: any) {
        this.RequestParams = param;
        return param;
    }

    public static BuildCacheKey(context: WebApiCacheContext): string {
        return WebApiCacheCenter.buildDefaultKey(context);
    }

    public static NormalizeCacheResponse<T = any>(response: T): T {
        return response;
    }

    public static ComputeCacheHash(response: any): string {
        return WebApiCacheCenter.hashFromJson(response);
    }

    public static ShouldUpdateCache(previousResponse: any, nextResponse: any, previousHash: string, nextHash: string): boolean {
        return previousHash !== nextHash;
    }

    public static Response: {
        code?: number;
        message?: string;
        data?: any;
    };
}

export class WWW {
    public static get Instance(): WWW {
        return ((this as any).__Instance ??= new WWW());
    }

    /**
     * @param param
     * web_class 接口类
     * body 发送数据body
     * api_id 替换接口中{id}
     * club_id 公会club_id
     * 范例
     * WWW.Instance.CommonAPI(
            {
                web_class: WebClubApplyAudit,
                body: {
                    apply_id: 111,
                    audit_op: 2//2同意 3拒绝
                },
                club_id: ClubCache.club_id
            }
        ).then(
            (res: any) => {
                this.reqInfo();
            },
            (res: any) => {
            }
        )
     * @returns
     */
    public async CommonAPI<T>(param: {
        web_class: { API: string; Request: (param: any) => any; Response: any };
        body?: any;
        api_id?: number;
        club_id?: number;
        juhua?: boolean;
        useCache?: boolean;
        timeoutRetryCount?: number;
        timeoutRetryIntervalMs?: number;
        timeoutMs?: number;
    }): Promise<T> {
        const timeoutRetryCount = Math.max(0, param.timeoutRetryCount || 0);
        const timeoutRetryIntervalMs = Math.max(0, param.timeoutRetryIntervalMs || 0);
        let retriedCount = 0;
        while (true) {
            try {
                return await new Promise<T>((resolve, reject) => {
                    let obj: HttpRequestParams = {
                        request: param.web_class,
                        body: param.web_class.Request(param.body),
                        onSuccess: function () {
                            resolve(param.web_class.Response as T);
                        }.bind(this),
                        onFailure: function (content: any) {
                            reject(content);
                        }.bind(this),
                        juhua: param.juhua,
                        useCache: !!param.useCache,
                        silentTimeout: timeoutRetryCount > 0,
                        timeoutMs: param.timeoutMs,
                        waitForNetwork: timeoutRetryCount > 0
                    };
                    (param.api_id ?? 0) > 0 && (obj.api = param.web_class.API.replace('{id}', `${param.api_id}`));
                    let headers = [];
                    (param.club_id ?? 0) > 0 && headers.push(['X-Club', param.club_id]);
                    obj.headers = headers;
                    HttpRequest.Send(obj);
                });
            } catch (error) {
                if (error !== 'timeout' || retriedCount >= timeoutRetryCount) {
                    throw error;
                }
                retriedCount++;
                await new Promise(resolve => setTimeout(resolve, timeoutRetryIntervalMs));
            }
        }
    }
}
