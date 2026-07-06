import { IRemoteAudioTrack, IRemoteVideoTrack } from 'agora-rtc-sdk-ng';
import { traceClass, traceMethod } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import type TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import userStore from '../../../data/user/UserStore';
import { ButtonState } from '../../../game/constant/Constants';
import { MicIconState } from '../../../game/constant/MicIconState';
import agoraManager from '../../agora/AgoraManager';

@traceClass()
export default class TexasVideoMediaHelper {
    @traceMethod()
    public static async joinAgoraVideoChannelIfNeed(roomID: number, matchID: number): Promise<void> {
        if (!agoraManager.isReady) {
            this.tracelog.error('agoramanager is not ready');
            return;
        }
        const uid = userStore.userRID;
        const roomData = TexasVideoMediaHelper.getAgoraCallbackRoomData(roomID, matchID, '加入房间', uid);
        if (agoraManager.isJoined) {
            await agoraManager.disableCamera();
            agoraManager.disableMic();
            agoraManager.clearCallbacks();
            agoraManager.stopVolumeMonitor();
            await agoraManager.leave();
        }
        TexasVideoMediaHelper.bindAgoraCallbacks(roomID, matchID);
        const channelName = 'rtc_d_1-0-' + roomID + '-' + matchID;
        const ok = await agoraManager.join(channelName, uid);
        if (!ok) {
            agoraManager.clearCallbacks();
            TexasVideoMediaHelper.tracelog.error('加入 Agora 频道失败');
            return;
        }
        agoraManager.startVolumeMonitor();
        roomData.seatsStateManager.syncAllSeatVideoAndAudioStates();
    }

    public static clearAllMediaStates(roomData: TexasGameRoomData | null): void {
        if (!roomData) return;
        roomData.mine.localCameraEnabled = ButtonState.DISABLE;
        roomData.mine.localMicEnabled = ButtonState.DISABLE;
        roomData.mine.randomVideoActive = false;
        roomData.mine.randomVideoEndTime = 0;
        roomData.seatsStateManager.resetVideoAndAudioStates();
    }

    public static bindAgoraCallbacks(roomID: number, matchID: number): void {
        agoraManager.onRemoteVideoSubscribed = (uid: number, track: IRemoteVideoTrack) => {
            const roomData = TexasVideoMediaHelper.getAgoraCallbackRoomData(roomID, matchID, '远端视频发布', uid);
            if (!roomData) return;
            const seat = roomData.seatsStateManager.getSeatPlayerByUserID(uid);
            if (!seat) return;
            if (seat.mine) {
                seat.remoteVideoVisible = false;
                return;
            }
            seat.remoteVideoVisible = !agoraManager.isRemoteVideoMuted && !!track;
        };
        agoraManager.onRemoteVideoUnsubscribed = (uid: number) => {
            const roomData = TexasVideoMediaHelper.getAgoraCallbackRoomData(roomID, matchID, '远端视频取消', uid);
            if (!roomData) return;
            const seat = roomData.seatsStateManager.getSeatPlayerByUserID(uid);
            if (!seat) return;
            seat.remoteVideoVisible = false;
        };
        agoraManager.onUserLeft = (uid: number) => {
            const roomData = TexasVideoMediaHelper.getAgoraCallbackRoomData(roomID, matchID, '远端用户离开', uid);
            if (!roomData) return;
            const seat = roomData.seatsStateManager.getSeatPlayerByUserID(uid);
            if (seat) {
                seat.remoteVideoVisible = false;
                seat.micIconState = MicIconState.HIDDEN;
            }
        };
        agoraManager.onRemoteAudioSubscribed = (uid: number, track: IRemoteAudioTrack) => {
            const roomData = TexasVideoMediaHelper.getAgoraCallbackRoomData(roomID, matchID, '远端音频变化', uid);
            if (!roomData) return;
            const seat = roomData.seatsStateManager.getSeatPlayerByUserID(uid);
            if (seat) {
                seat.micIconState = !agoraManager.isRemoteAudioMuted && !!track ? MicIconState.HIDDEN : MicIconState.MUTED;
            }
        };
        agoraManager.onRemoteAudioUnsubscribed = (uid: number) => {
            const roomData = TexasVideoMediaHelper.getAgoraCallbackRoomData(roomID, matchID, '远端音频取消', uid);
            if (!roomData) return;
            const seat = roomData.seatsStateManager.getSeatPlayerByUserID(uid);
            if (seat) {
                seat.micIconState = MicIconState.MUTED;
            }
        };
        agoraManager.onReconnected = () => {
            const roomData = TexasVideoMediaHelper.getAgoraCallbackRoomData(roomID, matchID, 'SDK 重连成功');
            if (!roomData) return;
            roomData.seatsStateManager.syncAllSeatVideoAndAudioStates();
        };
        agoraManager.onError = (err: any) => {
            const roomData = TexasVideoMediaHelper.getAgoraCallbackRoomData(roomID, matchID, 'Agora 错误');
            if (!roomData) return;
            TexasVideoMediaHelper.tracelog.error('Agora 错误:', err && err.code ? err.code : err && err.message ? err.message : err);
            //TexasVideoMediaHelper.applyAgoraError(roomData, err);
        };
        agoraManager.onActiveSpeaker = (uid: number) => {
            const roomData = TexasVideoMediaHelper.getAgoraCallbackRoomData(roomID, matchID, '当前说话者');
            if (!roomData) return;
            roomData.seatsStateManager.speakingUID = uid;
        };
    }

    private static getAgoraCallbackRoomData(roomID: number, matchID: number, name: string, uid?: number): TexasGameRoomData | null {
        const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
        if (!roomData) {
            TexasVideoMediaHelper.tracelog.warn(name + '时 roomData 不存在, roomID:', roomID, 'matchID:', matchID, 'uid:', uid);
            return null;
        }
        return roomData;
    }
}
