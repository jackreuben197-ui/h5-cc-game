import { traceClass } from '../../core/decorator/LogTrace';

/**
 * @module VideoModel
 * @description 视频桌模式
 */
export enum VideoModel {
    /** 未开启视频桌 */
    NONE = 0,
    /** 全时长 */
    FULL_TIME = 1,
    /** 随机验证 */
    RANDOM = 2,
    /** 麦序 */
    SEQUENCE = 3,
    /** 真人 */
    HUMAN = 4,
    /** 特效 */
    EFFECT = 5
}

export interface AudioAntiCheatConfig {
    timelimit: number; // 音频防作弊时间限制(s)
}

export interface IVASeatedSetting {
    showCamera: boolean; // 是否显示摄像头
    micOpen: boolean; // 麦克风是否开启
    cameraOpen: boolean; // 摄像头是否开启
    psOpen: boolean; // 节能模式是否开启
    timeLimit: number; // 坐下后多久必须开启麦克风或摄像头(秒) -1 代表全时长
}

export interface IVAPlayingSetting {
    showCamera: boolean; // 是否显示摄像头
    micCanOp: boolean; // 麦克风是否可以操作
    cameraCanOp: boolean; // 摄像头是否可以操作
    psCanOp: boolean; // 节能模式是否可以操作
}

@traceClass()
export class VideoAntiCheatConfig {
    private _timelimit: number; // 视频防作弊时间限制(s) 全时长这个没有作用
    private _mode: VideoModel; // 视频防作弊模式
    private _micSeat: boolean;
    private _micMiddle: boolean;
    private _videoSeat: boolean;
    private _videoMiddle: boolean;
    private _powerSavingSeat: boolean; // 节能模式
    private _powerSavingMiddle: boolean; // 节能模式
    private _antiCheatType: number; // 防作弊类型 0 未知 1 无 2 实时语音 3 实时视频 4 人脸验证
    private _normalAntiCheatOrderType: number; // 1: 麦序（不可以关麦） 2: 全程语音（可以开关麦）
    private _verifyType: number; // 1: 音视频 2：视频
    private _startTime: number = 0; // 开始时间戳(秒) 用于计算剩余时间

    constructor(
        antiCheatType: number,
        timelimit: number,
        mode: VideoModel,
        micSeat: boolean,
        micMiddle: boolean,
        videoSeat: boolean,
        videoMiddle: boolean,
        powerSavingSeat: boolean,
        powerSavingMiddle: boolean,
        normalAntiCheatOrderType: number,
        verifyType: number
    ) {
        this._timelimit = timelimit;
        this._mode = mode;
        this._micSeat = micSeat;
        this._micMiddle = micMiddle;
        this._videoSeat = videoSeat;
        this._videoMiddle = videoMiddle;
        this._powerSavingSeat = powerSavingSeat;
        this._powerSavingMiddle = powerSavingMiddle;
        this._antiCheatType = antiCheatType;
        this._normalAntiCheatOrderType = normalAntiCheatOrderType;
        this._verifyType = verifyType;
        if (this._antiCheatType == 4) {
            this.tracelog.error('防作弊类型为人脸验证, 不支持');
        }
    }

    public get mode(): VideoModel {
        return this._mode;
    }
    public get antiCheatType(): number {
        return this._antiCheatType;
    }
    public get isInVideoRoom(): boolean {
        return this._antiCheatType > 1 && this._antiCheatType < 4;
    }

    public start() {
        this._startTime = Math.floor(Date.now() / 1000);
    }

    public getDuration(): number {
        if (this._startTime <= 0) {
            return 0;
        }
        const now = Math.floor(Date.now() / 1000);
        return now - this._startTime;
    }

    public get micOrderCanOp(): boolean {
        return this._normalAntiCheatOrderType == 1;
    }
    public get randomTimeLimit(): number {
        return this._timelimit;
    }

    /** 中途是否可以操作（自己） */
    public getPlayingSetting(): IVAPlayingSetting {
        // 实时语音
        if (this._antiCheatType == 2) {
            return {
                showCamera: false,
                micCanOp: false,
                cameraCanOp: false,
                psCanOp: false
            };
        }
        switch (this._mode) {
            case VideoModel.FULL_TIME:
                return {
                    showCamera: true,
                    micCanOp: false,
                    cameraCanOp: false,
                    psCanOp: this._powerSavingMiddle
                };
            case VideoModel.RANDOM:
            case VideoModel.SEQUENCE:
                return {
                    showCamera: true,
                    micCanOp: false,
                    cameraCanOp: false,
                    psCanOp: this._powerSavingMiddle
                };
            case VideoModel.HUMAN:
            case VideoModel.EFFECT:
            default:
                return {
                    showCamera: true,
                    micCanOp: this._micMiddle,
                    cameraCanOp: this._videoMiddle,
                    psCanOp: this._powerSavingMiddle
                };
        }
    }

    /** 坐下后的默认开始配置（自己） */
    public getSeatedSetting(): IVASeatedSetting {
        // 实时语音
        if (this._antiCheatType == 2) {
            return {
                showCamera: false,
                micOpen: true,
                cameraOpen: false,
                psOpen: false,
                timeLimit: -1
            };
        }
        switch (this._mode) {
            case VideoModel.FULL_TIME:
                return {
                    showCamera: true,
                    micOpen: true,
                    cameraOpen: true,
                    psOpen: this._powerSavingSeat,
                    timeLimit: -1
                };
            case VideoModel.RANDOM:
            case VideoModel.SEQUENCE:
                return {
                    showCamera: true,
                    micOpen: false,
                    cameraOpen: false,
                    psOpen: this._powerSavingSeat,
                    timeLimit: 0
                };
            case VideoModel.HUMAN:
            case VideoModel.EFFECT:
            default:
                return {
                    showCamera: true,
                    micOpen: this._micSeat,
                    cameraOpen: this._videoSeat,
                    psOpen: this._powerSavingSeat,
                    timeLimit: this._timelimit
                };
        }
    }
}
