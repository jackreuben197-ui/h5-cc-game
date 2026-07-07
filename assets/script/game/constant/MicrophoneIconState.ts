/**
 * @module MicrophoneIconState
 * @description 视频桌座位头像的麦克风图标状态
 */
export enum MicrophoneIconState {
    /** 不显示图标 */
    HIDDEN = 0,
    /** 正在说话（喇叭图标） */
    SPEAKING = 1,
    /** 麦克风被禁止/未开启 */
    MUTED = 2
}
