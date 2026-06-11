import { ServerMessageBuyInsuranceActive } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { CPErrorCode } from '../../../i18n/CPErrorCode';
import viewManager from '../../../views/UIViewManager';

const _glog = createLogger('ServerMessageBuyInsuranceActive');

// BuyInsuranceActive 1015 —— 服务端对客户端"主动购买保险"请求的回执
export function BuyInsuranceActive(data: ServerMessageBuyInsuranceActive.AsObject, roomID: number, matchID: number) {
    if (data.status === 0) return;
    _glog.warn('buy insurance failed, status =', data.status);
    viewManager.showToast(CPErrorCode.ServerErrorDescription(data.status));
    // 失败时让面板回到可操作状态：清空 operator，由 PREPARE_OPERATION_MINE 触发面板关闭
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (roomData?.mine?.operator?.opType === 2) {
        roomData.mine.operator = null;
    }
    if (roomData?.mine?.player?.operator?.opType === 2) {
        roomData.mine.player.operator = null;
    }
}
