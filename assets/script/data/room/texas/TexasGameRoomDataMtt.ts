import { Def, MTTInfo, MTTProgress, MyGameInfo, ServerMessageMttBreak } from '@silenthill/agreement-web';
import { bindData, IObservableBindings, observable, pureEvent } from '../../../core/decorator/DataBind';
import { createLogger } from '../../../core/decorator/LogTrace';
import TexasGameRoomData from './TexasGameRoomData';

const _plog = createLogger('TexasGameRoomDataMtt');

type MttBindings = {
    addOnResult: [number, number];
    autoOpResult: [number];
    settlementRequested: [boolean];
    reenterRequested: [];
    notice: [string];
    roomReady: [number];
    breakReminder: [number, number];
};

interface TexasGameRoomDataMtt extends IObservableBindings<TexasGameRoomDataMtt, MttBindings> {}

@bindData()
class TexasGameRoomDataMtt extends cc.EventTarget {
    public static readonly FIRST_BLIND_LEVEL = 1;
    public static readonly BREAK_TYPE_FINAL = 2;
    public static readonly BREAK_EVENT_AFTER_HAND = 1;
    public static readonly BREAK_EVENT_END_REMINDER = 2;
    public static readonly BREAK_EVENT_ENDED = 3;
    public static readonly BREAK_EVENT_UPCOMING = 4;
    public static readonly BREAK_IDLE_GRACE_SECONDS = 4;
    public static readonly STATE_CHANGED = 'STATE_CHANGED';
    public static readonly ADDON_RESULT = 'ADDON_RESULT';
    public static readonly AUTO_OP_RESULT = 'AUTO_OP_RESULT';
    public static readonly SETTLEMENT_REQUESTED = 'SETTLEMENT_REQUESTED';
    public static readonly REENTER_REQUESTED = 'REENTER_REQUESTED';
    public static readonly NOTICE = 'NOTICE';
    public static readonly ROOM_READY = 'ROOM_READY';
    public static readonly BREAK_REMINDER = 'BREAK_REMINDER';
    private _roomData: TexasGameRoomData;
    private _startCountDownDeadline: number = 0;
    private _breakHandRunning: boolean = false;
    private _breakLastBusyTime: number = 0;
    private _breakPresentationCleared: boolean = false;
    // 比赛入口、开赛和盲注进度。
    public observer: boolean = false;
    public matchName: string = '';
    public startTime: string = '';
    public startCountDown: number = 0;
    public gameStarted: boolean = false;
    public blindLevel: number = 0;
    public blindType: number = 0;
    public upBlindInterval: number = 0;
    public rebuyTimes: number = 0;
    public usedRebuyTimes: number = 0;
    public maxRebuyBlindLevel: number = 0;
    public rebuyScore: number = 0;
    public rebuyCost: number = 0;
    // 增购和附加增购状态。
    public addOnEnabled: boolean = false;
    public startAddOnBlindLevel: number = 0;
    public endAddOnBlindLevel: number = 0;
    public addOnScore: number = 0;
    public addOnMode: Def.AddOnModeMap[keyof Def.AddOnModeMap] = Def.AddOnMode.ADDON_NONE;
    public canAddOnFromServer: boolean = false;
    public normalAddOnUsed: boolean = false;
    public addOnPlusMode1: boolean = false;
    public addOnPlusMode1Limit: number = 0;
    public addOnPlusMode1MaxTimes: number = 0;
    public addOnPlusMode1Times: number = 0;
    public addOnPlusMode2: boolean = false;
    public addOnPlusMode2EndBlindLevel: number = 0;
    public addOnPlusMode2MaxTimes: number = 0;
    public addOnPlusMode2Times: number = 0;
    public addOnUsedThisHand: boolean = false;
    public addOnPending: boolean = false;
    public pendingAddOnMode: Def.AddOnModeMap[keyof Def.AddOnModeMap] = Def.AddOnMode.ADDON_NONE;
    public hunterMode: boolean = false;
    public hunterBonus: number = 0;
    public hunterFee: number = 0;
    public hunterPoolFee: number = 0;
    public hunterServiceFee: number = 0;
    public partialBringIn: boolean = false;
    public partialBringInReturnBlindLevel: number = 0;
    public moneySync: boolean = false;
    public buyRatio: number = 0;
    public sngID: number = 0;
    public currentRank: number = 0;
    public bubbleWaiting: boolean = false;
    public redistributionWaiting: boolean = false;
    public tableTransferWaiting: boolean = false;
    // 154 休息窗口和倒计时所需的服务端字段。
    public breakType: number = 0;
    public breakEventType: number = 0;
    public breakStartTime: number = 0;
    public breakEndTime: number = 0;
    public breakRemindTime: number = 0;
    public breakDuration: number = 0;
    public breakBlindLevel: number = 0;
    public breakWindowActive: boolean = false;
    @observable(TexasGameRoomDataMtt.STATE_CHANGED, { forceEmit: true })
    public revision: number = 0;

    public constructor(roomData: TexasGameRoomData) {
        super();
        this._roomData = roomData;
    }

    public initialize(observer: boolean, matchName: string, startTime: string, rebuyCost: number): void {
        this.observer = observer;
        this.matchName = matchName;
        this.startTime = startTime;
        this.rebuyCost = rebuyCost;
        this._change();
    }

    public applySnapshot(mttInfo: MTTInfo.AsObject, progress: MTTProgress.AsObject, myInfo: MyGameInfo.AsObject): void {
        // 进桌和重连统一用服务端快照恢复 MTT 状态。
        this.addOnPending = false;
        this.pendingAddOnMode = Def.AddOnMode.ADDON_NONE;
        if (mttInfo) {
            this.upBlindInterval = mttInfo.upBlindInterval;
            this.blindType = mttInfo.blindType;
            this.rebuyTimes = mttInfo.rebuyTimes;
            this.maxRebuyBlindLevel = mttInfo.maxRebuyBlindLevel;
            this.rebuyScore = mttInfo.rebuyScore;
            this.addOnEnabled = mttInfo.addOn;
            this.startAddOnBlindLevel = mttInfo.startAddOnBlindLevel;
            this.endAddOnBlindLevel = mttInfo.endAddOnBlindLevel;
            this.addOnScore = mttInfo.addOnScore;
            this.hunterMode = mttInfo.huntMode;
            this.hunterBonus = mttInfo.hunterBonus;
            this.hunterFee = mttInfo.hunterFee;
            this.hunterPoolFee = mttInfo.poolFee;
            this.hunterServiceFee = mttInfo.serviceFee;
            this.partialBringIn = mttInfo.partialBringIn;
            this.partialBringInReturnBlindLevel = mttInfo.partialBringInReturnBlindLevel;
            this.moneySync = mttInfo.moneySync;
            this.addOnPlusMode1 = mttInfo.addOnPlusMode1;
            this.addOnPlusMode1Limit = mttInfo.addOnPlusMode1Limit;
            this.addOnPlusMode1MaxTimes = mttInfo.addOnPlusMode1MaxTimes;
            this.addOnPlusMode2 = mttInfo.addOnPlusMode2;
            this.addOnPlusMode2EndBlindLevel = mttInfo.addOnPlusMode2EndBl;
            this.addOnPlusMode2MaxTimes = mttInfo.addOnPlusMode2MaxTimes;
            this.buyRatio = mttInfo.buyRatio;
            this.sngID = mttInfo.sngId;
        }
        if (progress) {
            this._applyProgress(progress);
        }
        if (myInfo) {
            this.currentRank = myInfo.mttCurrentRank;
            this.usedRebuyTimes = myInfo.rebuyTimes;
            this.normalAddOnUsed = myInfo.addon;
            this.addOnPlusMode1Times = myInfo.addonPlusMode1Times;
            this.addOnPlusMode2Times = myInfo.addonPlusMode2Times;
        }
        this._change();
    }

    public applyProgress(progress: MTTProgress.AsObject): void {
        if (!progress) {
            _plog.error('升盲进度为空，无法更新 MTT 状态');
            return;
        }
        const previousBlindLevel = this.blindLevel;
        this._applyProgress(progress);
        this._change();
        if (progress.blindLevel != previousBlindLevel) {
            if (this.addOnEnabled && progress.blindLevel == this.startAddOnBlindLevel) {
                this.notice('AddOpen');
            }
            if (this.addOnEnabled && progress.blindLevel == this.endAddOnBlindLevel) {
                this.notice('AddClose');
            }
            if (this.partialBringIn && progress.blindLevel == this.partialBringInReturnBlindLevel) {
                this.notice('Coming_soon');
            }
        }
    }

    public get remainRebuyTimes(): number {
        return Math.max(0, this.rebuyTimes - this.usedRebuyTimes);
    }

    public getStartRemainingSeconds(nowSeconds: number = this._nowSeconds()): number {
        return this._startCountDownDeadline > 0 ? Math.max(0, Math.ceil(this._startCountDownDeadline - nowSeconds)) : 0;
    }

    public getBreakRemainingSeconds(nowSeconds: number = this._nowSeconds()): number {
        return this.breakEndTime > 0 ? Math.max(0, Math.ceil(this.breakEndTime - nowSeconds)) : 0;
    }

    public shouldShowBreak(nowSeconds: number = this._nowSeconds()): boolean {
        return this._breakPresentationCleared && this._canEnterBreak(nowSeconds);
    }

    public updateBreakPresentation(nowSeconds: number = this._nowSeconds()): void {
        // 154 先进入待休息，必须到服务端开始时间且牌桌稳定空闲后才清牌、展示浮层。
        if (this._breakPresentationCleared || !this._canEnterBreak(nowSeconds)) return;
        this._clearHandPresentationForBreak();
    }

    public get displayAddOnMode(): Def.AddOnModeMap[keyof Def.AddOnModeMap] {
        if (!this.gameStarted) return Def.AddOnMode.ADDON_NONE;
        if (this.blindLevel != TexasGameRoomDataMtt.FIRST_BLIND_LEVEL) return this.addOnMode;
        return this.addOnEnabled ? Def.AddOnMode.ADDON_NORMAL : this.addOnPlusMode1 ? Def.AddOnMode.PLUS_MODE1 : Def.AddOnMode.ADDON_NONE;
    }
    public get currentAddOnMode(): Def.AddOnModeMap[keyof Def.AddOnModeMap] {
        const player = this._roomData.seatsStateManager.getSeatPlayer(this._roomData.mine.seatNo);
        if (!this.gameStarted || this.observer || !player || !player.seated || player.status != Def.CanPlayStatus.NORMAL || this.addOnPending) {
            return Def.AddOnMode.ADDON_NONE;
        }
        const mode = this.displayAddOnMode;
        if (
            mode == Def.AddOnMode.PLUS_MODE1 &&
            this.addOnPlusMode1 &&
            !this.addOnUsedThisHand &&
            player.chip < this.addOnPlusMode1Limit &&
            this.addOnPlusMode1Times < this.addOnPlusMode1MaxTimes &&
            this.blindLevel < this.maxRebuyBlindLevel
        ) {
            return Def.AddOnMode.PLUS_MODE1;
        }
        if (
            mode == Def.AddOnMode.PLUS_MODE2 &&
            this.addOnPlusMode2 &&
            !this.addOnUsedThisHand &&
            this.addOnPlusMode2Times < this.addOnPlusMode2MaxTimes &&
            this.blindLevel >= this.maxRebuyBlindLevel &&
            this.blindLevel < this.addOnPlusMode2EndBlindLevel
        ) {
            return Def.AddOnMode.PLUS_MODE2;
        }
        if (
            mode == Def.AddOnMode.ADDON_NORMAL &&
            this.addOnEnabled &&
            !this.normalAddOnUsed &&
            this.blindLevel >= this.startAddOnBlindLevel &&
            this.blindLevel < this.endAddOnBlindLevel
        ) {
            return Def.AddOnMode.ADDON_NORMAL;
        }
        return Def.AddOnMode.ADDON_NONE;
    }

    public beginAddOn(mode: Def.AddOnModeMap[keyof Def.AddOnModeMap]): boolean {
        if (mode == Def.AddOnMode.ADDON_NONE || this.addOnPending) return false;
        this.pendingAddOnMode = mode;
        this.addOnPending = true;
        this._change();
        return true;
    }

    public completeAddOn(status: number, chips: number): void {
        const mode = this.pendingAddOnMode;
        this.addOnPending = false;
        this.pendingAddOnMode = Def.AddOnMode.ADDON_NONE;
        if (status == 0) {
            if (mode == Def.AddOnMode.PLUS_MODE1) {
                this.addOnPlusMode1Times++;
                this.addOnUsedThisHand = true;
            } else if (mode == Def.AddOnMode.PLUS_MODE2) {
                this.addOnPlusMode2Times++;
                this.addOnUsedThisHand = true;
            } else if (mode == Def.AddOnMode.ADDON_NORMAL) {
                this.normalAddOnUsed = true;
            }
        }
        this._change();
        this.addOnResult(status, chips);
    }

    public setBubbleWaiting(waiting: boolean): void {
        this.bubbleWaiting = waiting;
        this._change();
    }

    public setTableTransferWaiting(waiting: boolean): void {
        // 换桌期间由 RoomData 统一驱动等待提示和进桌流程。
        this.tableTransferWaiting = waiting;
        this._change();
    }

    public refresh(): void {
        this._change();
    }

    public updateLeaveState(storeChips: number, rebuyTimes: number): void {
        this._roomData.mine.storeChips = storeChips;
        this.usedRebuyTimes = rebuyTimes;
        this._change();
    }

    public canRebuy(accountChips: number): boolean {
        return accountChips >= this.rebuyCost && this.maxRebuyBlindLevel > 0 && this.blindLevel < this.maxRebuyBlindLevel && this.remainRebuyTimes > 0;
    }

    public handleHandStart(): void {
        // 新一手开始后暂停休息浮层，避免遮挡发牌和操作区。
        this.gameStarted = true;
        this.startCountDown = 0;
        this._startCountDownDeadline = 0;
        this.bubbleWaiting = false;
        this.redistributionWaiting = false;
        this.addOnUsedThisHand = false;
        // 待休息期间若服务端继续发牌，本手结束后需要重新确认并清理桌面。
        this._breakPresentationCleared = false;
        this._setBreakHandRunning(true);
        this._change();
    }

    public handleHandClear(redistributionWaiting: boolean): void {
        // 没有 Winner 的异常时序也以 HandClear 作为手牌结束信号。
        this._setBreakHandRunning(false);
        this.redistributionWaiting = redistributionWaiting;
        this._change();
    }

    public handleHandEnd(): void {
        // Winner 只记录本手结束，是否真正进入休息由服务端 startTime 和稳定空闲共同确认。
        this._setBreakHandRunning(false);
        this._change();
    }

    public syncHandState(gameStatus: Def.GameStatusMap[keyof Def.GameStatusMap]): void {
        // 进桌和重连时按服务端牌局状态恢复休息等待条件。
        const running = gameStatus >= Def.GameStatus.HAND_STARTED && gameStatus < Def.GameStatus.HAND_END;
        this._setBreakHandRunning(running);
        this._change();
    }

    public applyBreak(data: ServerMessageMttBreak.AsObject): void {
        const nowSeconds = this._nowSeconds();
        this.breakEventType = data.eventType;
        switch (data.eventType) {
            case TexasGameRoomDataMtt.BREAK_EVENT_AFTER_HAND:
                // 记录休息窗口，等当前手牌结束并空闲后再展示共用倒计时浮层。
                this._applyBreakWindow(data);
                this.breakWindowActive = true;
                this._breakLastBusyTime = nowSeconds;
                this._breakPresentationCleared = false;
                this.notice('enterBreakAfterHandEnd');
                break;
            case TexasGameRoomDataMtt.BREAK_EVENT_END_REMINDER:
                // 浮层已经持续展示剩余时间，结束前提醒无需创建第二套提示。
                _plog.debug('收到 MTT 休息结束前提醒', data);
                break;
            case TexasGameRoomDataMtt.BREAK_EVENT_ENDED:
                // 服务端明确通知休息结束时清理完整窗口状态。
                this._clearBreak();
                break;
            case TexasGameRoomDataMtt.BREAK_EVENT_UPCOMING: {
                // 休息预告只弹一次提示，真正进入休息仍以 eventType=1 为准。
                this._applyBreakWindow(data);
                const minutesToStart = Math.max(1, Math.round((data.startTime - nowSeconds) / 60));
                this.breakReminder(minutesToStart, data.duration);
                break;
            }
            default:
                _plog.error('未知的 MTT 休息事件', data);
                break;
        }
        this._change();
    }

    @pureEvent(TexasGameRoomDataMtt.ADDON_RESULT)
    public addOnResult(status: number, chips: number): void {}

    @pureEvent(TexasGameRoomDataMtt.AUTO_OP_RESULT)
    public autoOpResult(status: number): void {}

    @pureEvent(TexasGameRoomDataMtt.SETTLEMENT_REQUESTED)
    public requestSettlement(rebuy: boolean): void {}

    @pureEvent(TexasGameRoomDataMtt.REENTER_REQUESTED)
    public requestReenter(): void {}

    @pureEvent(TexasGameRoomDataMtt.NOTICE)
    public notice(i18nKey: string): void {}

    @pureEvent(TexasGameRoomDataMtt.ROOM_READY)
    public roomReady(roomID: number): void {}

    @pureEvent(TexasGameRoomDataMtt.BREAK_REMINDER)
    public breakReminder(minutesToStart: number, durationMinutes: number): void {}

    private _applyProgress(progress: MTTProgress.AsObject): void {
        this.startCountDown = progress.startCountDown;
        this._startCountDownDeadline = progress.startCountDown > 0 ? this._nowSeconds() + progress.startCountDown : 0;
        this.gameStarted = progress.startCountDown <= 0;
        this.blindLevel = progress.blindLevel;
        this.canAddOnFromServer = progress.canAddOn;
        this.addOnMode = progress.addonMode;
        this.bubbleWaiting = progress.isBubbleWait;
    }

    private _applyBreakWindow(data: ServerMessageMttBreak.AsObject): void {
        this.breakType = data.breakType;
        this.breakStartTime = data.startTime;
        this.breakEndTime = data.endTime;
        this.breakRemindTime = data.remindTime;
        this.breakDuration = data.duration;
        this.breakBlindLevel = data.blindLevel;
    }

    private _canEnterBreak(nowSeconds: number): boolean {
        return (
            this.breakWindowActive &&
            nowSeconds >= this.breakStartTime &&
            this.getBreakRemainingSeconds(nowSeconds) > 0 &&
            !this._breakHandRunning &&
            nowSeconds - this._breakLastBusyTime >= TexasGameRoomDataMtt.BREAK_IDLE_GRACE_SECONDS
        );
    }

    private _clearHandPresentationForBreak(): void {
        // 休息只清理本手牌面、手牌、牌型、高亮和底池，不影响玩家座位与筹码。
        this._roomData.clearHandPresentation();
        this._breakPresentationCleared = true;
    }

    private _clearBreak(): void {
        this.breakType = 0;
        this.breakStartTime = 0;
        this.breakEndTime = 0;
        this.breakRemindTime = 0;
        this.breakDuration = 0;
        this.breakBlindLevel = 0;
        this.breakWindowActive = false;
        this._breakHandRunning = false;
        this._breakLastBusyTime = 0;
        this._breakPresentationCleared = false;
    }

    private _setBreakHandRunning(running: boolean): void {
        if (running || this._breakHandRunning != running) {
            this._breakLastBusyTime = this._nowSeconds();
        }
        this._breakHandRunning = running;
    }

    private _nowSeconds(): number {
        return Math.floor(Date.now() / 1000);
    }

    private _change(): void {
        this.revision++;
    }
}

export default TexasGameRoomDataMtt;
