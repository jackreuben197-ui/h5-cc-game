/**
 * 视频房间管理器
 * 管理视频房间的 Agora 频道生命周期：加入/离开频道、本地/远端视频渲染。
 *
 * 与 pokerqueen 的 TexasGameProtocol 不同，这里不依赖 GameCache 单例，
 * 而是通过 RoomDataManager 获取房间数据，符合 h5-cc-game 的分层架构。
 */
import { GameConfig } from '../../config/GameConfig';
import { traceClass } from '../../core/decorator/LogTrace';
import roomDataManager from '../../data/room/RoomDataManager';
import TexasGameRoomData from '../../data/room/texas/TexasGameRoomData';
import userStore from '../../data/user/UserStore';
import { VideoModel } from '../../game/constant/VideoModel';
import AgoraManager from './AgoraManager';
import AgoraVideoRender from './AgoraVideoRender';

@traceClass()
class VideoRoomManager {
    private static _instance: VideoRoomManager = null;
    public static get Instance(): VideoRoomManager {
        if (!this._instance) {
            this._instance = new VideoRoomManager();
        }
        return this._instance;
    }
    /** 当前管理的房间标识 */
    private _roomID: number = 0;
    private _matchID: number = 0;
    /** 是否正在加入频道中 */
    private _joining: boolean = false;
    /** 座位号 → 头像节点映射，由 View 层注册 */
    private _seatAvatarMap: Map<number, cc.Node> = new Map();
    /** 本地视频渲染停止回调（由 View 层注册，用于同步按钮状态） */
    public onLocalVideoStopped: (() => void) | null = null;

    private constructor() {}
    // ==================== 频道管理 ====================

    /**
     * 入房成功后调用：如果是视频房间，加入 Agora 频道
     */
    public async joinVideoChannelIfNeed(roomID: number, matchID: number): Promise<void> {
        if (!GameConfig.enableAgora) {
            this.tracelog.info('Agora 已禁用，跳过');
            return;
        }
        this._roomID = roomID;
        this._matchID = matchID;
        const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
        if (!roomData) {
            this.tracelog.warn('joinVideoChannelIfNeed: roomData 为空');
            return;
        }
        const videoModel = roomData.basicInfo.videoModel;
        this.tracelog.info('joinVideoChannelIfNeed videoModel=', videoModel);
        if (videoModel === VideoModel.NONE) {
            this.tracelog.info('非视频房间，跳过');
            return;
        }
        if (this._joining) {
            this.tracelog.warn('正在加入频道中，请勿重复调用');
            return;
        }
        const agora = AgoraManager.Instance;
        // 防御：确保上次已离开
        if (agora.isJoined) {
            this.tracelog.warn('上一次频道尚未离开，先执行清理');
            await this.leaveVideoChannel();
            // leaveVideoChannel 末尾会把 _roomID/_matchID 清零，防御性清理后必须恢复为当前房间，
            // 否则后续 currentVideoModel / 远端渲染 / Seated 判断都会读到 0（no room data 0 0）
            this._roomID = roomID;
            this._matchID = matchID;
        }
        // 等待 Agora SDK 加载（最多 10 秒）
        if (!agora.isSDKReady) {
            this.tracelog.info('Agora SDK 未加载，等待...');
            for (let i = 0; i < 100; i++) {
                await new Promise<void>(r => setTimeout(r, 100));
                if (agora.isSDKReady) break;
            }
            if (!agora.isSDKReady) {
                this.tracelog.error('Agora SDK 加载超时（10秒），跳过');
                return;
            }
        }
        this._joining = true;
        try {
            // 必须在 join 之前注册回调，否则 join 过程中 SDK 触发的 user-published 事件会丢失
            agora.onRemoteVideo = this._onRemoteVideo.bind(this);
            agora.onRemoteVideoUnsubscribed = this._onRemoteVideoUnsubscribed.bind(this);
            agora.onUserLeft = this._onUserLeft.bind(this);
            agora.onRemoteAudio = this._onRemoteAudio.bind(this);
            agora.onReconnected = this._onReconnected.bind(this);
            agora.onError = this._onAgoraError.bind(this);
            agora.onActiveSpeaker = this._onActiveSpeaker.bind(this);
            agora.startVolumeMonitor();
            // 加入频道：频道名必须与 pokerqueen 对齐（'rtc_d_1-0-' + roomId），
            // 否则 h5 与 pokerqueen 客户端会进入不同的 Agora 频道，互相收不到 user-published 事件
            const channelName = 'rtc_d_1-0-' + roomID;
            const uid = userStore.userRID || 0;
            const ok = await agora.join(channelName, undefined, uid);
            if (!ok) {
                this.tracelog.error('加入 Agora 频道失败');
                return;
            }
            // 渲染已在房间内的远端用户视频（user-published 在 join 过程中已触发，此处作为兜底）
            this._renderAllExistingRemoteVideos();
            // 频道就绪时若自己已入座，补渲染本地视频
            // （Seated 可能早于频道就绪到达，当时 isVideoRoom=false 会漏渲染，对齐 pokerqueen）
            this._restoreLocalVideoIfSeated();
            this.tracelog.info('频道就绪，等待远端视频');
        } catch (e) {
            this.tracelog.error('joinVideoChannelIfNeed 异常:', e);
        } finally {
            this._joining = false;
        }
    }

    /**
     * 离房时调用：离开 Agora 频道，清理所有视频资源
     */
    public async leaveVideoChannel(): Promise<void> {
        const agora = AgoraManager.Instance;
        if (!agora.isJoined) return;
        // 停止所有座位的视频渲染
        this._stopAllSeatVideoRender();
        // 关闭摄像头和麦克风
        await agora.disableCamera();
        agora.disableMic();
        // 清除所有回调
        agora.onRemoteVideo = null;
        agora.onRemoteVideoUnsubscribed = null;
        agora.onUserLeft = null;
        agora.onRemoteAudio = null;
        agora.onReconnected = null;
        agora.onError = null;
        agora.onActiveSpeaker = null;
        agora.stopVolumeMonitor();
        // 清空说话者状态，触发话筒图标隐藏
        const roomData = roomDataManager.getRoomData<TexasGameRoomData>(this._roomID, this._matchID);
        if (roomData) roomData.seatsStateManager.speakingUid = 0;
        await agora.leave();
        this._roomID = 0;
        this._matchID = 0;
        this.tracelog.info('已离开视频频道');
    }
    // ==================== 本地视频渲染 ====================

    /**
     * 入座后渲染本地摄像头到自己的头像
     * @param seatAvatarNode 座位头像节点（Raw_Head）
     * @returns 是否渲染成功
     */
    public async renderLocalVideoOnMySeat(seatAvatarNode: cc.Node): Promise<boolean> {
        const agora = AgoraManager.Instance;
        if (!agora.isJoined) {
            this.tracelog.warn('renderLocalVideoOnMySeat: 频道未加入');
            return false;
        }
        // 开启摄像头
        const cameraOk = await agora.enableCamera();
        if (!cameraOk) {
            this.tracelog.error('开启摄像头失败');
            return false;
        }
        // 获取本地视频 track
        const rawTrack = agora.localVideoTrack?.getMediaStreamTrack?.();
        if (!rawTrack) {
            this.tracelog.error('获取本地视频 MediaStreamTrack 失败');
            return false;
        }
        if (!seatAvatarNode?.isValid) {
            this.tracelog.warn('头像节点无效');
            return false;
        }
        // 获取或添加 AgoraVideoRender 组件
        let vr = seatAvatarNode.getComponent(AgoraVideoRender);
        if (!vr) {
            vr = seatAvatarNode.addComponent(AgoraVideoRender);
            vr.mirror = true;
            vr.targetFps = 15;
        }
        // 初始化省电模式参数
        const roomData = roomDataManager.getRoomData<TexasGameRoomData>(this._roomID, this._matchID);
        const videoPowerSaving = roomData?.basicInfo?.videoPowerSaving ?? 0;
        vr.initilize(videoPowerSaving);
        // 注册渲染停止回调：同步按钮状态
        vr.onRenderStopped = () => {
            this.tracelog.info('本地视频渲染已停止');
            this.onLocalVideoStopped?.();
        };
        // 开始渲染
        const ok = await vr.renderFromTrack(rawTrack);
        this.tracelog.info('本地视频渲染', ok ? '成功' : '失败');
        if (ok) {
            // 应用当前窗花贴纸
            const mySeatNo = roomData?.mine?.seatNo ?? 0;
            if (mySeatNo > 0 && roomData?.mine?.player?.videoMaskId) {
                vr.setVideoMaskId(roomData.mine.player.videoMaskId);
            }
        }
        return ok;
    }

    /**
     * 停止本地视频渲染（站起时调用）
     */
    public stopLocalVideo(seatAvatarNode: cc.Node): void {
        if (!seatAvatarNode?.isValid) return;
        const vr = seatAvatarNode.getComponent(AgoraVideoRender);
        if (vr) {
            vr.onRenderStopped = null;
            vr.stopRender();
        }
    }
    // ==================== 麦序模式 (SEQUENCE) ====================

    /**
     * 麦序模式下操作者变更时同步视频可见性
     * 仅显示当前操作者的视频，隐藏其他所有人的视频
     * 如果轮到自己操作，强制开启摄像头
     *
     * @param operatorSeatId 当前操作者的座位号（0 表示无操作者/手牌结束）
     */
    public sequenceSyncRemoteVideos(operatorSeatId: number): void {
        if (this.currentVideoModel !== VideoModel.SEQUENCE) return;
        const roomData = roomDataManager.getRoomData<TexasGameRoomData>(this._roomID, this._matchID);
        if (!roomData) return;
        const mySeatNo = roomData.mine.seatNo;
        this.tracelog.info('麦序模式同步, 操作者座位:', operatorSeatId, '我的座位:', mySeatNo);
        // 遍历所有座位
        const allSeats = roomData.seatsStateManager.getAllSeats();
        for (const seat of allSeats) {
            if (seat.seatNo === 0) continue;
            const isOperator = seat.seatNo === operatorSeatId;
            const isMine = seat.seatNo === mySeatNo;
            const avatarNode = this._findSeatAvatarNode(seat.seatNo);
            if (!avatarNode?.isValid) continue;
            if (isOperator) {
                // 操作者：显示视频
                if (isMine) {
                    // 轮到自己：强制开启摄像头并渲染本地视频
                    this.tracelog.info('麦序模式：轮到自己，强制开摄像头');
                    this.renderLocalVideoOnMySeat(avatarNode).then(ok => {
                        if (!ok) {
                            this.tracelog.warn('麦序模式：本地视频渲染失败');
                        }
                    });
                } else {
                    // 别人操作：只渲染该操作者的远端视频
                    this._renderRemoteVideoToSeat(seat.userID);
                }
            } else {
                // 非操作者：停止渲染
                const vr = avatarNode.getComponent(AgoraVideoRender);
                if (vr?.isRendering) {
                    vr.stopRender();
                }
            }
        }
        // 如果我已入座但不是操作者，关闭摄像头节省资源
        if (mySeatNo > 0 && mySeatNo !== operatorSeatId) {
            const myAvatar = this.getSeatAvatarNode(mySeatNo);
            if (myAvatar?.isValid) {
                this.stopLocalVideo(myAvatar);
            }
            AgoraManager.Instance.disableCamera();
        }
    }
    // ==================== 远端视频管理 ====================

    /**
     * 渲染已在频道内的远端用户视频
     * 遍历所有已入座玩家，检查 Agora 频道中是否有匹配的远端视频流
     * （对应 pokerqueen 的 seat-based 遍历方式，比遍历 remoteUsers 更可靠）
     */
    private _renderAllExistingRemoteVideos(): void {
        const agora = AgoraManager.Instance;
        if (!agora.isJoined) return;
        const remoteUsers = agora.getRemoteUsers();
        if (remoteUsers.length === 0) return;
        const roomData = roomDataManager.getRoomData<TexasGameRoomData>(this._roomID, this._matchID);
        if (!roomData) return;
        const allSeats = roomData.seatsStateManager.getAllSeats();
        for (const seat of allSeats) {
            const uid = seat.userID;
            if (!uid) continue;
            const remoteUser = remoteUsers.find(u => u.uid === uid && u.hasVideo);
            if (remoteUser) {
                this.tracelog.info('发现已入座远端玩家视频, uid:', uid, 'seatNo:', seat.seatNo);
                this._renderRemoteVideoToSeat(uid);
            }
        }
    }

    /** 远端用户发布视频回调 */
    private _onRemoteVideo(uid: number, track: any): void {
        this.tracelog.info('远端视频到达, uid:', uid);
        // 麦序模式下仅渲染当前操作者的视频
        if (this.currentVideoModel === VideoModel.SEQUENCE) {
            const roomData = roomDataManager.getRoomData<TexasGameRoomData>(this._roomID, this._matchID);
            if (roomData) {
                const seatData = roomData.seatsStateManager.findSeatByUserId(uid);
                // 检查是否有活跃的操作者（operator 不为 null 的座位）
                if (seatData && !seatData.operator) {
                    this.tracelog.info('麦序模式：非当前操作者，跳过渲染 uid:', uid);
                    return;
                }
            }
        }
        this._renderRemoteVideoToSeat(uid);
    }

    /** 远端用户取消发布视频回调 */
    private _onRemoteVideoUnsubscribed(uid: number): void {
        this.tracelog.info('远端视频取消, uid:', uid);
        this._stopRemoteVideoOnSeat(uid);
    }

    /** 远端用户离开回调 */
    private _onUserLeft(uid: number): void {
        this.tracelog.info('远端用户离开, uid:', uid);
        this._stopRemoteVideoOnSeat(uid);
    }

    /** 远端音频回调（Phase 1 暂不处理 UI，仅打日志） */
    private _onRemoteAudio(uid: number, track: any): void {
        this.tracelog.debug('远端音频, uid:', uid, track ? '有' : '无');
    }

    /** SDK 重连成功回调 */
    private _onReconnected(): void {
        this.tracelog.info('SDK 重连成功，恢复视频渲染');
        const roomData = roomDataManager.getRoomData<TexasGameRoomData>(this._roomID, this._matchID);
        if (roomData && roomData.basicInfo.videoModel === VideoModel.SEQUENCE) {
            // 麦序模式：找到当前操作者并同步
            const operatorSeatId = this._findCurrentOperatorSeatId(roomData);
            this.sequenceSyncRemoteVideos(operatorSeatId);
        } else {
            // 全时长模式：恢复所有远端视频 + 本地视频
            this._renderAllExistingRemoteVideos();
            this._restoreLocalVideoIfSeated();
        }
    }

    /**
     * 查找当前操作者的座位号（麦序模式重连用）
     */
    private _findCurrentOperatorSeatId(roomData: TexasGameRoomData): number {
        const allSeats = roomData.seatsStateManager.getAllSeats();
        for (const seat of allSeats) {
            // 非自己座位：operator 在 seat.operator
            if (seat.operator) {
                return seat.seatNo;
            }
            // 自己座位：operator 在 seat.mine.operator
            if (seat.mine?.operator) {
                return seat.seatNo;
            }
        }
        return 0;
    }

    /**
     * 重连后恢复本地视频渲染
     * 检查自己是否已入座，如果是则重新开启摄像头并渲染到头像
     */
    private _restoreLocalVideoIfSeated(): void {
        const roomData = roomDataManager.getRoomData<TexasGameRoomData>(this._roomID, this._matchID);
        if (!roomData) return;
        const mine = roomData.mine;
        if (!mine || mine.seatNo === 0) return;
        const avatarNode = this.getSeatAvatarNode(mine.seatNo);
        if (!avatarNode?.isValid) return;
        this.tracelog.info('重连后恢复本地视频渲染, seatNo:', mine.seatNo);
        this.renderLocalVideoOnMySeat(avatarNode).then(ok => {
            if (!ok) {
                this.tracelog.warn('重连后恢复本地视频失败');
            }
        });
    }

    /** Agora 错误回调 */
    private _onAgoraError(err: any): void {
        this.tracelog.error('Agora 错误:', err?.code || err?.message || err);
    }

    /** 说话者变化回调：写入座位数据的 speakingUid，触发 SPEAKING_CHANGE 刷新头像话筒图标 */
    private _onActiveSpeaker(uid: number | null): void {
        this.tracelog.debug('当前说话者:', uid);
        const roomData = roomDataManager.getRoomData<TexasGameRoomData>(this._roomID, this._matchID);
        if (!roomData) return;
        roomData.seatsStateManager.speakingUid = uid ?? 0;
    }

    /** 将远端用户视频渲染到对应座位头像 */
    private _renderRemoteVideoToSeat(uid: number): void {
        const roomData = roomDataManager.getRoomData<TexasGameRoomData>(this._roomID, this._matchID);
        if (!roomData) return;
        // 通过 uid 找到对应座位
        const seatData = roomData.seatsStateManager.findSeatByUserId(uid);
        if (!seatData) {
            this.tracelog.warn('未找到 uid:', uid, '对应座位');
            return;
        }
        // 通过座位 ID 找到 UI 节点
        const avatarNode = this._findSeatAvatarNode(seatData.seatNo);
        if (!avatarNode) {
            this.tracelog.warn('未找到座位头像节点, seatID:', seatData.seatNo);
            return;
        }
        let vr = avatarNode.getComponent(AgoraVideoRender);
        if (!vr) {
            vr = avatarNode.addComponent(AgoraVideoRender);
            vr.targetFps = 15;
        }
        // 如果已在渲染中，先停止再重新渲染
        if (vr.isRendering) {
            vr.onRenderStopped = null;
            vr.stopRender();
        }
        // 初始化省电模式参数
        const videoPowerSaving = roomData?.basicInfo?.videoPowerSaving ?? 0;
        vr.initilize(videoPowerSaving);
        vr.renderRemoteUser(uid)
            .then(ok => {
                this.tracelog.info('远端视频渲染 uid:', uid, ok ? '成功' : '失败');
                if (ok) {
                    vr.setVideoMaskId(seatData.videoMaskId || 0);
                }
            })
            .catch(e => {
                this.tracelog.warn('远端视频渲染异常, uid:', uid, e);
            });
    }

    /**
     * 若已加入视频频道，渲染所有已有远端视频
     * 用于 EnterRoom 回包后的兜底触发（解决 joinVideoChannelIfNeed 与 EnterRoom 的时序竞争）
     */
    public renderExistingRemoteVideosIfJoined(): void {
        if (!AgoraManager.Instance.isJoined) return;
        this._renderAllExistingRemoteVideos();
    }

    /**
     * 检查指定用户是否已有远端视频流，若有则渲染到对应座位
     * 用于解决视频先到、玩家后坐下的时序问题（对应 pokerqueen TryRenderRemoteVideoForSeat）
     */
    public tryRenderRemoteVideoForSeat(uid: number): void {
        const agora = AgoraManager.Instance;
        if (!agora.isJoined) return;
        const remoteUsers = agora.getRemoteUsers();
        const remoteUser = remoteUsers.find(u => u.uid === uid && u.hasVideo);
        if (remoteUser) {
            this.tracelog.info('玩家坐下后发现已有视频, uid:', uid);
            this._renderRemoteVideoToSeat(uid);
        }
    }

    /** 停止远端用户在座位上的视频渲染 */
    private _stopRemoteVideoOnSeat(uid: number): void {
        const roomData = roomDataManager.getRoomData<TexasGameRoomData>(this._roomID, this._matchID);
        if (!roomData) return;
        const seatData = roomData.seatsStateManager.findSeatByUserId(uid);
        if (!seatData) return;
        const avatarNode = this._findSeatAvatarNode(seatData.seatNo);
        if (!avatarNode) return;
        const vr = avatarNode.getComponent(AgoraVideoRender);
        if (vr) {
            vr.onRenderStopped = null;
            vr.stopRender();
        }
    }

    /** 停止所有座位的视频渲染 */
    private _stopAllSeatVideoRender(): void {
        const roomData = roomDataManager.getRoomData<TexasGameRoomData>(this._roomID, this._matchID);
        if (!roomData) return;
        const allSeats = roomData.seatsStateManager.getAllSeats();
        for (const seat of allSeats) {
            const avatarNode = this._findSeatAvatarNode(seat.seatNo);
            if (!avatarNode) continue;
            try {
                const vr = avatarNode.getComponent(AgoraVideoRender);
                if (vr) {
                    vr.onRenderStopped = null;
                    vr.stopRender();
                }
            } catch (_) {
                /* 单个座位清理失败不影响其他 */
            }
        }
    }
    // ==================== 座位头像节点注册 ====================

    /**
     * 注册座位头像节点（由 View 层的 SeatManager 在创建座位时调用）
     * @param seatNo 座位号（1-9）
     * @param avatarNode 头像节点（SeatPlayer 的 avatar.node）
     */
    public registerSeatAvatar(seatNo: number, avatarNode: cc.Node): void {
        this._seatAvatarMap.set(seatNo, avatarNode);
    }

    /**
     * 注销座位头像节点（由 View 层在销毁座位时调用）
     */
    public unregisterSeatAvatar(seatNo: number): void {
        this._seatAvatarMap.delete(seatNo);
    }

    /**
     * 清理所有注册的头像节点（离房时调用）
     */
    public clearSeatAvatars(): void {
        this._seatAvatarMap.clear();
    }

    /**
     * 获取指定座位的头像节点（公开方法，供消息处理层使用）
     */
    public getSeatAvatarNode(seatNo: number): cc.Node | null {
        return this._seatAvatarMap.get(seatNo) || null;
    }

    /**
     * 通过座位号查找已注册的头像节点
     */
    private _findSeatAvatarNode(seatNo: number): cc.Node | null {
        return this._seatAvatarMap.get(seatNo) || null;
    }

    /** 判断当前是否处于视频房间（频道已加入） */
    public get isVideoRoom(): boolean {
        return AgoraManager.Instance.isJoined;
    }
    /**
     * 获取当前房间的 videoModel
     */
    public get currentVideoModel(): number {
        const roomData = roomDataManager.getRoomData<TexasGameRoomData>(this._roomID, this._matchID);
        return roomData?.basicInfo?.videoModel ?? VideoModel.NONE;
    }
}

export default VideoRoomManager;
