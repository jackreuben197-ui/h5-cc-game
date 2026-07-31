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
    /** MTT强制 */
    FORCE = 4,
    /** 特效 */
    EFFECT = 5,
    /** 真人 */
    HUMAN = 6
}

export interface AudioAntiCheatConfig {
    timelimit: number; // 音频防作弊时间限制(s)
}

export interface IVASeatedSetting {
    enableCamera: boolean; // 是否显示摄像头
    canOpCamera: boolean;
    canOpMicrophone: boolean;
    canSwitchPowerSaving: boolean; // 能切mask
    canDisablePowerSaving: boolean;
    openCamera: boolean; // 是否打开相机
    openMicrophone: boolean; // 是否打开麦克风
    openPowerSaving: boolean; // 打开mask
}

@traceClass()
export class VideoAntiCheatConfig {
    private _timelimit: number = 0; // 视频防作弊时间限制(s) 全时长这个没有作用
    private _mode: VideoModel; // 视频防作弊模式 // 视频模式 0 未知 1 全时长 2 随机验证 3 麦序, 5, 6
    private _micSeat: boolean;
    private _micMiddle: boolean;
    private _videoSeat: boolean;
    private _videoMiddle: boolean;
    private _powerSaveing: boolean;
    private _powerSavingSeat: boolean; // 节能模式，坐下是否启用
    private _powerSavingMiddle: boolean; // 节能模式，坐下后是否能关闭
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
        powerSaving: boolean,
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
        this._powerSaveing = powerSaving;
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
    public get isOrderMode(): boolean {
        return this._antiCheatType == 3 && this._mode == 3;
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
    public get isOptionalVideoMaskMode(): boolean {
        return this._mode == VideoModel.HUMAN || this._mode == VideoModel.EFFECT;
    }
    public get shouldShowVideoMask(): boolean {
        return this._powerSaveing || (this.isOptionalVideoMaskMode && this._powerSavingSeat);
    }

    public getVisibleVideoMaskId(maskId: number): number {
        if (maskId > 4) return 1;
        return maskId == 0 && !this.isOptionalVideoMaskMode ? 1 : maskId;
    }

    public getTimelimit(): number {
        return this._timelimit;
    }

    /** 坐下后的默认开始配置（自己） */
    public getSeatedSetting(): IVASeatedSetting {
        // 实时语音
        if (this._antiCheatType == 2) {
            return {
                enableCamera: false,
                canOpCamera: false,
                canOpMicrophone: false,
                canSwitchPowerSaving: false,
                canDisablePowerSaving: false,
                openCamera: false,
                openMicrophone: true,
                openPowerSaving: false
            };
        }
        const canDisablePowerSaving = this._powerSaveing && this._powerSavingMiddle && this.isOptionalVideoMaskMode;
        const openPowerSaving = this.isOptionalVideoMaskMode ? this._powerSavingSeat : this._powerSaveing;
        switch (this._mode) {
            case VideoModel.FORCE:
            case VideoModel.FULL_TIME:
                return {
                    enableCamera: true,
                    canOpCamera: false,
                    canOpMicrophone: false,
                    canSwitchPowerSaving: this._powerSaveing,
                    canDisablePowerSaving: false,
                    openCamera: true,
                    openMicrophone: true,
                    openPowerSaving: this._powerSaveing
                };
            case VideoModel.RANDOM:
            case VideoModel.SEQUENCE:
                return {
                    enableCamera: true,
                    canOpCamera: false,
                    canOpMicrophone: false,
                    canSwitchPowerSaving: false,
                    canDisablePowerSaving: false,
                    openCamera: false,
                    openMicrophone: false,
                    openPowerSaving: this._powerSaveing
                };
            case VideoModel.HUMAN:
            case VideoModel.EFFECT:
            default:
                return {
                    enableCamera: true,
                    canOpCamera: this._videoMiddle,
                    canOpMicrophone: this._micMiddle,
                    canSwitchPowerSaving: this._powerSaveing,
                    canDisablePowerSaving: canDisablePowerSaving,
                    openCamera: this._videoSeat,
                    openMicrophone: this._micSeat,
                    openPowerSaving: openPowerSaving
                };
        }
    }
}
