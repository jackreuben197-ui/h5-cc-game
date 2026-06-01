/**
 * 游戏玩法工具类
 * 提供游戏相关的静态工具方法
 */
import { HttpUserInfoProtocol } from '../../net/https/data/user/HttpUserInfoProtocol';

type ValidBasicType = string | number | boolean | null | undefined | bigint;

type SimpleFlatObject<T> = {
    [K in keyof T]: T[K] extends ValidBasicType ? T[K] : never;
};

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

    /**
     * 判断两个单层纯对象是否完全相同
     * @returns {boolean} true 表示【完全相同】，false 表示【不相同/有变化】
     */
    public static isObjectSame<T extends SimpleFlatObject<T>>(objA: T, objB: T): boolean {
        if (objA === objB) return true; // 引用相同 -> 完全相同 (true)
        if (!objA || !objB) return false; // 有一个为空 -> 不相同 (false)
        const keysA = Object.keys(objA) as Array<keyof T>;
        const keysB = Object.keys(objB);
        if (keysA.length !== keysB.length) return false; // 属性数量不等 -> 不相同 (false)
        for (let key of keysA) {
            if (objA[key] !== objB[key]) {
                return false; // 发现值不一样 -> 不相同 (false)
            }
        }
        return true; // 全都一样 -> 完全相同 (true)
    }

    // 内部提取一个通用的“单元素对比断言”
    private static isElementSame<T>(a: T, b: T): boolean {
        // 如果是对象且不为 null，走对象对比逻辑；否则直接基础类型 === 对比
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
    public static isArraySame<T extends ValidBasicType | SimpleFlatObject<any>>(arrA: T[], arrB: T[], checkOrder: boolean = true): boolean {
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
