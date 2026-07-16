/*
 * @Author: xfj
 * @Date: 2022-09-27 11:48:16
 * @description:
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-09-28 18:14:54
 * @FilePath: /pokerqueen/assets/script/net/https/HttpRequest.ts
 */
import { GameConfig } from '../../config/GameConfig';
import HotUpdateConfigCache from './HotUpdateConfigCache';
import HttpClient from './HttpClient';
// import WebHelper from './WebHelper';
import WebApiCacheCenter from './WebApiCacheCenter';

type HttpCallback = Function | null;

type HttpHeaders = Array<[string, string]> | any[] | null;

type HttpRequestParams = {
    api?: string | null;
    request?: any;
    body?: any;
    cuscomHost?: string | null;
    onSuccess?: HttpCallback;
    onFailure?: HttpCallback;
    headers?: HttpHeaders;
    isJson?: boolean;
    isGet?: boolean;
    juhua?: boolean;
    useCache?: boolean;
    silentTimeout?: boolean;
    timeoutMs?: number;
};

/**
 * HttpRequest 在HttpClient基础上包装一层
 */

export default class HttpRequest {
    static async Send({
        api = null,
        request = null,
        body = {},
        cuscomHost = null,
        onSuccess = null,
        onFailure = null,
        headers = null,
        isJson = true,
        isGet = false,
        juhua = true,
        useCache = false,
        silentTimeout = false,
        timeoutMs
    }: HttpRequestParams) {
        const host = cuscomHost || GameConfig.Network.WebHost || '';
        const finalApi = api || request?.API || '';
        if (!host || !finalApi) {
            return;
        }
        const method: 'GET' | 'POST' = isGet ? 'GET' : 'POST';
        const requestClassName = request?.name || 'WebCommon';
        const handledByCache = await HotUpdateConfigCache.HandleLegacyConfigRequest({
            api: finalApi,
            request,
            headers: headers || [],
            onSuccess
        });
        if (handledByCache) {
            return;
        }
        let url = host + finalApi;
        url = this.handleUrl(url);
        const { default: WebHelper } = await import('./WebHelper');
        const needJuhua = WebHelper.NeedJuhua(finalApi) && juhua;
        const needConsole = WebHelper.NeedConsole(finalApi);
        const shouldUseCache = !!useCache || (request && typeof request.CacheEnabled === 'boolean' ? request.CacheEnabled : false);
        const cacheContext = {
            api: finalApi,
            method,
            url,
            body,
            headers,
            requestClassName
        };
        const cacheKey = shouldUseCache
            ? typeof request?.BuildCacheKey === 'function'
                ? request.BuildCacheKey(cacheContext)
                : WebApiCacheCenter.buildDefaultKey(cacheContext)
            : '';
        const cacheTTL = shouldUseCache && typeof request?.CacheDataTTL === 'number' ? request.CacheDataTTL : WebApiCacheCenter.DEFAULT_DATA_TTL_MS;
        const skipRequestTTL =
            shouldUseCache && typeof request?.CacheNoRequestTTL === 'number'
                ? request.CacheNoRequestTTL
                : shouldUseCache && typeof request?.CacheTTL === 'number'
                  ? request.CacheTTL
                  : WebApiCacheCenter.DEFAULT_SKIP_REQUEST_TTL_MS;
        const cachedRecord = shouldUseCache ? WebApiCacheCenter.get(cacheKey, cacheTTL) : null;
        const canSkipRequest = !!cachedRecord && WebApiCacheCenter.isWithin(cachedRecord, skipRequestTTL);
        if (cachedRecord) {
            const cachedResponse = WebApiCacheCenter.deepClone(cachedRecord.response);
            (cachedResponse as any).__cacheMeta = {
                source: 'memory',
                key: cacheKey,
                ageMs: WebApiCacheCenter.ageMs(cachedRecord),
                skippedRequest: canSkipRequest
            };
            request && (request.Response = cachedResponse);
            // NotifyManager.instance.post(EventName.serverResponse, finalApi, (cachedResponse as any)?.data, body);
            console.log(
                `[HttpRequest][Cache] hit api=${finalApi} key=${cacheKey} ageMs=${WebApiCacheCenter.ageMs(cachedRecord)} skipRequest=${canSkipRequest}`
            );
            onSuccess && onSuccess(cachedResponse);
        } else if (shouldUseCache) {
            console.log(`[HttpRequest][Cache] miss api=${finalApi} key=${cacheKey}`);
        }
        if (canSkipRequest) {
            return;
        }
        const send = isGet ? HttpClient.get : HttpClient.post;
        await send({
            url: url,
            body: body,
            onFailure: function (error: any) {
                // 已返回缓存时，后台同步失败不打断界面流程
                if (cachedRecord) {
                    return;
                }
                onFailure && onFailure(error);
            },
            onSuccess: function (response: any) {
                if (!shouldUseCache) {
                    HttpRequest.onSuccess(finalApi, request, body, onSuccess, response);
                    return;
                }
                const normalized = typeof request?.NormalizeCacheResponse === 'function' ? request.NormalizeCacheResponse(response) : response;
                const hash =
                    typeof request?.ComputeCacheHash === 'function' ? request.ComputeCacheHash(normalized) : WebApiCacheCenter.hashFromJson(normalized);
                if (!cachedRecord) {
                    WebApiCacheCenter.set(cacheKey, normalized, hash);
                    console.log(`[HttpRequest][Cache] store api=${finalApi} key=${cacheKey} (no previous cache)`);
                    HttpRequest.onSuccess(finalApi, request, body, onSuccess, response);
                    return;
                }
                const shouldUpdate =
                    typeof request?.ShouldUpdateCache === 'function'
                        ? request.ShouldUpdateCache(cachedRecord.response, normalized, cachedRecord.hash, hash)
                        : cachedRecord.hash !== hash;
                if (!shouldUpdate) {
                    WebApiCacheCenter.touch(cacheKey);
                    console.log(`[HttpRequest][Cache] unchanged api=${finalApi} key=${cacheKey}`);
                    return;
                }
                WebApiCacheCenter.set(cacheKey, normalized, hash);
                console.log(`[HttpRequest][Cache] updated api=${finalApi} key=${cacheKey}`);
                HttpRequest.onSuccess(finalApi, request, body, onSuccess, response);
            },
            headers: headers,
            needJuhua: needJuhua,
            isJson: isJson,
            needConsole: needConsole,
            api: finalApi,
            silentTimeout,
            timeoutMs
        });
    }

    private static onSuccess(api: string, request: any, body: any, onSuccess: HttpCallback, response: any) {
        // NotifyManager.instance.post(EventName.serverResponse, api, response.data, body);
        request && (request.Response = response);
        onSuccess && onSuccess(response);
    }

    //代理转换
    public static handleUrl(url: string): string {
        // if (GameConfig.IsNewArea) {
        //     if (GameConfig.useProxy && url.indexOf("http://dev1.awanptesting.com/api/") > -1) {
        //         return url.replace("http://dev1.awanptesting.com/api/", "http://localhost:8080/")
        //     }
        // } else {
        //     if (GameConfig.useProxy && url.indexOf("http://dev.k8s.awanptesting.com:80/api/") > -1) {
        //         return url.replace("http://dev.k8s.awanptesting.com:80/api/", "http://localhost:8080/")
        //     }
        // }
        return url;
    }
    // 用于单独一个接口 需要https写死测试服务器用到
    // static async Send2({ api = null, request = null, body = {}, cuscomHost = null, onSuccess = null, onFailure = null, headers = null }: HttpRequestParams) {
    //     let host = 'http://dev.awanptesting.com';
    //     const finalApi = api || request?.API || '';
    //     if (!finalApi) {
    //         return;
    //     }
    //     let url = host + finalApi;
    //     url = this.handleUrl2(url);
    //     const { default: WebHelper } = await import('./WebHelper');
    //     let needJuhua = WebHelper.NeedJuhua(finalApi);
    //     await HttpClient.post({
    //         url: url,
    //         body,
    //         onFailure,
    //         onSuccess: HttpRequest.onSuccess2.bind(HttpRequest, request, onSuccess),
    //         headers: headers,
    //         needJuhua,
    //         api: finalApi
    //     });
    // }
    private static onSuccess2(request: any, onSuccess: HttpCallback, response: any) {
        request.Response = response;
        onSuccess && onSuccess(response);
    }

    //代理转换
    public static handleUrl2(url: string): string {
        // if (GameConfig.IsNewArea) {
        //     if (GameConfig.useProxy && url.indexOf("http://dev.awanptesting.com/api/") > -1) {
        //         return url.replace("http://dev.awanptesting.com/api/", "http://localhost:8080/")
        //     }
        // } else {
        //     if (GameConfig.useProxy && url.indexOf("http://dev.k8s.awanptesting.com:80/api/") > -1) {
        //         return url.replace("http://dev.k8s.awanptesting.com:80/api/", "http://localhost:8080/")
        //     }
        // }
        return url;
    }
}
