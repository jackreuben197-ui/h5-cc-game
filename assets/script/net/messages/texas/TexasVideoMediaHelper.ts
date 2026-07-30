import { createLogger, traceClass, traceMethod } from '../../../core/decorator/LogTrace';
import roomDataManager from '../../../data/room/RoomDataManager';
import type TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import userStore from '../../../data/user/UserStore';
import { ButtonState } from '../../../game/constant/Constants';
import { MicrophoneIconState } from '../../../game/constant/MicrophoneIconState';
import agoraManager from '../../agora/AgoraManager';

const _plog = createLogger('AgoraManagerCallback');

@traceClass()
export default class TexasVideoMediaHelper {
    @traceMethod()
    public static async joinAgoraVideoChannelIfNeed(roomID: number, matchID: number): Promise<void> {
        const uid = userStore.userRID;
        if (agoraManager.isJoined) {
            await agoraManager.disableCamera();
            agoraManager.disableMicrophone();
            agoraManager.clearCallbacks();
            agoraManager.stopVolumeMonitor();
            await agoraManager.leave();
        }
        const roomData = TexasVideoMediaHelper.getAgoraCallbackRoomData(roomID, matchID, '加入房间', uid);
        TexasVideoMediaHelper.bindAgoraCallbacks(roomID, matchID);
        const channelName = 'rtc_d_' + roomData.basicInfo.tableCategory + '-' + matchID + '-' + roomID;
        const ok = await agoraManager.join(channelName, uid);
        if (!ok) {
            agoraManager.clearCallbacks();
            TexasVideoMediaHelper.tracelog.error('加入 Agora 频道失败');
            return;
        }
        agoraManager.startVolumeMonitor();
    }

    public static clearAllMediaStates(roomData: TexasGameRoomData | null): void {
        if (!roomData) return;
        roomData.mine.localCameraBtnState = ButtonState.DISABLE;
        roomData.mine.localCameraEnabled = false;
        roomData.mine.localMicrophoneBtnState = ButtonState.DISABLE;
        roomData.mine.localMicrophoneEnabled = false;
        roomData.mine.remoteCameraEnabled = ButtonState.HIDDEN;
        roomData.mine.remoteMicrophoneEnabled = ButtonState.HIDDEN;
        roomData.mine.randomVideoActive = false;
        roomData.mine.randomVideoStartTime = 0;
        roomData.mine.randomVideoEndTime = 0;
        roomData.seatsStateManager.resetVideoAndAudioStates();
    }

    public static bindAgoraCallbacks(roomID: number, matchID: number): void {
        agoraManager.onUserPublish = async (uid: number, mediaType: string) => {
            _plog.debug('onUserPublish', uid);
            const roomData = TexasVideoMediaHelper.getAgoraCallbackRoomData(roomID, matchID, '远端视频发布', uid);
            if (!roomData) return;
            const seat = roomData.seatsStateManager.getSeatPlayerByUserID(uid);
            if (!seat) return;
            if (mediaType == 'video') {
                if (seat.mine) {
                    seat.remoteVideoVisible = false;
                    return;
                }
                if (roomData.mine.remoteCameraEnabled == ButtonState.ON) {
                    await agoraManager.subscribeOrUnsubscribeRemoteVideo(true, uid);
                    seat.remoteVideoVisible = true;
                    if (roomData.basicInfo.antiCheatConfig && roomData.basicInfo.antiCheatConfig.shouldShowVideoMask) {
                        seat.realShowMaskID = seat.videoMaskId == 0 ? 1 : seat.videoMaskId;
                    }
                }
                return;
            }
            // 自己的话筒不做操作
            if (seat.mine) {
                return;
            }
            // 音频直接监听
            const track = await agoraManager.subscribeOrUnsubscribeRemoteAudio(true, uid);
            if (track) {
                track.play();
            }
            // 如果本地静音, 马上把音量控制下
            if (roomData.mine.remoteMicrophoneEnabled == ButtonState.ON) {
                track.setVolume(100);
                seat.micIconState = MicrophoneIconState.HIDDEN;
            } else {
                track.setVolume(0);
                seat.micIconState = MicrophoneIconState.MUTED;
            }
        };
        agoraManager.onUserUnpublish = (uid: number, mediaType: string) => {
            _plog.debug('onUserUnpublish', uid);
            const roomData = TexasVideoMediaHelper.getAgoraCallbackRoomData(roomID, matchID, '远端视频取消', uid);
            if (!roomData) return;
            const seat = roomData.seatsStateManager.getSeatPlayerByUserID(uid);
            if (!seat) return;
            if (mediaType == 'video') {
                seat.remoteVideoVisible = false;
                seat.realShowMaskID = 0;
                return;
            }
            seat.micIconState = MicrophoneIconState.MUTED;
        };
        agoraManager.onUserLeft = (uid: number) => {
            _plog.debug('onUserLeft', uid);
            const roomData = TexasVideoMediaHelper.getAgoraCallbackRoomData(roomID, matchID, '远端用户离开', uid);
            if (!roomData) return;
            const seat = roomData.seatsStateManager.getSeatPlayerByUserID(uid);
            if (seat) {
                seat.remoteVideoVisible = false;
                seat.realShowMaskID = 0;
                seat.micIconState = MicrophoneIconState.HIDDEN;
            }
        };
        agoraManager.onReconnected = () => {
            _plog.debug('onReconnected');
            const roomData = TexasVideoMediaHelper.getAgoraCallbackRoomData(roomID, matchID, 'SDK 重连成功');
            if (!roomData) return;
        };
        agoraManager.onError = (err: any) => {
            _plog.debug('onError');
            const roomData = TexasVideoMediaHelper.getAgoraCallbackRoomData(roomID, matchID, 'Agora 错误');
            if (!roomData) return;
            TexasVideoMediaHelper.tracelog.error('Agora 错误:', err && err.code ? err.code : err && err.message ? err.message : err);
            //TexasVideoMediaHelper.applyAgoraError(roomData, err);
        };
        agoraManager.onActiveSpeaker = (uid: number) => {
            _plog.debug('onActiveSpeaker', uid);
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

    /**
     * 开关远端用户的音频（静音/恢复）
     * @param st true=恢复声音, false=静音
     * @param uid 指定远端用户 uid
     */
    public static async setRemoteAudioStatus(roomData: TexasGameRoomData, st: boolean, uid: number): Promise<void> {
        const pubUsersMap = agoraManager.getRemoteUserMap();
        const user = pubUsersMap.get(uid);
        const player = roomData.seatsStateManager.getSeatPlayerByUserID(uid);
        if (!player) return;
        if (!user) {
            player.micIconState = MicrophoneIconState.HIDDEN;
            return;
        }
        if (!user || !user.hasAudio) return;
        if (st == true) {
            if (!user.audioTrack) {
                // 订阅后, user.videoTrack就存在了，可以renderFrame了
                const track = await agoraManager.subscribeOrUnsubscribeRemoteAudio(true, user);
                track.play();
                track.setVolume(100);
                player.micIconState = MicrophoneIconState.HIDDEN;
                return;
            }
            user.audioTrack.setVolume(100);
            player.micIconState = MicrophoneIconState.HIDDEN;
            return;
        }
        if (!user.audioTrack) {
            player.micIconState = MicrophoneIconState.MUTED;
            return;
        }
        //先隐藏，再关闭
        player.micIconState = MicrophoneIconState.MUTED;
        user.audioTrack.setVolume(0);
    }

    /**
     * 开关远端用户的视频（隐藏/显示）
     * @param st true=显示视频, false=隐藏视频
     * @param uid 指定远端用户 uid
     */
    public static async setRemoteVideoStatus(roomData: TexasGameRoomData, st: boolean, uid: number): Promise<void> {
        const pubUsersMap = agoraManager.getRemoteUserMap();
        const user = pubUsersMap.get(uid);
        if (!user || !user.hasVideo) return;
        const player = roomData.seatsStateManager.getSeatPlayerByUserID(uid);
        if (!player) return;
        if (st == true) {
            if (!user.videoTrack) {
                // 订阅后, user.videoTrack就存在了，可以renderFrame了
                await agoraManager.subscribeOrUnsubscribeRemoteVideo(true, user);
            }
            player.remoteVideoVisible = true;
            if (roomData.basicInfo.antiCheatConfig && roomData.basicInfo.antiCheatConfig.shouldShowVideoMask) {
                player.realShowMaskID = player.videoMaskId == 0 ? 1 : player.videoMaskId;
            } else {
                player.realShowMaskID = 0;
            }
            return;
        }
        player.remoteVideoVisible = false;
        player.realShowMaskID = 0;
        await agoraManager.subscribeOrUnsubscribeRemoteVideo(false, user);
    }
}
