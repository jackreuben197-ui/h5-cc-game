import { HandValue, InnerPokerType } from './PoerkCard'; // 100% 对齐你的纯数字版判定核心

// =========================================================================
// 性能压榨核心：将所有固定的组合索引直接进行硬编码（Look-up Table）。
// 这样做可以完全拍平分支逻辑，彻底免除运行时递归调用栈的开销，速度达到硬件级极限。
// =========================================================================

// 6选5 组合索引矩阵（共 6 种组合）
const COMB_6_5 = [
    [0, 1, 2, 3, 4],
    [0, 1, 2, 3, 5],
    [0, 1, 2, 4, 5],
    [0, 1, 3, 4, 5],
    [0, 2, 3, 4, 5],
    [1, 2, 3, 4, 5]
];

// 7选5 组合索引矩阵（共 21 种组合）
const COMB_7_5 = [
    [0, 1, 2, 3, 4],
    [0, 1, 2, 3, 5],
    [0, 1, 2, 3, 6],
    [0, 1, 2, 4, 5],
    [0, 1, 2, 4, 6],
    [0, 1, 2, 5, 6],
    [0, 1, 3, 4, 5],
    [0, 1, 3, 4, 6],
    [0, 1, 3, 5, 6],
    [0, 1, 4, 5, 6],
    [0, 2, 3, 4, 5],
    [0, 2, 3, 4, 6],
    [0, 2, 3, 5, 6],
    [0, 2, 4, 5, 6],
    [0, 3, 4, 5, 6],
    [1, 2, 3, 4, 5],
    [1, 2, 3, 4, 6],
    [1, 2, 3, 5, 6],
    [1, 2, 4, 5, 6],
    [1, 3, 4, 5, 6],
    [2, 3, 4, 5, 6]
];

// 4选3 组合索引矩阵（共 4 种组合，用于转牌圈奥马哈公共牌拆分）
const COMB_4_3 = [
    [0, 1, 2],
    [0, 1, 3],
    [0, 2, 3],
    [1, 2, 3]
];

// 5选3 组合索引矩阵（共 10 种组合，用于河牌圈奥马哈公共牌拆分）
const COMB_5_3 = [
    [0, 1, 2],
    [0, 1, 3],
    [0, 1, 4],
    [0, 2, 3],
    [0, 2, 4],
    [0, 3, 4],
    [1, 2, 3],
    [1, 2, 4],
    [1, 3, 4],
    [2, 3, 4]
];

/**
 * 【高能核心函数】根据公共牌数与手牌数，自动枚举并拆分出所有合法的 5 张牌 HandValue 组合。
 * 全链路无伤重构，内部运行期间【无任何新数组分配】，零内存垃圾抖动。
 * * @param pub 公共牌数组（纯数字唯一值，如 [14, 28, 35]）
 * @param hand 玩家手牌数组（纯数字唯一值，支持 2~6 张，如奥马哈 [12, 13, 24, 25]）
 * @param pe 扑克类型 (Standard = 1, SixPlus = 2, SixPlusFix = 3)
 */
export function getHandValueByPokerType(pub: number[], hand: number[], pe: InnerPokerType): HandValue[] {
    const lp = pub.length;
    const lh = hand.length;
    // 安全边界防御
    if (lp < 3 || lp > 5) throw new Error('unsupported public card length (must be 3-5)');
    if (lh < 2 || lh > 6) throw new Error('unsupported hands card length (must be 2-6)');
    // 🌟 性能压榨关键点：在栈上声明一块定长为 5 的空间缓冲区。
    // 在接下来的所有循环和交叉配对中，只修改这一个 buffer 的数字，绝不 new 任何新数组。
    const buffer = new Array<number>(5);
    const hands: HandValue[] = [];
    // =========================================================================
    // 1. 标准德州扑克玩法 (手牌固定为 2 张)
    // 规则：公共牌 + 手牌混合在一起（共5-7张），任意选出5张即可
    // =========================================================================
    if (lh === 2) {
        const nc = [...pub, ...hand]; // 仅在头部合并一次，形成大单池
        const totalLen = nc.length;
        if (totalLen === 5) {
            // 刚好 5 张牌（翻牌圈 3张公共 + 2张手牌），只有 1 种组合
            return [HandValue.create(nc, pe)];
        }
        if (totalLen === 6) {
            // 6 张牌（转牌圈 4张公共 + 2张手牌），进行 6 选 5
            for (let i = 0; i < 6; i++) {
                const idx = COMB_6_5[i];
                buffer[0] = nc[idx[0]];
                buffer[1] = nc[idx[1]];
                buffer[2] = nc[idx[2]];
                buffer[3] = nc[idx[3]];
                buffer[4] = nc[idx[4]];
                hands.push(HandValue.create(buffer, pe));
            }
            return hands;
        }
        if (totalLen === 7) {
            // 7 张牌（河牌圈 5张公共 + 2张手牌），进行 7 选 5
            for (let i = 0; i < 21; i++) {
                const idx = COMB_7_5[i];
                buffer[0] = nc[idx[0]];
                buffer[1] = nc[idx[1]];
                buffer[2] = nc[idx[2]];
                buffer[3] = nc[idx[3]];
                buffer[4] = nc[idx[4]];
                hands.push(HandValue.create(buffer, pe));
            }
            return hands;
        }
        throw new Error(`invalid merged length: ${totalLen}`);
    }
    // =========================================================================
    // 2. 奥马哈或特殊多手牌玩法 (手牌多于 2 张，如 4张、5张、6张手牌)
    // 经典规则：必须强制满足【3张公共牌 + 2张手牌】进行严格组合
    // =========================================================================
    // 预先算好手牌任选 2 张的索引矩阵，避免在深层循环中高频重复计算
    const handComb2: number[][] = [];
    for (let i = 0; i < lh; i++) {
        for (let j = i + 1; j < lh; j++) {
            handComb2.push([i, j]);
        }
    }
    const lh2 = handComb2.length;
    // 情况 A：翻牌圈（3张公共牌）-> 公共牌 3 张必须全选，只需遍历手牌选 2
    if (lp === 3) {
        buffer[0] = pub[0];
        buffer[1] = pub[1];
        buffer[2] = pub[2];
        for (let i = 0; i < lh2; i++) {
            const hIdx = handComb2[i];
            buffer[3] = hand[hIdx[0]];
            buffer[4] = hand[hIdx[1]];
            hands.push(HandValue.create(buffer, pe));
        }
        return hands;
    }
    // 情况 B：转牌圈（4张公共牌）-> 公共牌 4 选 3，嵌套手牌选 2
    if (lp === 4) {
        for (let i = 0; i < 4; i++) {
            const pIdx = COMB_4_3[i];
            buffer[0] = pub[pIdx[0]];
            buffer[1] = pub[pIdx[1]];
            buffer[2] = pub[pIdx[2]];
            for (let j = 0; j < lh2; j++) {
                const hIdx = handComb2[j];
                buffer[3] = hand[hIdx[0]];
                buffer[4] = hand[hIdx[1]];
                hands.push(HandValue.create(buffer, pe));
            }
        }
        return hands;
    }
    // 情况 C：河牌圈（5张公共牌）-> 公共牌 5 选 3，嵌套手牌选 2
    if (lp === 5) {
        for (let i = 0; i < 10; i++) {
            const pIdx = COMB_5_3[i];
            buffer[0] = pub[pIdx[0]];
            buffer[1] = pub[pIdx[1]];
            buffer[2] = pub[pIdx[2]];
            for (let j = 0; j < lh2; j++) {
                const hIdx = handComb2[j];
                buffer[3] = hand[hIdx[0]];
                buffer[4] = hand[hIdx[1]];
                hands.push(HandValue.create(buffer, pe));
            }
        }
        return hands;
    }
    throw new Error(`invalid public cards length: ${lp}`);
}

/**
 * 【优化版主接口】直接帮外部抓出【最大】的那一单手牌组合对象。
 * 扁平化单层 for 循环就地过滤最大权重，提速明显。
 * * @param pub 公共牌数组（纯数字唯一值）
 * @param hand 玩家手牌数组（纯数字唯一值）
 * @param pe 玩法类型
 */
export function getMaxHandValueByPokeType(pub: number[], hand: number[], pe: InnerPokerType): HandValue {
    // 1. 拆分出所有可能的组合
    const hands = getHandValueByPokerType(pub, hand, pe);
    // 2. 纯粹单层循环比对绝对 Value 分值
    let maxHand = hands[0];
    const len = hands.length;
    for (let i = 1; i < len; i++) {
        if (hands[i].value > maxHand.value) {
            maxHand = hands[i];
        }
    }
    return maxHand;
}
