/*
 * @Author: xfj
 * @Date: 2022-09-19 17:20:26
 * @description:
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-03 19:34:48
 * @FilePath: /pokerqueen/assets/script/config/GameConfig.ts
 */
/**
 * GameConfig
 * 游戏配置
 */
import { LogLevel } from '../core/decorator/LogTrace';

interface INetWork {
    WebHost: string;
    WSS: string;
}

class GameConfig {
    static Web_Host_Test1 = 'test2.awanptest.com';
    static Web_Host_Dev1 = 'dev1.awanptest.com';
    static Web_Host_Dev = 'dev.awanptest.com';
    //OlaVamos 测试环境（与 h5-game 的 VITE_API_BASE_URL / websocket 同域，token 才通用）
    static Web_Host_Dev2 = 'preview.trackyourchoice.com';
    //0: http://dev.awanptest.com
    //1: http://test2.awanptest.com
    //2: http://dev1.awanptest.com
    //3: https://test2.awanptest.com
    //4: https://dev1.awanptest.com
    //5: https://test2.awanptest.com (outsource 旧测试环境)
    //6: https://preview.trackyourchoice.com (OlaVamos 测试环境)
    // ⚠️ Cocos 侧 HTTP 走 XMLHttpRequest 直连 GameConfig.Network.WebHost（不经 H5 桥接），
    //    若与 h5-game 登录所用后端不一致，token 会被拒绝 → {code:90010,'toke auth fail'}。
    static readonly BUILD_TYPE: number = 6;
    //版本号
    static readonly VERSION: string = '20230109_2130';
    static readonly DEFAULT_LANGUAGE: string = 'cn';
    //是否启用声网 Agora（false 则跳过 SDK 加载、初始化等全部流程
    static readonly AGOROKEY: string = 'e69ee18461df4de5a1880b2f20390047';
    static get enableAgora(): boolean {
        return !!GameConfig.AGOROKEY?.trim();
    }
    //设计分辨率
    static readonly DESIGN_RESOLUTION = cc.size(1440, 2688);
    //fps
    static readonly FRAME_RATE = 60;
    //多点触摸
    static readonly ENABLE_MULTI_TOUCH = false;
    //网络配置
    static Network: INetWork = null;
    //是否是发布版本
    static readonly IS_PUBLISHED: boolean = false;
    //日志等级
    public static LOG_LEVEL: LogLevel = 'debug';

    private constructor() {}

    private static _isReady = false;

    public static init() {
        if (!GameConfig._isReady) {
            GameConfig.setNetwork();
            GameConfig._isReady = true;
        }
    }

    //初始化网络配置（static 供其他 Procedure 在 H5 桥接模式下兜底调用）
    public static setNetwork() {
        // 生产环境：页面非已知测试域名时，与当前页面同域（反向代理）。
        // 一次构建多环境通用，无需为每个环境改 BUILD_TYPE 重新打包。
        const knownTestHosts = [
            GameConfig.Web_Host_Dev,
            GameConfig.Web_Host_Dev1,
            GameConfig.Web_Host_Dev2,
            GameConfig.Web_Host_Test1,
            'localhost',
            '127.0.0.1'
        ];
        const pageHost = typeof location !== 'undefined' ? location.hostname : '';
        if (pageHost && knownTestHosts.indexOf(pageHost) === -1) {
            const isHttps = location.protocol === 'https:';
            GameConfig.Network = {
                WebHost: location.origin,
                WSS: `${isHttps ? 'wss' : 'ws'}://${location.hostname}{0}`
            };
            return;
        }
        switch (GameConfig.BUILD_TYPE) {
            case 0:
                GameConfig.Network = {
                    WebHost: `http://${GameConfig.Web_Host_Dev}`,
                    WSS: `ws://${GameConfig.Web_Host_Dev}{0}`
                };
                break;
            case 1:
                GameConfig.Network = {
                    WebHost: `http://${GameConfig.Web_Host_Test1}`,
                    WSS: `ws://${GameConfig.Web_Host_Test1}{0}`
                };
                break;
            case 2:
                GameConfig.Network = {
                    WebHost: `http://${GameConfig.Web_Host_Dev1}`,
                    WSS: `ws://${GameConfig.Web_Host_Dev1}/api/channel/`
                };
                break;
            case 3:
                GameConfig.Network = {
                    WebHost: `https://${GameConfig.Web_Host_Test1}`,
                    WSS: `wss://${GameConfig.Web_Host_Test1}/api/channel/`
                };
                break;
            case 4:
                GameConfig.Network = {
                    WebHost: `https://${GameConfig.Web_Host_Dev1}`,
                    WSS: `wss://${GameConfig.Web_Host_Dev1}/api/channel/`
                };
                break;
            case 5:
                GameConfig.Network = {
                    WebHost: `https://${GameConfig.Web_Host_Test1}`,
                    WSS: `wss://${GameConfig.Web_Host_Test1}{0}`
                };
                break;
            case 6:
                GameConfig.Network = {
                    WebHost: `https://${GameConfig.Web_Host_Dev2}`,
                    WSS: `wss://${GameConfig.Web_Host_Dev2}{0}`
                };
                break;
        }
    }

    public static async setNetworkAsync() {
        if (await GameConfig.setNetworkFromConfigJson()) {
            return;
        }
        GameConfig.setNetwork();
    }

    /**
     * 从运行时 config.json 解析 WebHost 与 WSS。
     * - 生产环境（isTest: false）：直接使用 config.json 中的 baseApi (如 https://api.recognitionway.com/api)，
     *   保证在线正式环境直连生产后端，避免任何误测或退回到测试域名导致的 Token Auth Failure。
     * - 测试环境（isTest: true）：读取 apiDomains 列表，使用 no-cors 模式进行域名探活，
     *   按顺序选择首个可达的测试域名；若均不可达，则退回 baseApi / apiDomains[0]。
     */
    private static async setNetworkFromConfigJson(): Promise<boolean> {
        try {
            if (typeof fetch !== 'function' || typeof location === 'undefined') {
                return false;
            }
            // config.json 与 index.html 同级部署，按当前文档地址解析为同源绝对路径。
            const cleanHref = location.href.replace(/#.*$/, '');
            const configUrl = new URL('config.json', cleanHref).href + `?_=${Date.now()}`;
            const res = await fetch(configUrl, { cache: 'no-store' });
            if (!res.ok) {
                return false;
            }
            const data = await res.json();
            if (!data || typeof data !== 'object') {
                return false;
            }

            const isTest = data.isTest === true;
            let selectedApi: string = '';

            if (!isTest) {
                // 生产环境 (isTest: false): 优先使用 baseApi，无探活逻辑，确保与 H5 登录后端一致
                const baseApi = (typeof data.baseApi === 'string' ? data.baseApi : '').trim();
                if (baseApi && /^https?:\/\//i.test(baseApi)) {
                    selectedApi = baseApi;
                } else if (Array.isArray(data.apiDomains) && data.apiDomains.length > 0) {
                    const firstDomain = data.apiDomains[0];
                    if (typeof firstDomain === 'string' && /^https?:\/\//i.test(firstDomain.trim())) {
                        selectedApi = firstDomain.trim();
                    }
                }
            } else {
                // 测试环境 (isTest: true): 在 apiDomains 列表中进行探活（支持轮换/容灾域名）
                const rawCandidates: string[] = [];
                if (Array.isArray(data.apiDomains)) {
                    data.apiDomains.forEach((d: unknown) => {
                        if (typeof d === 'string' && d.trim() && /^https?:\/\//i.test(d.trim())) {
                            rawCandidates.push(d.trim());
                        }
                    });
                }
                if (typeof data.baseApi === 'string' && data.baseApi.trim() && /^https?:\/\//i.test(data.baseApi.trim())) {
                    if (rawCandidates.indexOf(data.baseApi.trim()) === -1) {
                        rawCandidates.push(data.baseApi.trim());
                    }
                }

                if (rawCandidates.length > 0) {
                    const probeApi = async (candidateUrl: string): Promise<boolean> => {
                        const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
                        const timer = controller ? setTimeout(() => controller.abort(), 2500) : null;
                        try {
                            // mode: 'no-cors' 探活，判断服务器是否有响应（网络/DNS失败会抛异常）
                            await fetch(candidateUrl, {
                                method: 'GET',
                                mode: 'no-cors',
                                cache: 'no-store',
                                signal: controller ? controller.signal : undefined
                            });
                            return true;
                        } catch (e) {
                            return false;
                        } finally {
                            if (timer) clearTimeout(timer);
                        }
                    };

                    const results = await Promise.all(rawCandidates.map(c => probeApi(c)));
                    const firstReachable = rawCandidates.find((_, idx) => results[idx]);
                    selectedApi = firstReachable || rawCandidates[0];
                }
            }

            if (!selectedApi || !/^https?:\/\//i.test(selectedApi)) {
                return false;
            }

            const apiUrl = new URL(selectedApi);
            // 去掉结尾的 /api 或 /api/，得到纯域名前缀作为 WebHost
            const webHost = selectedApi.replace(/\/+$/, '').replace(/\/api$/i, '');
            const wsProtocol = apiUrl.protocol === 'https:' ? 'wss' : 'ws';

            GameConfig.Network = {
                WebHost: webHost,
                WSS: `${wsProtocol}://${apiUrl.hostname}{0}`
            };
            return true;
        } catch (e) {
            return false;
        }
    }
}

GameConfig.init();

export { GameConfig };
