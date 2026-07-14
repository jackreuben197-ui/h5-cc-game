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
    //0: http://dev.awanptest.com
    //1: http://test2.awanptest.com
    //2: http://dev1.awanptest.com
    //3: https://test2.awanptest.com
    //4: https://dev1.awanptest.com
    static readonly BUILD_TYPE: number = 5;
    //版本号
    static readonly VERSION: string = '20230109_2130';
    static readonly DEFAULT_LANGUAGE: string = 'cn';
    //是否启用声网 Agora（false 则跳过 SDK 加载、初始化等全部流程
    static readonly AGOROKEY: string = 'da91afd18fa84618bee90c5468b06a5f';
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
    private static setNetwork() {
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
        }
    }
}

GameConfig.init();

export { GameConfig };
