/**
 * @module VideoSequenceAudioType
 * @description 视频桌麦序模式下音频类型
 */
export enum VideoSequenceAudioType {
    UNKNOWN = 0,
    /** 麦序音频（关闭全程音频） */
    SEQUENCE_AUDIO = 1,
    /** 开启全程音频 */
    WHOLE_AUDIO = 2
}
