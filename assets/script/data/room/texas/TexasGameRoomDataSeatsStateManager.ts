import { bindData, pureEvent } from '../../../core/decorator/DataBind';
import { AnimateDisplayTypeButton, AnimateDisplayTypePosition } from '../../../game/constant/AnimateDisplayType';
import TexasGameRoomData from './TexasGameRoomData';
import TexasGameRoomDataPlayer from './TexasGameRoomDataPlayer';
import TexasGameRoomDataPlayerMine from './TexasGameRoomDataPlayerMine';

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

    public setButtonPosition(c: number, bat: AnimateDisplayTypeButton) {
        if (c == this._buttonPosition) return;
        const prev = this._buttonPosition;
        this._buttonPosition = c;
        this.buttonChangeEvent(prev, this._buttonPosition, bat);
    }

    @pureEvent('BUTTON_CHANGE', {
        initParams() {
            return [0, this._buttonPosition, AnimateDisplayTypeButton.Static];
        }
    })
    public buttonChangeEvent(prev: number, cur: number, bat: AnimateDisplayTypeButton) {}

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

    @pureEvent('SEATS_CHANGE', {
        initParams() {
            return [this._seatsCount];
        }
    })
    private seatCountChange(cnt: number) {}

    private _mySeat: number = 0;
    public get mySeat() {
        return this._mySeat;
    }

    public setMySeat(s: number, pat: AnimateDisplayTypePosition): TexasGameRoomDataPlayerMine {
        if (this._mySeat == s) return;
        //重排
        const arrage = SeatsArrange[this._seatsCount];
        let j = 0;
        for (let i = s; i < s + this._seatsCount; i++) {
            let ss = i % this.seatsCount == 0 ? this.seatsCount : i % this.seatsCount;
            const player = this._playerMap.get(ss);
            if (ss == s) {
                player.setPosition(arrage[j], pat);
                player.mine = new TexasGameRoomDataPlayerMine();
            } else {
                player.setPosition(arrage[j], pat);
            }
            j++;
        }
        return this._playerMap.get(s).mine;
    }
    // public seated(seatNo: number, isSelf: boolean): TexasGameRoomDataPlayer{
    //     if (isSelf) {
    //         //重排
    //         const arrage = SeatsArrange[this._seatsCount];
    //         let j = 0;
    //         for (let i = seatNo; i < seatNo + this._seatsCount; i++) {
    //             let ss = i % this.seatsCount == 0 ? this.seatsCount : i % this.seatsCount;
    //             const player = this._playerMap.get(ss);
    //             player.setPosition(arrage[j], AnimateDisplayTypePosition.ToTarget);
    //             j++;
    //             if (ss == seatNo) {
    //                 player.mine = new TexasGameRoomDataPlayerMine();
    //             }
    //         }
    //     }
    //     return this.getSeatPlayer(seatNo);
    // }
    public roundClear() {
        this._playerMap.forEach(p => {
            p.roundClear();
        });
    }

    public handClear() {
        this._playerMap.forEach(p => {
            p.handClear();
        });
    }
}
