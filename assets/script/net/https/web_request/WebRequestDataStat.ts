import { WebCommon } from '../WebRequestBase';

type RequestParamsOf<T extends { RequestParams?: unknown }> = T extends {
    RequestParams: infer R;
}
    ? R
    : Record<string, unknown>;

type ResponseDataOf<T extends { ResponseData?: unknown }> = T extends {
    ResponseData: infer R;
}
    ? R
    : unknown;
// ===== Unity Added APIs (Auto Generated) =====
// count: 319

export class WebWeb2DataStatPerson extends WebCommon {
    //接口地址
    static API: string = '/api/data_stat/person';
    //字段声明
    static RequestParams: {
        breakRandomId?: number; //1 room 2 mtt 3 mttroom
        breakUserId?: number; //条目
        roomPath?: number; //开始下标。例子（offset=0，limit=10，0-9。）
        timeType?: number; //游戏类型，对应客户端 枚举 GameType
    } | null = null;
    static Data: {
        breakPrice: string; // 破隐需要的金豆数
        imageType: number; // 影像数据级别 1=生涯 ， 2=30天 ， 3=7天
        totalHand: number; // omaha,普通局特有参数.总手数
        CBet: number; // omaha,普通局特有参数.4Flop持续下注率 如20%返回20即可
        AF: string; // omaha,普通局特有参数.激进程度
        fantasy: number; // 大菠萝特有参数.进范率.如20%返回20即可
        handAverage: number; // 大菠萝特有参数.手牌平均分
        thirdTimes: number; // sng mtt特有参数.第三名次数
        totalGameCnt: number; // omaha,普通局特有参数.总局数
        totalEarn: number; // 总战绩
        VPIP: number; // omaha,普通局特有参数.入池率 如20%返回20即可
        breakStatus: number; // 能否有权限破隐 1401-无权破隐 1402-已破隐（只有已破隐), 1403-可破隐(未破隐)
        threeBet: number; // omaha,普通局特有参数.翻牌前再加注率 如20%返回20即可
        roomPath: number; // 牌局:61-普通局, 71-MTT, 81-SNG 91-奥马哈 51-大菠萝
        PRF: number; // omaha,普通局特有参数.翻牌前加注率 如20%返回20即可
        WTSD: number; // omaha,普通局特有参数.摊牌胜率.如20%返回20即可
        Allin_Wins: number; // omaha,普通局特有参数.全下胜率.如20%返回20即可
        papWins: number; // 大菠萝特有参数.胜率.如20%返回20即可
        fantasyAverage: number; // 大菠萝特有参数.进范平均分
        winTimes: number; // sng mtt特有参数.获奖次数
        firstTimes: number; // sng mtt特有参数.第一名次数
        secondTimes: number; // sng mtt特有参数.第二名次数
        playTimes: number; // sng mtt特有参数.参赛次数
        Wins: number; // omaha,普通局特有参数.入池胜率 如20%返回20即可
    } | null = null;
    static ResponseData: {
        status: number;
        msg: string;
        data?: typeof WebWeb2DataStatPerson.Data;
    } | null = null;

    static Request(param: typeof WebWeb2DataStatPerson.RequestParams) {
        this.RequestParams = param;
        return param;
    }

    static Response: {
        code?: number;
        message?: string;
        data?: typeof WebWeb2DataStatPerson.ResponseData;
    };
}
