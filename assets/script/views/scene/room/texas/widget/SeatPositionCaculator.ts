import { GameConfig } from '../../../../../config/GameConfig';
import { traceClass, traceMethod } from '../../../../../core/decorator/LogTrace';

//   4 5 6
// 3       7
// 2(10)   8(11)
// 1       9
//     0
export enum SeatPosition {
    Default = 99,
    BottomMiddle = 0,
    BottomLeft,
    MiddleLeft,
    TopLeft,
    TopMiddleLeft,
    TopMiddle,
    TopMiddleRight,
    TopRight,
    MiddleRight,
    BottomRight
}

export interface positionWithScale {
    position: cc.Vec3;
    scale: number;
}

const defaultPostion: positionWithScale = {
    position: cc.v3(0, 0),
    scale: 1
};

const SeatsArrange: Record<number, SeatPosition[]> = {
    2: [SeatPosition.BottomMiddle, SeatPosition.TopMiddle],
    3: [SeatPosition.BottomMiddle, SeatPosition.TopLeft, SeatPosition.TopRight],
    4: [SeatPosition.BottomMiddle, SeatPosition.MiddleLeft, SeatPosition.TopMiddle, SeatPosition.MiddleRight],
    5: [SeatPosition.BottomMiddle, SeatPosition.BottomLeft, SeatPosition.TopLeft, SeatPosition.TopRight, SeatPosition.BottomRight],
    6: [SeatPosition.BottomMiddle, SeatPosition.BottomLeft, SeatPosition.TopLeft, SeatPosition.TopMiddle, SeatPosition.TopRight, SeatPosition.BottomRight],
    7: [
        SeatPosition.BottomMiddle,
        SeatPosition.BottomLeft,
        SeatPosition.TopLeft,
        SeatPosition.TopMiddleLeft,
        SeatPosition.TopMiddleRight,
        SeatPosition.TopRight,
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
        SeatPosition.TopMiddleLeft,
        SeatPosition.TopMiddleRight,
        SeatPosition.TopRight,
        SeatPosition.MiddleRight,
        SeatPosition.BottomRight
    ]
} as const;

@traceClass()
export class SeatPositionCaculator {
    public constructor() {
        SeatPositionCaculator.defaultContainerHeight = GameConfig.DESIGN_RESOLUTION.height;
        SeatPositionCaculator.defaultContainerWidth = GameConfig.DESIGN_RESOLUTION.width;
    }

    private _seatHeight = 0;
    private _seaWidth = 0;
    private _realSeatHeight = 0;
    private _realSeatWidth = 0;
    private _topY = 0;
    private _bottomY = 0;
    private _leftX = 0;
    private _rightX = 0;
    private static readonly BOTTOM_GAP = 600;
    private static readonly TOP_GAP = 520;
    private static readonly SEAT_GAP_Y = 6 * 3.5;
    private static readonly SEAT_GAP_X = 60;
    private static defaultContainerWidth = 0;
    private static defaultContainerHeight = 0;
    private _map: Map<SeatPosition, positionWithScale> = new Map();
    private _containerW = 0;
    private _containerH = 0;
    private _offsetY = 0; // 中心点的向上偏移

    public initWithContainer(w: number, h: number, offsetY: number = 0, seatWidth: number = 270, seatHeight: number = 370) {
        this._containerH = h;
        this._containerW = w;
        this._offsetY = offsetY;
        this._seatHeight = seatHeight;
        this._seaWidth = seatWidth;
        this._realSeatHeight = this._seatHeight;
        this._realSeatWidth = this._seaWidth;
    }

    @traceMethod({ level: 'debug' })
    public arrageSeatPositions(seatCount: number) {
        this._map.clear();
        let columnRows = 1;
        let rowColumns = 1;
        switch (seatCount) {
            case 2:
                columnRows = 0;
                rowColumns = 1;
                break;
            case 3:
            case 4:
                columnRows = 1;
                rowColumns = 1;
                break;
            case 5:
                rowColumns = 0;
                columnRows = 2;
                break;
            case 6:
                rowColumns = 1;
                columnRows = 2;
                break;
            case 7:
                rowColumns = 2;
                columnRows = 2;
                break;
            case 8:
                rowColumns = 1;
                columnRows = 3;
                break;
            case 9:
                rowColumns = 2;
                columnRows = 3;
                break;
            default:
                this.tracelog.error('unsupported seat count', seatCount);
                columnRows = 1;
                break;
        }
        this._calcScale(columnRows, rowColumns);
        this._map.set(SeatPosition.BottomMiddle, {
            position: cc.v3(0, this._bottomY),
            scale: this._scale
        });
        switch (seatCount) {
            case 2:
                this._map.set(SeatPosition.TopMiddle, {
                    position: cc.v3(0, this._topY),
                    scale: this._scale
                });
                break;
            case 3:
                this._map.set(SeatPosition.TopLeft, {
                    position: cc.v3(this._leftX, this._topHigh),
                    scale: this._scale
                });
                this._map.set(SeatPosition.TopRight, {
                    position: cc.v3(this._rightX, this._topHigh),
                    scale: this._scale
                });
                break;
            case 4:
                this._map.set(SeatPosition.MiddleLeft, {
                    position: cc.v3(this._leftX, this._topHigh),
                    scale: this._scale
                });
                this._map.set(SeatPosition.TopMiddle, {
                    position: cc.v3(0, this._topY),
                    scale: this._scale
                });
                this._map.set(SeatPosition.MiddleRight, {
                    position: cc.v3(this._rightX, this._topHigh),
                    scale: this._scale
                });
                break;
            case 5:
                this._map.set(SeatPosition.BottomLeft, {
                    position: cc.v3(this._leftX, this._bottomLow),
                    scale: this._scale
                });
                this._map.set(SeatPosition.TopLeft, {
                    position: cc.v3(this._leftX, this._topHigh),
                    scale: this._scale
                });
                this._map.set(SeatPosition.TopRight, {
                    position: cc.v3(this._rightX, this._topHigh),
                    scale: this._scale
                });
                this._map.set(SeatPosition.BottomRight, {
                    position: cc.v3(this._rightX, this._bottomLow),
                    scale: this._scale
                });
                break;
            case 6:
                this._map.set(SeatPosition.BottomLeft, {
                    position: cc.v3(this._leftX, this._bottomLow),
                    scale: this._scale
                });
                this._map.set(SeatPosition.TopLeft, {
                    position: cc.v3(this._leftX, this._topHigh),
                    scale: this._scale
                });
                this._map.set(SeatPosition.TopMiddle, {
                    position: cc.v3(0, this._topY),
                    scale: this._scale
                });
                this._map.set(SeatPosition.TopRight, {
                    position: cc.v3(this._rightX, this._topHigh),
                    scale: this._scale
                });
                this._map.set(SeatPosition.BottomRight, {
                    position: cc.v3(this._rightX, this._bottomLow),
                    scale: this._scale
                });
                break;
            case 7:
                this._map.set(SeatPosition.BottomLeft, {
                    position: cc.v3(this._leftX, this._bottomLow),
                    scale: this._scale
                });
                this._map.set(SeatPosition.TopLeft, {
                    position: cc.v3(this._leftX, this._topHigh),
                    scale: this._scale
                });
                this._map.set(SeatPosition.TopMiddleLeft, {
                    position: cc.v3(this._leftLow, this._topY),
                    scale: this._scale
                });
                this._map.set(SeatPosition.TopMiddleRight, {
                    position: cc.v3(this._rightHigh, this._topY),
                    scale: this._scale
                });
                this._map.set(SeatPosition.TopRight, {
                    position: cc.v3(this._rightX, this._topHigh),
                    scale: this._scale
                });
                this._map.set(SeatPosition.BottomRight, {
                    position: cc.v3(this._rightX, this._bottomLow),
                    scale: this._scale
                });
                break;
            case 8:
                this._map.set(SeatPosition.BottomLeft, {
                    position: cc.v3(this._leftX, this._bottomLow),
                    scale: this._scale
                });
                this._map.set(SeatPosition.MiddleLeft, {
                    position: cc.v3(this._leftX, this._bottomLow + this._realSeatHeight + this._gap),
                    scale: this._scale
                });
                this._map.set(SeatPosition.TopLeft, {
                    position: cc.v3(this._leftX, this._topHigh),
                    scale: this._scale
                });
                this._map.set(SeatPosition.TopMiddle, {
                    position: cc.v3(0, this._topY),
                    scale: this._scale
                });
                this._map.set(SeatPosition.TopRight, {
                    position: cc.v3(this._rightX, this._topHigh),
                    scale: this._scale
                });
                this._map.set(SeatPosition.MiddleRight, {
                    position: cc.v3(this._rightX, this._bottomLow + this._realSeatHeight + this._gap),
                    scale: this._scale
                });
                this._map.set(SeatPosition.BottomRight, {
                    position: cc.v3(this._rightX, this._bottomLow),
                    scale: this._scale
                });
                break;
            case 9:
                this._map.set(SeatPosition.BottomLeft, {
                    position: cc.v3(this._leftX, this._bottomLow),
                    scale: this._scale
                });
                this._map.set(SeatPosition.MiddleLeft, {
                    position: cc.v3(this._leftX, this._bottomLow + this._realSeatHeight + this._gap),
                    scale: this._scale
                });
                this._map.set(SeatPosition.TopLeft, {
                    position: cc.v3(this._leftX, this._topHigh),
                    scale: this._scale
                });
                this._map.set(SeatPosition.TopMiddleLeft, {
                    position: cc.v3(this._leftLow, this._topY),
                    scale: this._scale
                });
                this._map.set(SeatPosition.TopMiddleRight, {
                    position: cc.v3(this._rightHigh, this._topY),
                    scale: this._scale
                });
                this._map.set(SeatPosition.TopRight, {
                    position: cc.v3(this._rightX, this._topHigh),
                    scale: this._scale
                });
                this._map.set(SeatPosition.MiddleRight, {
                    position: cc.v3(this._rightX, this._bottomLow + this._realSeatHeight + this._gap),
                    scale: this._scale
                });
                this._map.set(SeatPosition.BottomRight, {
                    position: cc.v3(this._rightX, this._bottomLow),
                    scale: this._scale
                });
                break;
            default:
                break;
        }
    }

    public getPositions(seatCount: number): SeatPosition[] {
        return SeatsArrange[seatCount];
    }

    public getPosition(pos: SeatPosition): positionWithScale {
        if (pos == SeatPosition.Default) {
            return defaultPostion;
        }
        return this._map.get(pos);
    }

    private _scale = 1;
    private _gap = 0;
    private _topHigh = 0;
    private _bottomLow = 0;
    private _leftLow = 0;
    private _rightHigh = 0;

    private _calcScale(rows: number, columns: number) {
        const containerHeight = this._containerH;
        const containerWidth = this._containerW;
        const scale = this._containerH / SeatPositionCaculator.defaultContainerHeight;
        const topGap = SeatPositionCaculator.TOP_GAP * scale;
        const bottomGap = SeatPositionCaculator.BOTTOM_GAP * scale;
        const gap = SeatPositionCaculator.SEAT_GAP_Y * scale;
        const minHeight = (containerHeight - topGap - bottomGap - (rows - 1) * gap) / rows;
        if (minHeight <= 0) {
            this.tracelog.error('impossible there is no room for seat');
            this._scale = 1;
            this._gap = 0;
            return;
        }
        if (minHeight >= this._seatHeight) {
            this._scale = 1;
            this._gap = (containerHeight - topGap - bottomGap - rows * this._seatHeight) / rows;
            this._realSeatHeight = this._seatHeight;
            this._realSeatWidth = this._seaWidth;
            this._topHigh = -this._seatHeight / 2 - topGap - this._gap / 2 + this._offsetY;
            this._bottomLow = -containerHeight + this._seatHeight / 2 + bottomGap + this._gap / 2 + this._offsetY;
        } else {
            this._scale = minHeight / this._seatHeight;
            this._realSeatHeight = this._seatHeight * this._scale;
            this._realSeatWidth = this._seaWidth * this._scale;
            if (rows > 1) {
                this._gap = (containerHeight - topGap - bottomGap - rows * this._realSeatHeight) / (rows - 1);
            } else {
                this._gap = 0;
            }
            this._topHigh = -this._realSeatHeight / 2 - topGap + this._offsetY;
            this._bottomLow = -containerHeight + this._realSeatHeight / 2 + bottomGap + this._offsetY;
        }
        if (columns == 2) {
            this._leftLow = (-SeatPositionCaculator.SEAT_GAP_X * containerWidth) / SeatPositionCaculator.defaultContainerWidth - this._realSeatWidth / 2;
            this._rightHigh = (SeatPositionCaculator.SEAT_GAP_X * containerWidth) / SeatPositionCaculator.defaultContainerWidth + this._realSeatWidth / 2;
        }
        this._topY = -this._realSeatHeight / 2 + this._offsetY;
        this._bottomY = -containerHeight + this._realSeatHeight / 2 + this._offsetY;
        this._leftX = -containerWidth / 2 + this._realSeatWidth / 2;
        this._rightX = containerWidth / 2 - this._realSeatWidth / 2;
    }
}

const seatPostionCaculator = new SeatPositionCaculator();

export default seatPostionCaculator;
