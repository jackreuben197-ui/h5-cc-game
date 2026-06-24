/**
 * 声网 Agora RTC 管理器
 * 封装 Agora Web SDK，提供音视频通话能力
 */
import { ITraceLog, traceClass } from '../../core/decorator/LogTrace';
import { WWW } from '../https/WebRequest';

@traceClass()
export default class AgoraManager {
    private static _instance: AgoraManager = null;
    // ==================== 连接状态追踪 ====================
    private _prevConnState: string = 'DISCONNECTED';
    /** SDK 重连成功回调（供 TexasGameProtocol 恢复远端视频渲染） */
    public onReconnected: () => void = null;
    public static get Instance(): AgoraManager {
        if (!this._instance) {
            this._instance = new AgoraManager();
        }
        return this._instance;
    }
    // ==================== 配置项 ====================
    /** 声网 App ID */
    public appId: string = 'da91afd18fa84618bee90c5468b06a5f';
    // =========================================================
    private _client: any = null;
    private _localAudioTrack: any = null;
    private _localVideoTrack: any = null;
    private _joined: boolean = false;
    private _joining: boolean = false;
    private _channelName: string = '';
    private _uid: number = 0;
    /** 全局远端音频静音标记 */
    private _allRemoteAudioMuted: boolean = false;
    /** 全局远端视频隐藏标记 */
    private _allRemoteVideoMuted: boolean = false;
    /** 音量监控定时器 */
    private _volumeMonitorTimer: number = null;
    /** 当前正在说话的用户 uid，null 表示无人说话 */
    private _speakingUid: number = null;
    /** 音量轮询间隔(ms) */
    private _volumeMonitorInterval: number = 300;
    /** 判定为正在说话的音量阈值(0~1) */
    private _speakingThreshold: number = 0.01;
    /** 远端用户加入回调 */
    public onUserJoined: (uid: number) => void = null;
    /** 远端用户离开回调 */
    public onUserLeft: (uid: number) => void = null;
    /** 远端音频轨道回调 */
    public onRemoteAudio: (uid: number, track: any) => void = null;
    /** 远端视频轨道回调 */
    public onRemoteVideo: (uid: number, track: any) => void = null;
    /** 远端视频被取消订阅回调（用于 UI 层清理渲染覆盖层） */
    public onRemoteVideoUnsubscribed: (uid: number) => void = null;
    /** 错误回调 */
    public onError: (err: any) => void = null;
    /** 当前说话者变化回调，uid 为 null 表示无人说话（包含自己） */
    public onActiveSpeaker: (uid: number | null) => void = null;
    /** 远端音频是否全局静音 */
    public get isRemoteAudioMuted(): boolean {
        return this._allRemoteAudioMuted;
    }
    /** 远端视频是否全局隐藏 */
    public get isRemoteVideoMuted(): boolean {
        return this._allRemoteVideoMuted;
    }

    private constructor() {}

    /** Agora SDK 是否已加载 */
    public get isSDKReady(): boolean {
        return !!(window as any).AgoraRTC;
    }
    /** 浏览器是否支持摄像头/麦克风（需要 HTTPS 或 localhost） */
    public get isMediaDevicesSupported(): boolean {
        return !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia);
    }
    /** 浏览器是否为安全上下文（HTTPS 或 localhost） */
    public get isSecureContext(): boolean {
        return window.isSecureContext === true;
    }
    /** 是否已加入频道 */
    public get isJoined(): boolean {
        return this._joined;
    }
    /** 本地音频轨道是否存在（麦克风已创建） */
    public get localAudioTrack(): any {
        return this._localAudioTrack;
    }
    /** 本地视频轨道是否存在（摄像头已创建） */
    public get localVideoTrack(): any {
        return this._localVideoTrack;
    }
    /** 当前频道名 */
    public get channelName(): string {
        return this._channelName;
    }
    /** 当前 UID */
    public get uid(): number {
        return this._uid;
    }
    /** 获取原生 Agora Client（高级用法） */
    public get client(): any {
        return this._client;
    }

    /**
     * 初始化 Agora Client
     * 必须在 SDK 加载完成后调用
     */
    public init(): void {
        if (!this.isSDKReady) {
            this.tracelog.error('SDK 未加载，无法初始化');
            return;
        }
        if (this._client) {
            this.tracelog.info('已初始化，跳过');
            return;
        }
        const AgoraRTC = (window as any).AgoraRTC;
        const globalLevel = ITraceLog.getGlobalLevel();
        if (globalLevel == 'debug') {
            AgoraRTC.setLogLevel(0);
        } else if (globalLevel == 'info') {
            AgoraRTC.setLogLevel(1);
        } else if (globalLevel == 'warn') {
            AgoraRTC.setLogLevel(2);
        } else if (globalLevel == 'error') {
            AgoraRTC.setLogLevel(3);
        } else {
            // 默认是error
            AgoraRTC.setLogLevel(3);
        }
        this._client = AgoraRTC.createClient({ mode: 'rtc', codec: 'vp8' });
        this._registerEvents();
        this.tracelog.info('Client 初始化完成, 安全上下文:', this.isSecureContext, '媒体设备支持:', this.isMediaDevicesSupported);
    }

    /**
     * 从服务器 API 获取 Agora Token
     * @param channel 频道名
     * @param uid 用户 ID
     */
    private async fetchToken(channel: string, uid: number = 0): Promise<string | null> {
        const { WebMiscAgoraToken } = await import('../https/web_request/WebRequestMisc');
        try {
            const response: any = await WWW.Instance.CommonAPI({
                web_class: WebMiscAgoraToken,
                body: {
                    channel_name: channel,
                    role: 1, // 1=发布者
                    uid: uid
                }
            });
            const token = response?.data;
            if (!token) {
                this.tracelog.error('Token 响应数据为空:', response);
                return null;
            }
            this.tracelog.info('Token 获取成功, channel:', channel, 'uid:', uid);
            return token;
        } catch (e: any) {
            this.tracelog.error('Token 获取失败:', e?.message || e);
            return null;
        }
    }

    /** 注册客户端事件 */
    private _registerEvents(): void {
        this._client.on('user-joined', (user: any) => {
            this.tracelog.info('远端用户加入:', user.uid);
            this.onUserJoined?.(user.uid);
        });
        this._client.on('user-left', (user: any, reason: string) => {
            this.tracelog.info('远端用户离开:', user.uid, reason);
            this.onUserLeft?.(user.uid);
        });
        this._client.on('user-published', async (user: any, mediaType: string) => {
            this.tracelog.info('远端用户发布:', user.uid, mediaType);
            try {
                // 全局远端视频已隐藏时，跳过视频订阅
                if (mediaType === 'video' && this._allRemoteVideoMuted) {
                    this.tracelog.info('远端视频已全局隐藏，跳过订阅 uid:', user.uid);
                    return;
                }
                await this._client.subscribe(user, mediaType);
                if (mediaType === 'audio') {
                    const audioTrack = user.audioTrack;
                    audioTrack?.play();
                    // 全局远端音频已静音时，立即设置音量为0
                    if (this._allRemoteAudioMuted) {
                        audioTrack?.setVolume(0);
                    }
                    this.onRemoteAudio?.(user.uid, audioTrack);
                }
                if (mediaType === 'video') {
                    const videoTrack = user.videoTrack;
                    this.onRemoteVideo?.(user.uid, videoTrack);
                }
            } catch (e) {
                this.tracelog.error('订阅远端流失败:', e);
            }
        });
        this._client.on('user-unpublished', (user: any, mediaType: string) => {
            this.tracelog.info('远端用户取消发布:', user.uid, mediaType);
            if (mediaType === 'video') {
                this.onRemoteVideoUnsubscribed?.(user.uid);
            }
            if (mediaType === 'audio') {
                this.onRemoteAudio?.(user.uid, null);
            }
        });
        this._client.on('connection-state-change', (curState: string, revState: string) => {
            this.tracelog.info('连接状态变化:', revState, '->', curState);
            this._handleConnectionStateChange(curState, revState);
        });
        this._client.on('exception', (e: any) => {
            this.tracelog.warn('[AgoraManager] 异常事件:', e.code, e.msg);
        });
        // Token 过期前 30 秒自动续期
        this._client.on('token-privilege-will-expire', async () => {
            this.tracelog.info('Token 即将过期，自动续期...');
            if (!this._channelName) return;
            const token = await this.fetchToken(this._channelName, this._uid);
            if (token) {
                try {
                    await this._client.renewToken(token);
                    this.tracelog.info('Token 续期成功');
                } catch (e) {
                    this.tracelog.error('Token 续期失败:', e);
                }
            }
        });
    }

    /**
     * 加入频道
     * @param channel 频道名
     * @param token token（不传则自动从 tokenServerUrl 获取）
     * @param uid 用户 ID，传 0 则自动分配
     */
    public async join(channel: string, token?: string, uid?: number): Promise<boolean> {
        if (!this._client) {
            this.tracelog.error('未初始化，请先调用 init()');
            return false;
        }
        if (this._joined) {
            this.tracelog.warn('[AgoraManager] 已在频道中，请先 leave()');
            return false;
        }
        if (this._joining) {
            this.tracelog.warn('[AgoraManager] 正在加入频道中，请勿重复调用');
            return false;
        }
        if (!this.appId) {
            this.tracelog.error('appId 未配置');
            return false;
        }
        this._joining = true;
        // 如果没传 token，自动从 Token 服务获取
        let actualToken = token;
        if (!actualToken) {
            actualToken = await this.fetchToken(channel, uid || 0);
            if (!actualToken) {
                this._joining = false;
                return false;
            }
        }
        try {
            this._uid = await this._client.join(this.appId, channel, actualToken, uid || 0);
            this._channelName = channel;
            this._joined = true;
            this.tracelog.info('加入频道成功:', channel, 'uid:', this._uid);
            return true;
        } catch (e) {
            this.tracelog.error('加入频道失败:', e);
            this.onError?.(e);
            return false;
        } finally {
            this._joining = false;
        }
    }

    /**
     * 处理 Agora 连接状态变化
     * 不做自定义重连，完全依赖 Agora SDK v4.x 内置重连机制
     * SDK 重连流程: CONNECTED → RECONNECTING → CONNECTED
     * SDK 放弃时: RECONNECTING → DISCONNECTED
     */
    private _handleConnectionStateChange(curState: string, revState: string): void {
        switch (curState) {
            case 'CONNECTED':
                // 从 RECONNECTING 恢复 → SDK 内部重连成功，恢复视频渲染
                if (this._prevConnState === 'RECONNECTING') {
                    this.tracelog.info('SDK 自动重连成功，恢复视频渲染');
                    this.onReconnected?.();
                }
                break;
            case 'RECONNECTING':
                this.tracelog.warn('[AgoraManager] SDK 内部自动重连中...');
                break;
            case 'DISCONNECTED':
                if (this._joined) {
                    this.tracelog.error('连接已断开（SDK 重连失败）');
                    // 重置 joined 状态，允许后续重新 join
                    this._joined = false;
                    this._channelName = '';
                    this._uid = 0;
                    this.onError?.({ code: 'CONNECTION_LOST', message: '连接已断开' });
                }
                break;
        }
        this._prevConnState = curState;
    }

    /**
     * 离开频道
     */
    public async leave(): Promise<void> {
        this._prevConnState = 'DISCONNECTED';
        if (!this._joined) return;
        // 先标记为已离开，防止 client.leave() 触发 DISCONNECTED 事件时误报 CONNECTION_LOST
        this._joined = false;
        this._channelName = '';
        this._uid = 0;
        this._allRemoteAudioMuted = false;
        this._allRemoteVideoMuted = false;
        this.stopVolumeMonitor();
        // 停止远端用户的音频播放（防止离开房间后仍在播放）
        try {
            if (this._client?.remoteUsers) {
                this._client.remoteUsers.forEach((user: any) => {
                    try {
                        if (user.audioTrack) {
                            user.audioTrack.stop();
                        }
                        if (user.videoTrack) {
                            user.videoTrack.stop();
                        }
                    } catch (_) {
                        /* 单个 track 停止失败不影响其他 */
                    }
                });
            }
        } catch (_) {
            /* remoteUsers 可能不可用 */
        }
        // 停止本地轨道
        this._localAudioTrack?.close();
        this._localVideoTrack?.close();
        this._localAudioTrack = null;
        this._localVideoTrack = null;
        try {
            await this._client?.leave();
        } catch (e) {
            this.tracelog.error('离开频道失败:', e);
        }
        this.tracelog.info('已离开频道');
    }

    /**
     * 开启麦克风并发布音频
     */
    public async enableMic(): Promise<boolean> {
        if (!this._joined) return false;
        if (!this.isMediaDevicesSupported) {
            this.tracelog.error('浏览器不支持麦克风，请使用 HTTPS 访问');
            return false;
        }
        try {
            if (!this._localAudioTrack) {
                this._localAudioTrack = await (window as any).AgoraRTC.createMicrophoneAudioTrack();
            }
            await this._client.publish([this._localAudioTrack]);
            this.tracelog.info('麦克风已开启');
            return true;
        } catch (e) {
            this.tracelog.error('开启麦克风失败:', e);
            return false;
        }
    }

    /**
     * 关闭麦克风
     */
    public disableMic(): void {
        this._localAudioTrack?.close();
        this._localAudioTrack = null;
        this.tracelog.info('麦克风已关闭');
    }

    /**
     * 静音/取消静音
     */
    public setMicMuted(muted: boolean): void {
        this._localAudioTrack?.setMuted(muted);
    }

    /**
     * 开启摄像头并发布视频
     * @param container 视频渲染的 DOM 容器
     */
    public async enableCamera(container?: HTMLElement): Promise<boolean> {
        if (!this._joined) return false;
        if (!this.isMediaDevicesSupported) {
            this.tracelog.error(
                '[AgoraManager] 浏览器不支持摄像头。' + (this.isSecureContext ? '' : ' 请使用 HTTPS 访问或在 iframe 标签添加 allow="camera; microphone"。')
            );
            return false;
        }
        try {
            if (!this._localVideoTrack) {
                this._localVideoTrack = await (window as any).AgoraRTC.createCameraVideoTrack({
                    encoderConfig: { width: 240, height: 240, frameRate: 15, bitrateMax: 300 }
                });
            }
            if (container) {
                this._localVideoTrack.play(container);
            }
            // 已发布过的 track 不重复 publish，避免 ALREADY_PUBLISHED 错误
            if (!this._localVideoTrack._isPublished) {
                await this._client.publish([this._localVideoTrack]);
            }
            this.tracelog.info('摄像头已开启');
            return true;
        } catch (e: any) {
            const code = e?.code || '';
            const msg = e?.message || String(e);
            if (code === 'NOT_ALLOWED' || msg.includes('NotAllowedError') || msg.includes('Permission')) {
                this.tracelog.warn('[AgoraManager] 摄像头权限被拒绝，请手动点击摄像头按钮开启');
            } else {
                this.tracelog.error('开启摄像头失败:', e);
            }
            return false;
        }
    }

    /**
     * 关闭摄像头（先取消发布，再关闭轨道）
     */
    public async disableCamera(): Promise<void> {
        if (this._localVideoTrack && this._joined && this._client) {
            try {
                await this._client.unpublish([this._localVideoTrack]);
            } catch (e) {
                this.tracelog.warn('[AgoraManager] unpublish 视频轨道失败:', e);
            }
        }
        this._localVideoTrack?.close();
        this._localVideoTrack = null;
        this.tracelog.info('摄像头已关闭');
    }

    /**
     * 开关远端用户的音频（静音/恢复）
     * @param enabled true=恢复声音, false=静音
     * @param uid 指定远端用户 uid，不传则对所有远端用户生效
     */
    public setRemoteAudioEnabled(enabled: boolean, uid?: number): void {
        if (!this._client?.remoteUsers) return;
        if (uid === undefined) {
            this._allRemoteAudioMuted = !enabled;
        }
        const targetUsers = uid !== undefined ? this._client.remoteUsers.filter((u: any) => u.uid === uid) : this._client.remoteUsers;
        targetUsers.forEach((user: any) => {
            if (user.audioTrack) {
                user.audioTrack.setVolume(enabled ? 100 : 0);
            }
        });
        this.tracelog.info('远端音频', enabled ? '已恢复' : '已静音', uid !== undefined ? 'uid:' + uid : '全部');
    }

    /**
     * 开关远端用户的视频（隐藏/显示）
     * @param enabled true=显示视频, false=隐藏视频
     * @param uid 指定远端用户 uid，不传则对所有远端用户生效
     */
    public async setRemoteVideoEnabled(enabled: boolean, uid?: number): Promise<void> {
        if (!this._client?.remoteUsers) return;
        if (uid === undefined) {
            this._allRemoteVideoMuted = !enabled;
        }
        const targetUsers = uid !== undefined ? this._client.remoteUsers.filter((u: any) => u.uid === uid) : this._client.remoteUsers;
        for (const user of targetUsers) {
            try {
                if (enabled) {
                    await this._client.subscribe(user, 'video');
                    this.onRemoteVideo?.(user.uid, user.videoTrack);
                } else {
                    await this._client.unsubscribe(user, 'video');
                    this.onRemoteVideoUnsubscribed?.(user.uid);
                }
            } catch (e) {
                this.tracelog.warn('[AgoraManager] 切换远端视频失败, uid:', user.uid, e);
            }
        }
        this.tracelog.info('远端视频', enabled ? '已恢复' : '已隐藏', uid !== undefined ? 'uid:' + uid : '全部');
    }
    // ==================== 说话者检测（音量监控） ====================
    /**
     * 启动音量监控，定时检测所有用户（含自己）的音量，找出当前说话者
     * @param interval 轮询间隔(ms)，默认 300
     * @param threshold 判定正在说话的音量阈值(0~1)，默认 0.01
     */
    public startVolumeMonitor(interval?: number, threshold?: number): void {
        this.stopVolumeMonitor();
        if (interval !== undefined) {
            this._volumeMonitorInterval = interval;
        }
        if (threshold !== undefined) {
            this._speakingThreshold = threshold;
        }
        this._volumeMonitorTimer = window.setInterval(() => this._checkVolumeLevels(), this._volumeMonitorInterval);
        this.tracelog.info('音量监控已启动, 间隔:', this._volumeMonitorInterval, 'ms, 阈值:', this._speakingThreshold);
    }

    /**
     * 停止音量监控
     */
    public stopVolumeMonitor(): void {
        if (this._volumeMonitorTimer !== null) {
            window.clearInterval(this._volumeMonitorTimer);
            this._volumeMonitorTimer = null;
        }
        if (this._speakingUid !== null) {
            this._speakingUid = null;
            this.onActiveSpeaker?.(null);
        }
    }

    /**
     * 获取当前正在说话的用户 uid，null 表示无人说话
     */
    public get speakingUid(): number | null {
        return this._speakingUid;
    }

    /** 轮询检测所有用户的音量，找出最响的那个 */
    private _checkVolumeLevels(): void {
        if (!this._joined) {
            this._notifySpeakerChange(null);
            return;
        }
        let loudestUid: number | null = null;
        let loudestVolume: number = 0;
        // 检测远端用户
        if (this._client?.remoteUsers) {
            for (const user of this._client.remoteUsers) {
                if (user.audioTrack) {
                    try {
                        const vol = user.audioTrack.getVolumeLevel();
                        if (vol > loudestVolume) {
                            loudestVolume = vol;
                            loudestUid = user.uid;
                        }
                    } catch (_) {
                        /* getVolumeLevel 调用失败跳过 */
                    }
                }
            }
        }
        // 检测自己（本地麦克风）
        if (this._localAudioTrack) {
            try {
                const vol = this._localAudioTrack.getVolumeLevel();
                if (vol > loudestVolume) {
                    loudestVolume = vol;
                    loudestUid = this._uid;
                }
            } catch (_) {
                /* getVolumeLevel 调用失败跳过 */
            }
        }
        // 低于阈值视为无人说话
        if (loudestVolume < this._speakingThreshold) {
            loudestUid = null;
        }
        this._notifySpeakerChange(loudestUid);
    }

    /** 仅当说话者发生变化时才触发回调 */
    private _notifySpeakerChange(uid: number | null): void {
        if (this._speakingUid !== uid) {
            this._speakingUid = uid;
            this.onActiveSpeaker?.(uid);
        }
    }
    // ==================== 视频 Track 暴露（供 AgoraVideoRender 使用） ====================
    /**
     * 获取远端用户的视频 MediaStreamTrack
     * 需在远端用户发布视频后调用（onRemoteVideo 回调之后）
     */
    public getRemoteVideoTrack(uid: number): MediaStreamTrack | null {
        const user = this._client?.remoteUsers?.find((u: any) => u.uid === uid);
        if (!user?.videoTrack) {
            this.tracelog.warn('[AgoraManager] 远端用户视频Track不存在, uid:', uid);
            return null;
        }
        return user.videoTrack.getMediaStreamTrack() || null;
    }

    /**
     * 获取所有远端用户信息列表
     */
    public getRemoteUsers(): Array<{ uid: number; hasVideo: boolean; hasAudio: boolean }> {
        if (!this._client?.remoteUsers) return [];
        return this._client.remoteUsers.map((u: any) => ({
            uid: u.uid,
            hasVideo: !!u.videoTrack,
            hasAudio: !!u.audioTrack
        }));
    }

    /**
     * 销毁，释放所有资源
     */
    public async destroy(): Promise<void> {
        await this.leave();
        this._client = null;
        this.onUserJoined = null;
        this.onUserLeft = null;
        this.onRemoteAudio = null;
        this.onRemoteVideo = null;
        this.onRemoteVideoUnsubscribed = null;
        this.onError = null;
        this.onActiveSpeaker = null;
        this.tracelog.info('已销毁');
    }
}
