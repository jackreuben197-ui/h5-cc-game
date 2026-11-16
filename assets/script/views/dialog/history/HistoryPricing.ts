import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import globalConfigStore from '../../../data/system/GlobalConfigStore';
import diamondModel from '../../../data/trade/DiamondModel';
import privateUcChargeStore, { PrivateUcFee } from '../../../data/trade/PrivateUcChargeStore';
import { DiamondConfigType, resolvePrivateUcDiamondConfigType } from '../../../game/constant/DiamondConfigType';
import TexasTableEvent from '../../scene/room/texas/events/TexasTableEvent';

const PEEK_TIER_STEP = 10;

const PEEK_TIER_MAX = 4;

/** 发发看: type_ext 千位 = 轮次(1 flop / 2 turn / 3 river) */
const VIEW_PUB_ROUND_EXT = 1000;

// 牌谱付费点的钻石价格计算,把 type_ext 编码规则和小盲档位匹配收拢在一处,视图只拿最终价格。
export default class HistoryPricing {
    public static async getPeekPrice(roomData: TexasGameRoomData): Promise<number> {
        const peekCount = await TexasTableEvent.ReqReplayPeekTimes(roomData);
        const viewerTypeExt = roomData.mine.seatNo > 0 ? 12 : 11;
        const typeExt = viewerTypeExt + PEEK_TIER_STEP * Math.min(peekCount, PEEK_TIER_MAX);
        return this._getPrice(DiamondConfigType.DiamondConfigTypePayWatchOtherCardWatchAll, typeExt, roomData);
    }

    public static async getViewPubPrice(roomData: TexasGameRoomData, round: number): Promise<number> {
        const viewAll = globalConfigStore.viewPublicCards.viewType === 2;
        const validRound = Math.max(1, Math.min(3, round || 1));
        return this._getPrice(
            viewAll
                ? DiamondConfigType.DiamondConfigTypeViewPublicCardsAll
                : DiamondConfigType.DiamondConfigTypeViewPublicCards,
            viewAll ? 0 : validRound * VIEW_PUB_ROUND_EXT,
            roomData
        );
    }

    private static async _getPrice(configType: DiamondConfigType, typeExt: number, roomData: TexasGameRoomData): Promise<number> {
        const isPrivateUcPackage = globalConfigStore.isChannelDiamondFreeMode;
        const resolvedConfigType = isPrivateUcPackage ? resolvePrivateUcDiamondConfigType(configType) : configType;
        if (!diamondModel.getDiamondConfig(typeExt, resolvedConfigType)) {
            await diamondModel.reqDiamondConfig(resolvedConfigType);
        }
        const basicInfo = roomData.basicInfo;
        const rawSb = basicInfo.sbante?.sb || 0;
        // CMS setting.sb 是小盲档位；与牌桌收费保持一致，不按 BombPot/短牌翻倍。
        const sb = rawSb;
        let price = diamondModel.getPrice(resolvedConfigType, typeExt, sb, isPrivateUcPackage);
        if (price <= 0 && isPrivateUcPackage) {
            if (configType === DiamondConfigType.DiamondConfigTypePayWatchOtherCardWatchAll) {
                const storePrice = privateUcChargeStore.getVisiblePrice(PrivateUcFee.ViewAllPlayers);
                if (storePrice != null && storePrice > 0) price = storePrice;
            } else if (
                configType === DiamondConfigType.DiamondConfigTypeViewPublicCards ||
                configType === DiamondConfigType.DiamondConfigTypeViewPublicCardsAll
            ) {
                const storePrice = privateUcChargeStore.getVisiblePrice(PrivateUcFee.ViewPublicCards);
                if (storePrice != null && storePrice > 0) price = storePrice;
            }
        }
        return price;
    }
}
