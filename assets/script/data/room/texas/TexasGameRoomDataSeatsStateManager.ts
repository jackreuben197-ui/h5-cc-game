import { bindData, pureEvent } from '../../../core/decorator/DataBind';
import { AnimateDisplayTypeButton, AnimateDisplayTypeMushroomPool, AnimateDisplayTypePosition } from '../../../game/constant/AnimateDisplayType';
import { PropsID } from '../../../game/constant/BroadcastCode';
import seatPostionCaculator from '../../../views/scene/room/texas/widget/SeatPositionCaculator';
import TexasGameRoomData from './TexasGameRoomData';
import TexasGameRoomDataPlayer from './TexasGameRoomDataPlayer';

export interface ThrowPropBroadcastData {
    type: PropsID;
    userID: number;
    targetUserID: number;
}

export interface DiamondGiftBroadcastData {
    senderID: number;
    receiverID: number;
    amount: number;
}

export interface EmojiBroadcastData {
    type: number;
    userID: number;
}

@bindData()
export default class TexasGameRoomDataSeatsStateManager extends cc.EventTarget {
    public static readonly BUTTON_CHANGE = 'BUTTON_CHANGE';
    public static readonly SEATS_CHANGE = 'SEATS_CHANGE';
    public static readonly MUSHROOM_POOL_CHANGE = 'MUSHROOM_POOL_CHANGE';
    public static readonly SPEAKING_CHANGE = 'SPEAKING_CHANGE';
    public static readonly THROW_PROP = 'THROW_PROP';
    public static readonly DIAMOND_GIFT = 'DIAMOND_GIFT';
    public static readonly EMOJI = 'EMOJI';
    private _parentRoomData: TexasGameRoomData;

    constructor(p: TexasGameRoomData) {
        super();
        this._parentRoomData = p;
    }

    private _playerMap: Map<number, TexasGameRoomDataPlayer> = new Map();
    private _buttonPosition: number = 0;
    public get buttonPosition() {
        return this._buttonPosition;
    }
    private _prevMushroomBtn: number = 0;
    private _pendingThrowPropData: ThrowPropBroadcastData = null;
    private _pendingEmojiData: EmojiBroadcastData = null;

    public setMushroomPoolChange(btnSeatNo: number, pool: number, bat: AnimateDisplayTypeMushroomPool) {
        if (pool == 0) return;
        // 绝对发送
        const prev = this._prevMushroomBtn;
        this._prevMushroomBtn = btnSeatNo;
        const cnt = Math.floor(Math.round((pool * 1000) / this._parentRoomData.basicInfo.mushroomBase) / 1000);
        this.mushroomPoolChangeEmit(prev, this._prevMushroomBtn, cnt, pool, bat);
    }

    @pureEvent(TexasGameRoomDataSeatsStateManager.MUSHROOM_POOL_CHANGE, {
        initParams() {
            const cnt = Math.floor(Math.round((this._parentRoomData.basicInfo.mushroomStatusPool * 1000) / this._parentRoomData.basicInfo.mushroomBase) / 1000);
            return [0, this._prevMushroomBtn, cnt, this._parentRoomData.basicInfo.mushroomStatusPool, AnimateDisplayTypeMushroomPool.Static];
        }
    })
    public mushroomPoolChangeEmit(prev: number, cur: number, count: number, pool: number, bat: AnimateDisplayTypeMushroomPool) {}

    public setButtonPosition(c: number, bat: AnimateDisplayTypeButton) {
        if (c == this._buttonPosition) return;
        const prev = this._buttonPosition;
        this._buttonPosition = c;
        this.buttonChangeEvent(prev, this._buttonPosition, bat);
    }

    @pureEvent(TexasGameRoomDataSeatsStateManager.BUTTON_CHANGE, {
        initParams() {
            return [0, this._buttonPosition, AnimateDisplayTypeButton.Static];
        }
    })
    public buttonChangeEvent(prev: number, cur: number, bat: AnimateDisplayTypeButton) {}

    public setPendingThrowProp(data: ThrowPropBroadcastData): void {
        this._pendingThrowPropData = data;
    }

    public confirmPendingThrowProp(status: number): void {
        const data = this._pendingThrowPropData;
        this._pendingThrowPropData = null;
        if (status !== 0 || !data) return;
        this.throwPropEvent(data);
    }

    @pureEvent(TexasGameRoomDataSeatsStateManager.THROW_PROP)
    public throwPropEvent(data: ThrowPropBroadcastData): void {}

    public setPendingEmoji(data: EmojiBroadcastData): void {
        this._pendingEmojiData = data;
    }

    public confirmPendingEmoji(status: number): void {
        const data = this._pendingEmojiData;
        this._pendingEmojiData = null;
        if (status !== 0 || !data) return;
        this.emojiEvent(data);
    }

    @pureEvent(TexasGameRoomDataSeatsStateManager.EMOJI)
    public emojiEvent(data: EmojiBroadcastData): void {}

    @pureEvent(TexasGameRoomDataSeatsStateManager.DIAMOND_GIFT)
    public diamondGiftEvent(data: DiamondGiftBroadcastData): void {}

    /** 当前说话者的座位号 */
    private _speaking: number = 0;
    public set speakingUID(uid: number) {
        let seatNo = 0;
        if (uid > 0) {
            const seat = this.getSeatPlayerByUserID(uid);
            if (seat) {
                seatNo = seat.seatNo;
            }
        }
        if (seatNo == this._speaking) return;
        const prev = this._speaking;
        this._speaking = seatNo;
        this.speakingChangeEvent(prev, this._speaking);
    }

    /** 当前说话者 uid（0 = 无人说话），由 Texas 视频流程在 activeSpeaker 回调中设置 */
    @pureEvent(TexasGameRoomDataSeatsStateManager.SPEAKING_CHANGE, {
        initParams() {
            return [0, this._speaking];
        }
    })
    public speakingChangeEvent(prev: number, cur: number) {}

    private _seatsCount: number;

    public getSeatPlayer(i: number) {
        return this._playerMap.get(i);
    }

    public get seatsCount() {
        return this._seatsCount;
    }
    public set seatsCount(c: number) {
        if (this._seatsCount == c) return;
        this._seatsCount = c;
        const arrage = seatPostionCaculator.getPositions(c);
        for (let i = 1; i <= 9; i++) {
            if (i <= this._seatsCount) {
                if (this._playerMap.has(i)) {
                    continue;
                }
                this._playerMap.set(i, new TexasGameRoomDataPlayer(i, arrage[i - 1], this._parentRoomData));
                continue;
            }
            this._playerMap.delete(i);
        }
        this.seatCountChange(this._seatsCount);
    }

    @pureEvent(TexasGameRoomDataSeatsStateManager.SEATS_CHANGE, {
        initParams() {
            return [this._seatsCount];
        }
    })
    private seatCountChange(cnt: number) {}

    public setMySeat(s: number, pat: AnimateDisplayTypePosition): TexasGameRoomDataPlayer {
        if (this._parentRoomData.mine.seatNo == s) return this._playerMap.get(s);
        if (s == 0) {
            this._parentRoomData.mine.seatNo = 0;
            return null;
        }
        //重排
        const arrage = seatPostionCaculator.getPositions(this._seatsCount);
        let j = 0;
        for (let i = s; i < s + this._seatsCount; i++) {
            let ss = i % this.seatsCount == 0 ? this.seatsCount : i % this.seatsCount;
            const player = this._playerMap.get(ss);
            if (ss == s) {
                this._parentRoomData.mine.seatNo = ss;
                //先坐下再调整位置注意顺序
                player.setSeated(true, player.mine);
                player.setPosition(arrage[j], pat);
            } else {
                player.setPosition(arrage[j], pat);
            }
            j++;
        }
        return this._playerMap.get(s);
    }

    public forEachPlayer(cb: (p: TexasGameRoomDataPlayer) => void) {
        this._playerMap.forEach(p => {
            if (p.userID > 0) {
                cb(p);
            }
        });
    }

    public getSeatPlayerByUserID(userID: number): TexasGameRoomDataPlayer | null {
        let target: TexasGameRoomDataPlayer = null;
        this._playerMap.forEach(player => {
            if (player.userID == userID) {
                target = player;
            }
        });
        return target;
    }

    public resetVideoAndAudioStates(): void {
        this.speakingUID = 0;
        this._playerMap.forEach(p => {
            p.resetVideoAndAudioStates();
        });
    }

    public roundReset() {
        this._playerMap.forEach(p => {
            p.roundReset();
        });
    }

    public handEnd() {
        this._playerMap.forEach(p => {
            p.handEnd();
        });
    }

    public handClear() {
        this._playerMap.forEach(p => {
            p.handClear();
        });
    }
}
