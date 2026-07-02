/**
 * 游戏玩法工具类
 * 提供游戏相关的静态工具方法
 */
import { HttpUserInfoProtocol } from '../../net/https/data/user/HttpUserInfoProtocol';

type ValidBasicType = string | number | boolean | null | undefined | bigint;

export default class GameplayUtil {
    constructor() {
        throw new Error(`${GameplayUtil.name} is a static class and cannot be instantiated`);
    }

    public static IsTrader(user: HttpUserInfoProtocol.UserInfo): boolean {
        return Date.now() < user.trader_expire_time * 1000;
    }

    public static RoomTypeExtract(roomType: number) {
        // 1. 是否是 MTT 赛制 (右移 9 位)
        const isMTT = roomType >> 9 === 1;
        // 2. 取低 9 位的数据
        let left = roomType & 0x1ff;
        // 3. 剥离游戏大类 GameType (右移 6 位)
        const gameType = left >> 6;
        // 4. 取剩下的低 6 位
        left = left & 0x3f;
        // 5. 剥离 扑克类型 PokerType (右移 3 位)
        const pokerType = left >> 3;
        // 6. 剩下的最后 3 位就是下注限制类型 LimitBetType
        const betType = left & 0x07;
        return {
            gameType,
            pokerType,
            betType,
            isMTT
        };
    }

    public static CardNoToLocalResource(cardNo: number) {
        if (cardNo == 0) {
            return 'p_88';
        }
        let suit = Math.floor(cardNo / 15);
        let num = (cardNo % 15) - 1;
        if (num == 13) num = 0;
        const calc = suit * 13 + num;
        return `p_${calc}`;
    }

    public static DeskTypeIndexToLocalResource(tableIndex: number) {
        return 't_' + tableIndex;
    }

    /**
     * 判断两个对象是否深度完全相同（支持嵌套对象/数组递归穿透）
     * @returns {boolean} true 表示【完全相同】，false 表示【不相同/有变化】
     */
    public static isObjectSame<T extends Record<string, any>>(objA: T, objB: T): boolean {
        if (objA === objB) return true;
        if (!objA || !objB) return false;
        const keysA = Object.keys(objA);
        const keysB = Object.keys(objB);
        if (keysA.length !== keysB.length) return false;
        for (let key of keysA) {
            const valA = objA[key];
            const valB = objB[key];
            if (Array.isArray(valA) && Array.isArray(valB)) {
                if (!GameplayUtil.isArraySame(valA, valB)) return false;
            } else if (typeof valA === 'object' && valA !== null && typeof valB === 'object' && valB !== null) {
                if (!GameplayUtil.isObjectSame(valA, valB)) return false;
            } else if (valA !== valB) {
                return false;
            }
        }
        return true;
    }

    // 内部提取一个通用的“单元素对比断言”
    private static isElementSame<T>(a: T, b: T): boolean {
        if (Array.isArray(a) && Array.isArray(b)) {
            return GameplayUtil.isArraySame(a, b);
        }
        if (typeof a === 'object' && a !== null && typeof b === 'object' && b !== null) {
            return GameplayUtil.isObjectSame(a as any, b as any);
        }
        return a === b;
    }

    /**
     * 通用数组对比：支持基础类型数组（string[], number[] 等）及扁平对象数组（T[]）
     * @param checkOrder 是否严格检查顺序。
     * @returns {boolean} true 表示【完全相同】，false 表示【不相同/有变化】
     */
    public static isArraySame<T extends ValidBasicType | Record<string, any>>(arrA: T[], arrB: T[], checkOrder: boolean = true): boolean {
        if (arrA === arrB) return true;
        if (!arrA || !arrB) return false;
        if (arrA.length !== arrB.length) return false;
        // 情况 A：必须顺序一致
        if (checkOrder) {
            for (let i = 0; i < arrA.length; i++) {
                if (!GameplayUtil.isElementSame<T>(arrA[i], arrB[i])) return false;
            }
            return true;
        }
        // 情况 B：不需要顺序一致（无序对比）
        else {
            const poolB = [...arrB];
            for (const itemA of arrA) {
                const matchIndex = poolB.findIndex(itemB => GameplayUtil.isElementSame<T>(itemA, itemB));
                if (matchIndex === -1) return false;
                poolB.splice(matchIndex, 1);
            }
            return true;
        }
    }
}
