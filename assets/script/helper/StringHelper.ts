import { i18nMgr } from '../i18n/i18nMgr';

/**
 * 处理成字符串类
 */

export class StringHelper {
    //返回缩小100倍整数字符串
    static getStringDiv100(num: number): string {
        return `${(num / 100) ^ 0}`;
    }

    static GetLongString(num: number | string, ratio = 100, fixed = 2): string {
        num = +num;
        let n: number = num / ratio;
        if (!Number.isInteger(n)) {
            return n.toFixed(fixed);
        }
        // let str: string = `${n}`;
        // if (~str.indexOf(".") && str.split(".")[1].length > 2) {
        //     return n.toFixed(2);
        // }
        return n.toString();
    }

    static GetLongStringLocale(num: number, ratio = 100, fixed = 2): string {
        if (num % 100 != 0) {
            const n: number = num / ratio;
            return n.toLocaleString('en-US', {
                minimumFractionDigits: fixed,
                maximumFractionDigits: fixed
            });
        }
        return (num / 100).toLocaleString('en-US');
    }

    public static GetLongStringUnit(num: number): string {
        if (num == 0) {
            return '0';
        }
        if (num < 100000) {
            return `${num / 100}`;
        } else if (num < 100000000) {
            let thousand = (num / 100000) ^ 0;
            let others = ((num % 100000) / 10000) ^ 0;
            if (others != 0) {
                return `${thousand}.${others}K`;
            } else {
                return `${thousand}K`;
            }
        } else {
            let million = (num / 100000000) ^ 0;
            let othersm = ((num % 100000000) / 10000000) ^ 0;
            if (othersm != 0) {
                return `${million}.${othersm}M`;
            } else {
                return `${million}M`;
            }
        }
    }

    static GetSignedLongString(num: number): string {
        if (num == 0) {
            return '0';
        }
        if (num > 0) {
            return `+${num / 100}`;
        } else {
            return `${num / 100}`;
        }
    }
    /**
     * 替换{0}
     */
    // static Format(str: string, replace: string = ""): string {
    //     return str.replace("{0}", replace);
    // }
    static FormatString(str: string, ...replaces: (string | number)[]): string {
        for (let i = 0; i < replaces.length; i++) {
            str = str.replace(`{${i}}`, `${replaces[i]}`);
        }
        return str;
    }

    static Format(str: string, replaces: (string | number)[]): string {
        for (let i = 0; i < replaces.length; i++) {
            str = str.replace(`{${i}}`, `${replaces[i]}`);
        }
        return str;
    }

    static Replace(str: string, replaces: string): string {
        return str.replace('{id}', replaces);
    }
    /// <summary>
    /// 获取房间类型名称
    /// </summary>
    /// <param name="game_type"></param>
    /// <param name="poker_type"></param>
    /// <param name="bet_type"></param>
    /// <returns></returns>
    public static GetRoomTypeNameByType(game_type: number, poker_type: number, bet_type: number): string {
        let name = '';
        let gameTypeStr = i18nMgr.Get('GameType_' + game_type);
        let pokerTypeStr = i18nMgr.Get('PokerType_' + poker_type);
        let betTypeStr = i18nMgr.Get('BetType_' + bet_type);
        name = gameTypeStr + '-' + pokerTypeStr + '-' + betTypeStr;
        return name;
    }
    /**
     * 格式化数字字符串 支持正负数
     * 转换成 1,000,000 格式
     * @param format
     * @param num
     * @returns
     */
    /**
     * 金钱表达式 1,000,000 格式 正负数
     * fix 保留几位小数
     */
    // public static MoneyExpress(value: number | string, fix: number = 0) {
    //     if (isNaN(+value)) return value.toString();
    //     let str = value.toString();
    //     let arr = str.split("-");
    //     let op = arr.length > 1 ? "-" : "";
    //     let nop_str = arr[arr.length - 1];
    //     let dot_index = nop_str.indexOf(".");
    //     let base_str = nop_str.substring(0, dot_index);
    //     let fix_str = nop_str.substring(dot_index);
    //     let len = base_str.length;
    //     if (len > 3) {
    //         let start = len - 3;
    //         while (start > 0) {
    //             arr.unshift(str.substring(start, end));
    //             end = start;
    //             start = end - 3;
    //         }
    //     }
    // let len = _str.length;
    // let end = len;
    // let start = end - 3;
    // let arr: string[] = [];
    // while (start > 0) {
    //     arr.unshift(str.substring(start, end));
    //     end = start;
    //     start = end - 3;
    // }
    // arr.unshift(str.substring(start, end));
    // let base = arr.join(",").toString();
    public static FormatToString(format: string = null, num: number | string = 0) {
        let _num = +num;
        let _num_str = '';
        //符号部分
        let op = '';
        if (_num < 0) {
            op = '-';
            _num = -_num;
        }
        switch (format) {
            case '{0:N0}':
                _num_str = _num.toFixed(0);
                break;
            case '{0:N1}':
                _num_str = _num.toFixed(1);
                break;
            case '{0:N2}':
                _num_str = _num.toFixed(2);
                break;
            default:
                return num.toString();
        }
        //小数部分
        let d_num = '';
        let dot_index = _num_str.indexOf('.');
        if (~dot_index) {
            d_num = _num_str.substring(dot_index);
        }
        let str = (+_num_str ^ 0).toString();
        let len = str.length;
        let end = len;
        let start = end - 3;
        let arr: string[] = [];
        while (start > 0) {
            arr.unshift(str.substring(start, end));
            end = start;
            start = end - 3;
        }
        arr.unshift(str.substring(start, end));
        let base = arr.join(',').toString();
        return op + base + d_num;
    }

    /**
     * 判断整数不变，小数保留1位
     */
    public static FormatIntOrFloat1(num: string | number): string {
        let numStr = num.toString();
        if (~numStr.indexOf('.')) {
            return this.FormatToString('{0:N1}', numStr);
        }
        return numStr;
    }

    /**
     * 除法
     * 结果 整数不变,小数保留N位
     */
    public static DivFloat(num: number, div: number = 100, float_bit: number = 1) {
        let num_str = div ? this.GetLongString(num) : num.toString();
        let dot_index = num_str.indexOf('.');
        if (~dot_index) {
            return num_str.substring(0, dot_index + float_bit + 1);
        }
        return num_str;
    }

    /**
     * 名字长度超出加...
     */
    public static LengthNick(nick: string, limit: number = 10) {
        let len = 0;
        let result = nick;
        if (nick?.length) {
            for (let i = 0; i < nick.length; i++) {
                let char_code = nick.charCodeAt(i);
                //半角
                if (char_code >= 0 && char_code <= 0xff) {
                    len++;
                }
                //中文
                if (char_code >= 0x4e00 && char_code <= 0x9fa5) {
                    len += 2;
                }
                //全角
                if (char_code >= 0xff00 && char_code <= 0xffff) {
                    len += 2;
                }
                if (len > limit) {
                    result = nick.substring(0, i) + '...';
                    break;
                }
            }
        }
        return result;
    }
    /// <summary>
    /// 是否包含特殊字符
    /// </summary>
    public static IsContainSpecialCharacter(text: string) {
        let reg: RegExp = new RegExp('^[a-zA-Z0-9\u4e00-\u9fa5]+$');
        return !text.match(reg);
    }

    /**
     * 获取长文本...
     * limitHeight 限制高度
     */
    public static SetLargeText(label: cc.Label | cc.RichText, limitHeight: number): boolean {
        if (label.node.height > limitHeight) {
            let height = label.node.height;
            while (height > limitHeight) {
                label.string = label.string.substring(0, label.string.length - 1);
                height = label.node.height;
            }
            label.string = label.string.substring(0, label.string.length - 3) + '...';
            return true;
        }
        return false;
    }

    /**
     * 获取颜色富文本
     */
    public static GetColorText(text: string, color: string): string {
        return `<color=${color}>${text}</color>`;
    }

    //有小数取N位小数,不进行四舍五入
    public static GetDecimalN(num: number, n: number = 1) {
        let s = `${num}`;
        let arr = s.split('.');
        if (arr.length == 1 || n < 1) return arr[0];
        let a = arr[0];
        let b = arr[1].substring(0, n);
        return `${+`${a}.${b}`}`;
    }

    /**
     * 核心算法：将任意数字格式化为“最多保留一位小数”的严格去尾文本
     * 示例：2.59 -> "2.5";  2.00 -> "2";  0.55 -> "0.5"
     */
    private static formatToOneDecimalFloor(num: number): string {
        // 核心黑魔法：利用乘以10去尾再除以10，实现严格的“保留一位小数且去尾”
        let floored = Math.floor(num * 10) / 10;
        
        // 如果去尾后是个整数（比如 2.0），转换为字符串时去掉后面的 .0，直接显示 "2"
        // 如果是小数（比如 2.5），则正常输出 "2.5"
        return floored % 1 === 0 ? floored.toString() : floored.toFixed(1);
    }

    /**
     * 核心大数精简算法：纯数字缩写（严格执行一位小数去尾）
     */
    public static GetDecimalNWithKM(num: number): string {
        if (num >= 1000000) {
            let m = num / 1000000;
            return this.formatToOneDecimalFloor(m) + "M";
        } else if (num >= 1000) {
            let k = num / 1000;
            return this.formatToOneDecimalFloor(k) + "K";
        }
        
        // 达不到 K/M 级别的小数，同样用我们自己的去尾算法输出
        return this.formatToOneDecimalFloor(num);
    }
}

(window as any).StringHelper = StringHelper;
