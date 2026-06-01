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

export interface INetWork {
    WebHost: string;
    WSS: string;
}

export class GameConfig {
    //需要清理storage,就递增这个值
    static clean_all_flag: number = 2;
    static debug: boolean = true;
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
    //是否使用代理
    static useProxy: boolean = false;
    //是否启用声网 Agora（false 则跳过 SDK 加载、初始化等全部流程）
    static enableAgora: boolean = true;
    //是否使用新域名
    //static IsNewArea: boolean = false;
    //设计分辨率
    static DesignResolution = cc.size(1242, 2688);
    //fps
    static readonly FRAME_RATE = 60;
    //多点触摸
    static readonly ENABLE_MULTI_TOUCH = false;
    //服务器类型 1测试 2正式
    static Server_Type = 2;
    //对应 GlobalProto.txt
    static GlobalProto: any = null;
    //网络配置
    static Network: INetWork = null;
    //默认区号
    static DefaultAreaCode: string = '+55';
    //是否是发布版本
    static readonly IS_PUBLISHED: boolean = false;
}
/**
 * 网络配置
 */
// export var NetWorkBase = {
//     WebHostIP: "152.70.234.14",
//     LoginHostIP: "152.70.234.14",
//     LoginPort: "8058",
//     APIPort: "5060",
//     PayPort: "9403",
//     HeadPort: "5051",
//     PaipuPort: "6038",
//     UploadPort: "5050",
//     UseDNS: "false",
//     AboutWeURL: "xxx",
//     UserAgentURL: "xxx",
//     DataAnalysisURL: "xxx",
// }
// /**
//  * 语言列表
//  */
// export var LanguageList: { lan: string, name: string }[] = [
//     { lan: "en", name: "UILogin_USA" },
//     { lan: "pt", name: "sl_ptyyPutao" },
//     { lan: "cn", name: "UILogin_China" },
// ];
// /**
//  * Log样式
//  */
// export var LogStyle = {
//     http_request: 'color:yellow;background:#1E1E1E',
//     http_response: 'color:#38A7F1;background:#1E1E1E',
//     ws_request: 'color:#E3C127;background:#47100A',
//     ws_response: 'color:#19FF00;background:#47100A'
// };
// export var TextColor = {
//     Color1: '#FFFFFF',
//     Color2: '#35A3B3',
//     Color3: '#757CAB',
//     Color4: '#7187FF',
//     Color5: '#B0FFAE',
//     Color6: '#FF7C7C',
//     Color7: '#EEF5FF',
//     Color8: '#FEEC8E'
// };
// export var Member_Order_List = [
//     { show: "UIGuild_MemberManagerSortByWinOrLose", index: 0, icon: "Up", sort_type: 1, order_type: 1 },
//     { show: "UIGuild_MemberManagerSortByHands", index: 2, icon: "Up", sort_type: 2, order_type: 1 },
//     { show: "UIGuild_MemberManagerSortByServiceFee", index: 4, icon: "Up", sort_type: 3, order_type: 1 },
//     { show: "UIGuild_MemberManagerSortByLastLoginTime", index: 6, icon: "Up", sort_type: 4, order_type: 1 },
// ];
// export var Tabs_Status = {
//     [-1]: [0, 0, 0, 0, 0, 0],
//     0: [1, 0, 0, 0, 0, 0],
//     1: [0, 1, 0, 0, 0, 0],
//     2: [0, 0, 1, 0, 0, 0],
//     3: [0, 0, 0, 1, 0, 0],
//     4: [0, 0, 0, 0, 1, 0],
//     5: [0, 0, 0, 0, 0, 1],
// };
// export function GetGameTypeName(data: any): string {
//     let str = "NLH";
//     if (data.game_type == 1) {
//         str = "PLO4";
//     } else if (data.game_type == 2) {
//         str = "PLO5";
//     } else if (data.game_type == 3) {
//         str = "PLO6";
//     } else if (data.poker_type == 2) {
//         str = "6+";
//     }
//     return str;
// }
