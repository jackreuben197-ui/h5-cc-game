import { Def, ServerMessageChipsChange } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

// ChipsChange 1107
/**
    CC_NONE = 0;                   // 占位
    CC_STORE_CHIP = 1;             // 手动存筹码(等于带出)
    CC_AUTO_ON_TABLE = 2;          // 自动平衡筹码（带入/带出)
    CC_MTT_ADD_ON = 3;             // MTT AddOn(带入)
    CC_MTT_STORE_RETURN = 4;       // MTT 存储的筹码到时间归还（带入)
    CC_MTT_ADD_ON_PLUS_MODE1 = 5;  // MTT 增购Plus 截止买入/重购前
    CC_MTT_ADD_ON_PLUS_MODE2 = 6;  // MTT 增购Plus 截止买入/重购后
    CC_MUSHROOM_SPLIT = 7;         // 由于人员离桌导致游戏人数不足,触发当前蘑菇轮结束,平分剩余蘑菇池,当前蘑菇轮结束
    CC_SQUID_SPLIT = 8;            // 由于人员离桌导致游戏人数不足,触发当前鱿鱼轮结束,平分剩余鱿鱼池(罚金),当前鱿鱼轮结束
 */
export function ChipsChange(data: ServerMessageChipsChange.AsObject, roomID: number, matchID: number) {
    let roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    data.changesList.forEach(changeData => {
        let seatData = roomData.seatsStateManager.getSeatPlayer(changeData.seatId);
        switch (changeData.reason) {
            case Def.ChipChangeReason.CC_STORE_CHIP:
            case Def.ChipChangeReason.CC_AUTO_ON_TABLE:
            case Def.ChipChangeReason.CC_MUSHROOM_SPLIT:
            case Def.ChipChangeReason.CC_SQUID_SPLIT:
            default:
                seatData.chip = changeData.chips;
                if (seatData.mine) {
                    seatData.mine.storeChips = changeData.storeChips;
                }
                break;
            case Def.ChipChangeReason.CC_MTT_ADD_ON:
            case Def.ChipChangeReason.CC_MTT_STORE_RETURN:
            case Def.ChipChangeReason.CC_MTT_ADD_ON_PLUS_MODE1:
            case Def.ChipChangeReason.CC_MTT_ADD_ON_PLUS_MODE2:
                seatData.chip = changeData.chips;
                if (seatData.mine) {
                    seatData.mine.storeChips = changeData.storeChips;
                }
                seatData.mttHunterHeadValue += changeData.mttHunterHeadPlus;
                break;
        }
    });
}
