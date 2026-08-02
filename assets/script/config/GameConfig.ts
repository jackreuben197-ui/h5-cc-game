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
    static readonly DESIGN_RESOLUTION = cc.size(1242, 2688);
    //fps
    static readonly FRAME_RATE = 60;
    //多点触摸
    static readonly ENABLE_MULTI_TOUCH = false;
    //网络配置
    static Network: INetWork = null;
    //是否是发布版本
    static readonly IS_PUBLISHED: boolean = false;
    //日志等级
    public static LOG_LEVEL: LogLevel = 'warn';

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
     * 从运行时 config.json 的 baseApi 推导 WebHost 与 WSS。
     * 成功（拿到合法的绝对地址 baseApi）返回 true，调用方据此跳过旧的 BUILD_TYPE 逻辑。
     * - WebHost：baseApi 去掉结尾的 /api（接口常量已自带 /api 前缀），避免出现 //api/api。
     * - WSS：取 baseApi 的 hostname，按协议拼 wss/ws，保留 {0} 占位符交给 WebSocketClient.SetPort。
     */
    private static async setNetworkFromConfigJson(): Promise<boolean> {
        try {
            if (typeof fetch !== 'function' || typeof location === 'undefined') {
                return false;
            }
            // config.json 与 index.html 同级部署，按当前文档地址解析为同源绝对路径。
            const configUrl = new URL('config.json', location.href).href + `?_=${Date.now()}`;
            const res = await fetch(configUrl, { cache: 'no-store' });
            if (!res.ok) {
                return false;
            }
            const data = await res.json();
            const baseApi = (data && typeof data.baseApi === 'string' ? data.baseApi : '').trim();
            if (!/^https?:\/\//i.test(baseApi)) {
                return false;
            }
            const apiUrl = new URL(baseApi);
            // 去掉结尾的 /api 或 /api/，得到纯域名前缀作为 WebHost。
            const webHost = baseApi.replace(/\/+$/, '').replace(/\/api$/i, '');
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
