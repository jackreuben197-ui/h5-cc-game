import { bindData, observable, pureEvent } from '../../../core/decorator/DataBind';
import { AnimateDisplayTypeButton, AnimateDisplayTypeMushroomPool, AnimateDisplayTypePosition } from '../../../game/constant/AnimateDisplayType';
import TexasGameRoomData from './TexasGameRoomData';
import TexasGameRoomDataPlayer from './TexasGameRoomDataPlayer';

//   4 5 6
// 3       7
// 2       8
// 1       9
//     0
export enum SeatPosition {
    Default = 99,
    BottomMiddle = 0,
    BottomLeft,
    MiddleLeft,
    TopLeft,
    TopLeft1,
    TopMiddle,
    TopRight1,
    TopRight,
    MiddleRight,
    BottomRight,
    TopLeft7, // 7人桌的修正
    TopRight7 // 7人桌的修正
}

const SeatsArrange: Record<number, SeatPosition[]> = {
    2: [SeatPosition.BottomMiddle, SeatPosition.TopMiddle],
    3: [SeatPosition.BottomMiddle, SeatPosition.TopLeft, SeatPosition.TopRight],
    4: [SeatPosition.BottomMiddle, SeatPosition.MiddleLeft, SeatPosition.TopMiddle, SeatPosition.MiddleRight],
    5: [SeatPosition.BottomMiddle, SeatPosition.MiddleLeft, SeatPosition.TopLeft1, SeatPosition.TopRight1, SeatPosition.MiddleRight],
    6: [SeatPosition.BottomMiddle, SeatPosition.BottomLeft, SeatPosition.TopLeft, SeatPosition.TopMiddle, SeatPosition.TopRight, SeatPosition.BottomRight],
    7: [
        SeatPosition.BottomMiddle,
        SeatPosition.BottomLeft,
        SeatPosition.TopLeft7,
        SeatPosition.TopLeft1,
        SeatPosition.TopRight1,
        SeatPosition.TopRight7,
        SeatPosition.BottomRight
    ],
    8: [
        SeatPosition.BottomMiddle,
        SeatPosition.BottomLeft,
        SeatPosition.MiddleLeft,
        SeatPosition.TopLeft,
        SeatPosition.TopMiddle,
        SeatPosition.TopRight,
        SeatPosition.MiddleRight,
        SeatPosition.BottomRight
    ],
    9: [
        SeatPosition.BottomMiddle,
        SeatPosition.BottomLeft,
        SeatPosition.MiddleLeft,
        SeatPosition.TopLeft,
        SeatPosition.TopLeft1,
        SeatPosition.TopRight1,
        SeatPosition.TopRight,
        SeatPosition.MiddleRight,
        SeatPosition.BottomRight
    ]
} as const;

@bindData()
export default class TexasGameRoomDataSeatsStateManager extends cc.EventTarget {
    public static readonly BUTTON_CHANGE = 'BUTTON_CHANGE';
    public static readonly SEATS_CHANGE = 'SEATS_CHANGE';
    public static readonly MUSHROOM_POOL_CHANGE = 'MUSHROOM_POOL_CHANGE';
    public static readonly SPEAKING_CHANGE = 'SPEAKING_CHANGE';
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

    /** 当前说话者 uid（0 = 无人说话），由 VideoRoomManager 在 activeSpeaker 回调中设置 */
    @observable(TexasGameRoomDataSeatsStateManager.SPEAKING_CHANGE)
    public speakingUid: number = 0;
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
        const arrage = SeatsArrange[this._seatsCount];
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
        const arrage = SeatsArrange[this._seatsCount];
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

    /**
     * 通过 userID 查找座位数据
     * @returns 匹配的 TexasGameRoomDataPlayer，未找到返回 null
     */
    public findSeatByUserId(userId: number): TexasGameRoomDataPlayer | null {
        let found: TexasGameRoomDataPlayer = null;
        this._playerMap.forEach((p: TexasGameRoomDataPlayer) => {
            if (!found && p.userID === userId) {
                found = p;
            }
        });
        return found;
    }

    /**
     * 获取所有已入座的座位数据
     */
    public getAllSeats(): TexasGameRoomDataPlayer[] {
        const result: TexasGameRoomDataPlayer[] = [];
        this._playerMap.forEach((p: TexasGameRoomDataPlayer) => {
            if (p.userID) {
                result.push(p);
            }
        });
        return result;
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
