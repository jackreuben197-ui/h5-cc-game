import { ServerMessageUpBlind } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';

// UpBlind 1120
export function UpBlind(data: ServerMessageUpBlind.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData || !data) return;
    const sbante = {
        sb: data.smallBlind,
        ante: data.ante
    };
    if (data.mttProgress) {
        if (data.mttProgress.blindLevel > 0 && data.mttProgress.upBlindLeftTime == 0) {
            roomData.basicInfo.updateMttUpblind(0, sbante, null);
        }
        if (data.mttProgress.blindLevel > 0 && data.mttProgress.upBlindLeftTime > 0) {
            roomData.basicInfo.updateMttUpblind(data.mttProgress.upBlindLeftTime, sbante, {
                sb: data.mttProgress.nextSmallBlind,
                ante: data.mttProgress.nextAnte
            });
        }
    } else {
        roomData.basicInfo.updateMttUpblind(0, sbante, null);
    }
}
