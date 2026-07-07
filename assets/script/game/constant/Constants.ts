export enum MttPlayerStatus {
    /// <summary>
    /// 玩家未报名，等待开放报名
    /// </summary>
    WAITING_APPLY,
    /// <summary>
    /// 玩家未报名，当前可以报名（赛前报名阶段)
    /// </summary>
    CAN_APPLY_NOT_START,
    /// <summary>
    /// 玩家未报名，当前可以报名（延迟报名阶段）
    /// </summary>
    CAN_APPLY_DELAY,
    /// <summary>
    /// 玩家已报名，还未开赛
    /// </summary>
    APPLIED_NOT_START,
    /// <summary>
    /// 玩家已报名，可以进入比赛 (还有筹码（断线)/还有存储筹码/报名了还没进入/重购了还没进入)
    /// </summary>
    CAN_JOIN,
    /// <summary>
    /// 玩家未报名，已错过报名阶段, 比赛已经开始
    /// </summary>
    CANNOT_APPLY_STARTED,
    /// <summary>
    /// 玩家已经被淘汰，还可以选择重购
    /// </summary>
    LOSE_CAN_REBUY,
    /// <summary>
    /// 玩家已经被淘汰，没有机会了
    /// </summary>
    LOSE,
    /// <summary>
    /// 报名的比赛已经结束
    /// </summary>
    JOIN_COMPLETE,
    /// <summary>
    /// 未参与的比赛已经结束
    /// </summary>
    NOT_JOIN_COMPLETE,
    /// <summary>
    /// 进入超时
    /// </summary>
    CANNOT_JOIN_OVERTIME
}

export enum GamePlaySubType {
    NONE = 0,
    MUSH = 1,
    SQUID = 2
}

export enum ButtonState {
    DISABLE = 0,
    ON = 1,
    OFF = 2,
    HIDDEN = 3
}
