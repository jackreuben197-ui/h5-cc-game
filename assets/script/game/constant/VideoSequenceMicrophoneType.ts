/**
 * @module VideoSequenceMicrophoneType
 * @description 视频桌麦序模式全程音频开启时，麦克风的类型
 */
export enum VideoSequenceMicrophoneType {
    UNKNOWN = 0,
    /** 可以开关麦克风 */
    CAN_OPERATE = 1,
    /** 不可以开关麦克风 */
    CAN_NOT_OPERATE = 2
}
