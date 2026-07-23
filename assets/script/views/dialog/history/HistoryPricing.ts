import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import diamondModel, { DiamondConfig } from '../../../data/trade/DiamondModel';
import { DiamondConfigType } from '../../../game/constant/DiamondConfigType';
import TexasTableEvent from '../../scene/room/texas/events/TexasTableEvent';

/** 偷偷看阶梯计价: type_ext = 11 + 10 * 已付费次数,超过4次按4次档 */
const PEEK_TIER_BASE = 11;

const PEEK_TIER_STEP = 10;

const PEEK_TIER_MAX = 4;

/** 发发看: type_ext 千位 = 轮次(1 flop / 2 turn / 3 river) */
const VIEW_PUB_ROUND_EXT = 1000;

// 牌谱付费点的钻石价格计算,把 type_ext 编码规则和小盲档位匹配收拢在一处,视图只拿最终价格。
export default class HistoryPricing {
    public static async getPeekPrice(roomData: TexasGameRoomData): Promise<number> {
        const peekCount = await TexasTableEvent.ReqReplayPeekTimes(roomData);
        const typeExt = PEEK_TIER_BASE + PEEK_TIER_STEP * Math.min(peekCount, PEEK_TIER_MAX);
        return this._getPrice(DiamondConfigType.DiamondConfigTypePayWatchOtherCardWatchAll, typeExt, roomData);
    }

    public static async getViewPubPrice(roomData: TexasGameRoomData, round: number): Promise<number> {
        return this._getPrice(DiamondConfigType.DiamondConfigTypeViewPublicCards, round * VIEW_PUB_ROUND_EXT, roomData);
    }

    private static async _getPrice(configType: DiamondConfigType, typeExt: number, roomData: TexasGameRoomData): Promise<number> {
        await diamondModel.reqDiamondConfig(configType);
        const config = diamondModel.getDiamondConfig(typeExt, configType);
        return this._matchPriceBySb(config, roomData.basicInfo.sbante?.sb || 0);
    }

    /** 按房间小盲取对应档位价格,无匹配档位时回退第一档 */
    private static _matchPriceBySb(config: DiamondConfig, sb: number): number {
        if (!config?.setting) return 0;
        for (const item of config.setting) {
            if (item.sb === sb) return item.price || 0;
        }
        return config.setting.length > 0 ? config.setting[0].price || 0 : 0;
    }
}
