// =========================================================================
// 1. 游戏基础枚举与错误定义
// =========================================================================

export enum HandValueType {
    HVHighPokerCard = 1, // 高牌
    HVOnePair, // 一对
    HVTwoPair, // 两对
    HVThreeOfAKind, // 三条
    HVStraight, // 顺子
    HVFlush, // 同花
    HVFullHouse, // 葫芦
    HVFourOfAKind, // 四条
    HVStraightFlush, // 同花顺
    HVRoyalFlush // 皇家同花顺
}

export enum InnerPokerType {
    InnerPokerTypeStandard = 1, // 标准德州扑克
    InnerPokerTypeSixPlus, // 短牌 (6+)
    InnerPokerTypeSixPlusFix // 短牌修正版 (6+ Fix)
}

export const Errors = {
    ErrInvalidPokerCard: new Error('invalid card num(2-14)/suit(0-3)'),
    ErrInvalidHandValueType: new Error('invalid hand value type'),
    ErrDuplicatePokerCard: new Error('duplicate card'),
    ErrIncorrectPokerCardForPokeType: new Error('6+ or 6+fix does not have card less than 6'),
    ErrPokerCardsLength: new Error('_cards length is not 5')
};

// 全局静态字典映射
const CARD_NUM_MAP: Record<number, string> = {
    2: '2',
    3: '3',
    4: '4',
    5: '5',
    6: '6',
    7: '7',
    8: '8',
    9: '9',
    10: '10',
    11: 'J',
    12: 'Q',
    13: 'K',
    14: 'A'
};

const SUIT_MAP: string[] = ['♠', '♥', '♣', '♦'];

export const HandValueTypeStringMap: Record<HandValueType, string> = {
    [HandValueType.HVHighPokerCard]: '高牌',
    [HandValueType.HVOnePair]: '一对',
    [HandValueType.HVTwoPair]: '两对',
    [HandValueType.HVThreeOfAKind]: '三条',
    [HandValueType.HVStraight]: '顺子',
    [HandValueType.HVFlush]: '同花',
    [HandValueType.HVFullHouse]: '葫芦',
    [HandValueType.HVFourOfAKind]: '四条',
    [HandValueType.HVStraightFlush]: '同花顺',
    [HandValueType.HVRoyalFlush]: '皇家同花顺'
};

export function handValueTypeToString(type: HandValueType): string {
    return HandValueTypeStringMap[type];
}

// 位移预乘常量 (2^n)
const SHIFT_20 = 1048576;

const SHIFT_16 = 65536;

const SHIFT_12 = 4096;

const SHIFT_8 = 256;

const SHIFT_4 = 16;
// =========================================================================
// 2. PokerCard 类实现（轻量化，专供外部业务层随时转化使用）
// =========================================================================
export class PokerCard {
    public readonly Num: number; // 2-14
    public readonly Suit: number; // 0-3

    constructor(num: number, suit: number) {
        this.Num = num;
        this.Suit = suit;
    }

    /** 通过唯一的数字 Value 逆向解析并创建 PokerCard 节点 */
    public static newPokerCardByValue(value: number): PokerCard {
        return PokerCard.newPokerCardNoErr(value % 15, Math.floor(value / 15));
    }

    public static newPokerCard(num: number, suit: number): PokerCard {
        if (num < 2 || num > 14) throw Errors.ErrInvalidPokerCard;
        if (suit < 0 || suit > 3) throw Errors.ErrInvalidHandValueType;
        return new PokerCard(num, suit);
    }

    public static newPokerCardNoErr(num: number, suit: number): PokerCard {
        if (num < 2 || num > 14) throw Errors.ErrInvalidPokerCard;
        if (suit < 0 || suit > 3) throw Errors.ErrInvalidHandValueType;
        return new PokerCard(num, suit);
    }

    public suitString(): string {
        return SUIT_MAP[this.Suit] || '';
    }

    public numString(): string {
        return CARD_NUM_MAP[this.Num] || '';
    }

    public string(): string {
        return this.suitString() + this.numString();
    }

    public value(): number {
        return this.Suit * 15 + this.Num;
    }
}
// =========================================================================
// 3. HandValue 类实现 (内部纯 number 跑数，杜绝对象构建开销)
// =========================================================================
export class HandValue {
    // 💥 内部完全采用定长 8 位无符号数字数组来代表 5 张牌的唯一值
    private _cards: Uint8Array = new Uint8Array(5);
    private _value: number = 0;
    private _maxHandValueType!: HandValueType;
    private _compareTypeDict!: Record<HandValueType, number>;
    private _pokerType: InnerPokerType;

    private constructor(nc: number[], ht: InnerPokerType) {
        if (nc.length !== 5) throw Errors.ErrPokerCardsLength;
        for (let i = 0; i < 5; i++) this._cards[i] = nc[i];
        this._pokerType = ht;
        this._compareTypeDict =
            ht === InnerPokerType.InnerPokerTypeSixPlus
                ? sixPlusCompareMap
                : ht === InnerPokerType.InnerPokerTypeSixPlusFix
                  ? sixPlusFixCompareMap
                  : standardCompareMap;
    }

    /** 工厂函数：直接接收 5 个纯数字 Value */
    public static create(nc: number[], ht: InnerPokerType): HandValue {
        const hv = new HandValue(nc, ht);
        hv.evaluate();
        return hv;
    }

    /** 核心设计：只返回纯数字数组，内部计算 0 开销 */
    public rawCards(): number[] {
        const carsArray: number[] = Array.from(this._cards);
        return carsArray;
    }

    /** 🌟 极便通道：当外部业务层（如UI显示）需要 PokerCard 类时，被动生成，不污染内部核心计算 */
    public toPokerCards(): PokerCard[] {
        const res: PokerCard[] = [];
        for (let i = 0; i < 5; i++) {
            res.push(PokerCard.newPokerCardByValue(this._cards[i]));
        }
        return res;
    }

    public get value(): number {
        return this._value;
    }
    public get handValueType(): HandValueType {
        return this._maxHandValueType;
    }

    private evaluate(): void {
        this.generalCheck();
        if (this._maxHandValueType === HandValueType.HVFlush || this._maxHandValueType === HandValueType.HVHighPokerCard) {
            const isStraight = this.isStraight();
            if (this._maxHandValueType === HandValueType.HVFlush && isStraight) {
                this._maxHandValueType = this._cards[0] % 15 === 14 ? HandValueType.HVRoyalFlush : HandValueType.HVStraightFlush;
                this.caculateValue();
                return;
            }
            if (isStraight) {
                this._maxHandValueType = HandValueType.HVStraight;
                this.caculateValue();
            }
        }
    }

    private isStraight(): boolean {
        const c = this._cards;
        const n0 = c[0] % 15,
            n1 = c[1] % 15,
            n2 = c[2] % 15,
            n3 = c[3] % 15,
            n4 = c[4] % 15;
        if (this._pokerType === InnerPokerType.InnerPokerTypeStandard && n0 === 14 && n1 === 5 && n2 === 4 && n3 === 3 && n4 === 2) {
            const temp = c[0];
            c[0] = c[1];
            c[1] = c[2];
            c[2] = c[3];
            c[3] = c[4];
            c[4] = temp;
            return true;
        }
        if (
            (this._pokerType === InnerPokerType.InnerPokerTypeSixPlus || this._pokerType === InnerPokerType.InnerPokerTypeSixPlusFix) &&
            n0 === 14 &&
            n1 === 9 &&
            n2 === 8 &&
            n3 === 7 &&
            n4 === 6
        ) {
            const temp = c[0];
            c[0] = c[1];
            c[1] = c[2];
            c[2] = c[3];
            c[3] = c[4];
            c[4] = temp;
            return true;
        }
        for (let i = 1; i < 5; i++) {
            if (n0 - (c[i] % 15) !== i) return false;
        }
        return true;
    }

    private generalCheck(): void {
        const c = this._cards;
        let isFlush = true;
        // 纯数字原生快速原地冒泡
        for (let i = 0; i < 5; i++) {
            for (let j = i + 1; j < 5; j++) {
                const vi = c[i],
                    vj = c[j];
                const ni = vi % 15,
                    nj = vj % 15;
                const si = Math.floor(vi / 15),
                    sj = Math.floor(vj / 15);
                if (isFlush && si !== sj) isFlush = false;
                if (ni < nj) {
                    c[i] = vj;
                    c[j] = vi;
                    continue;
                }
                if (ni === nj) {
                    if (si === sj) throw Errors.ErrDuplicatePokerCard;
                    if (si > sj) {
                        c[i] = vj;
                        c[j] = vi;
                    }
                }
            }
        }
        if ((this._pokerType === InnerPokerType.InnerPokerTypeSixPlus || this._pokerType === InnerPokerType.InnerPokerTypeSixPlusFix) && c[4] % 15 < 6) {
            throw Errors.ErrIncorrectPokerCardForPokeType;
        }
        if (isFlush) {
            this._maxHandValueType = HandValueType.HVFlush;
            this.caculateValue();
            return;
        }
        // 用 Uint8Array 数组计数器
        const counts = new Uint8Array(15);
        for (let i = 0; i < 5; i++) {
            counts[c[i] % 15]++;
        }
        let maxCount = 0;
        let pairCount = 0;
        let tripPokerCard = 0;
        const pairPokerCards: number[] = [];
        for (let num = 14; num >= 2; num--) {
            const cnt = counts[num];
            if (cnt > maxCount) maxCount = cnt;
            if (cnt === 4 || cnt === 3) {
                tripPokerCard = num;
            } else if (cnt === 2) {
                pairCount++;
                pairPokerCards.push(num);
            }
        }
        // 成牌、散牌顺序重组
        if (maxCount === 1) {
            this._maxHandValueType = HandValueType.HVHighPokerCard;
        } else {
            const temp = new Uint8Array(5);
            let tIdx = 0,
                kIdx = 4;
            let p1 = pairPokerCards[0] || 0,
                p2 = pairPokerCards[1] || 0;
            for (let i = 0; i < 5; i++) {
                const num = c[i] % 15;
                const isCore =
                    (maxCount === 4 && num === tripPokerCard) ||
                    (maxCount === 3 && num === tripPokerCard) ||
                    (maxCount === 2 && pairCount === 1 && num === p1) ||
                    (maxCount === 2 && pairCount === 2 && (num === p1 || num === p2));
                if (isCore) temp[tIdx++] = c[i];
                else temp[kIdx--] = c[i];
            }
            for (let i = 0; i < 5; i++) c[i] = temp[i];
            if (maxCount === 2 && pairCount === 1) this._maxHandValueType = HandValueType.HVOnePair;
            else if (maxCount === 2 && pairCount === 2) this._maxHandValueType = HandValueType.HVTwoPair;
            else if (maxCount === 3 && pairCount === 0) this._maxHandValueType = HandValueType.HVThreeOfAKind;
            else if (maxCount === 3 && pairCount === 1) this._maxHandValueType = HandValueType.HVFullHouse;
            else if (maxCount === 4) this._maxHandValueType = HandValueType.HVFourOfAKind;
        }
        this.caculateValue();
    }

    private caculateValue(): void {
        const compareValue = this._compareTypeDict[this._maxHandValueType];
        const c = this._cards;
        const n0 = c[0] % 15,
            n1 = c[1] % 15,
            n2 = c[2] % 15,
            n3 = c[3] % 15,
            n4 = c[4] % 15;
        switch (this._maxHandValueType) {
            case HandValueType.HVHighPokerCard:
            case HandValueType.HVFlush:
                this._value = compareValue * SHIFT_20 + n0 * SHIFT_16 + n1 * SHIFT_12 + n2 * SHIFT_8 + n3 * SHIFT_4 + n4;
                break;
            case HandValueType.HVOnePair:
                this._value = compareValue * SHIFT_20 + n0 * SHIFT_12 + n2 * SHIFT_8 + n3 * SHIFT_4 + n4;
                break;
            case HandValueType.HVTwoPair:
            case HandValueType.HVThreeOfAKind:
                this._value = compareValue * SHIFT_20 + n0 * SHIFT_8 + n3 * SHIFT_4 + n4;
                break;
            case HandValueType.HVStraight:
            case HandValueType.HVStraightFlush:
            case HandValueType.HVRoyalFlush:
                this._value = compareValue * SHIFT_20 + n0;
                break;
            case HandValueType.HVFullHouse:
            case HandValueType.HVFourOfAKind:
                this._value = compareValue * SHIFT_20 + n0 * SHIFT_4 + n4;
                break;
        }
    }

    public String(): string {
        const format = (val: number) => `${CARD_NUM_MAP[val % 15]}(${SUIT_MAP[Math.floor(val / 15)]})`;
        return `${format(this._cards[0])} - ${format(this._cards[1])} - ${format(this._cards[2])} - ${format(this._cards[3])} - ${format(this._cards[4])} : ${HandValueTypeStringMap[this._maxHandValueType]}`;
    }
}

// 权重映射字典
const standardCompareMap = {
    [HandValueType.HVHighPokerCard]: 1,
    [HandValueType.HVOnePair]: 2,
    [HandValueType.HVTwoPair]: 3,
    [HandValueType.HVThreeOfAKind]: 4,
    [HandValueType.HVStraight]: 5,
    [HandValueType.HVFlush]: 6,
    [HandValueType.HVFullHouse]: 7,
    [HandValueType.HVFourOfAKind]: 8,
    [HandValueType.HVStraightFlush]: 9,
    [HandValueType.HVRoyalFlush]: 10
};

const sixPlusCompareMap = {
    [HandValueType.HVHighPokerCard]: 1,
    [HandValueType.HVOnePair]: 2,
    [HandValueType.HVTwoPair]: 3,
    [HandValueType.HVStraight]: 4,
    [HandValueType.HVThreeOfAKind]: 5,
    [HandValueType.HVFullHouse]: 6,
    [HandValueType.HVFlush]: 7,
    [HandValueType.HVFourOfAKind]: 8,
    [HandValueType.HVStraightFlush]: 9,
    [HandValueType.HVRoyalFlush]: 10
};

const sixPlusFixCompareMap = {
    [HandValueType.HVHighPokerCard]: 1,
    [HandValueType.HVOnePair]: 2,
    [HandValueType.HVTwoPair]: 3,
    [HandValueType.HVThreeOfAKind]: 4,
    [HandValueType.HVStraight]: 5,
    [HandValueType.HVFullHouse]: 6,
    [HandValueType.HVFlush]: 7,
    [HandValueType.HVFourOfAKind]: 8,
    [HandValueType.HVStraightFlush]: 9,
    [HandValueType.HVRoyalFlush]: 10
};
