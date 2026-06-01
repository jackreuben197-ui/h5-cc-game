/*
 * @Author: xfj
 * @Date: 2022-09-05 15:28:55
 * @description:
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2023-04-07 12:04:50
 * @FilePath: /pokerqueen/assets/script/helper/TimeHelper.ts
 */
import { maxHeaderSize } from 'http';
import { i18nMgr } from '../i18n/i18nMgr';
import { match } from 'assert';
import { measureMemory } from 'vm';

const { ccclass, property } = cc._decorator;

@ccclass
export default class TimeHelper {
    //当前毫秒
    public static get Now() {
        return new Date().getTime();
    }
    //获取当天毫秒
    public static get toDayBaganTime() {
        return new Date(new Date().toLocaleDateString()).getTime();
    }
    //当天截止毫秒
    public static get toDayEndTime() {
        return new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1;
    }
    //当前秒
    public static get NowS() {
        return (new Date().getTime() / 1000) ^ 0;
    }

    public static convertUTCTimeToLocalTime(UTCDateString: string, separated = '-', isNeedYear = true, isNeedMin = true) {
        let date2 = new Date(UTCDateString); //这步是关键
        let year = date2.getFullYear();
        let formatFunc = (str: number): string => {
            //格式化显示
            return str > 9 ? '' + str : '0' + str;
        };
        let mon = formatFunc(date2.getMonth() + 1);
        let day = formatFunc(date2.getDate());
        let hourNum = date2.getHours();
        // let noon = hour >= 12 ? 'PM' : 'AM';
        // hour = hour >= 12 ? hour - 12 : hour;
        let hour = formatFunc(hourNum);
        let min = formatFunc(date2.getMinutes());
        let dateStr = mon + separated + day;
        if (isNeedYear) {
            dateStr = year + separated + mon + separated + day;
        }
        if (isNeedMin) {
            dateStr = dateStr + ' ' + hour + ':' + min;
        }
        return dateStr;
    }

    public static RFC3339TimeConvertToUTCTime(rfc3339Time: string) {
        let t = Date.parse(rfc3339Time); //   DateTime.Parse(rfc3339Time).ToUniversalTime();
        return t;
    }

    public static ShowRemainingSemicolon(pNum: number) {
        //1小时3600秒      1天86400秒
        if (pNum >= 3600) //>1小时
        {
            let tHour = Math.floor(pNum / 3600);
            let tMinutes = Math.floor((pNum % 3600) / 60);
            let tseconds = Math.floor((pNum % 3600) % 60);
            return tHour.toString().padStart(2, '0') + ':' + tMinutes.toString().padStart(2, '0') + ':' + tseconds.toString().padStart(2, '0');
        } else if (pNum >= 60) //>1分钟
        {
            let tMinutes = Math.floor(pNum / 60);
            let tseconds = Math.floor(pNum % 60);
            return '00:' + tMinutes.toString().padStart(2, '0') + ':' + tseconds.toString().padStart(2, '0');
        } else if (pNum < 60) {
            return '00:00:' + pNum.toString();
        }
        return '';
    }

    public static ShowRemainingSemicolon2(pNum: number) {
        //1小时3600秒      1天86400秒
        if (pNum >= 3600) //>1小时
        {
            let tHour = Math.floor(pNum / 3600);
            let tMinutes = Math.floor((pNum % 3600) / 60);
            let tseconds = Math.floor((pNum % 3600) % 60);
            return tHour.toString().padStart(2, '0') + '小时' + tMinutes.toString().padStart(2, '0') + '分钟' + tseconds.toString().padStart(2, '0') + '秒';
        } else if (pNum >= 60) //>1分钟
        {
            let tMinutes = Math.floor(pNum / 60);
            let tseconds = Math.floor(pNum % 60);
            return tMinutes.toString().padStart(2, '0') + '分钟' + tseconds.toString().padStart(2, '0') + '秒';
        } else if (pNum < 60) {
            return Math.ceil(pNum).toString() + '秒';
        }
        return '';
    }

    public static ShowRemainingSemicolon3(pNum: number) {
        //1小时3600秒      1天86400秒
        let tseconds_str = '';
        let tMinutes_str = '';
        if (pNum >= 3600) //>1小时
        {
            let tHour = Math.floor(pNum / 3600);
            let tMinutes = Math.floor((pNum % 3600) / 60);
            let tseconds = Math.floor((pNum % 3600) % 60);
            if (tseconds != 0) {
                tseconds_str = tseconds.toString().padStart(2, '0') + (i18nMgr.isCN ? '秒' : 's');
            }
            if (tMinutes != 0) {
                tMinutes_str = tMinutes.toString().padStart(2, '0') + (i18nMgr.isCN ? '分钟' : 'm');
            }
            return tHour.toString() + (i18nMgr.isCN ? '小时' : 'h') + tseconds_str + tMinutes_str;
        } else if (pNum >= 60) //>1分钟
        {
            let tMinutes = Math.floor(pNum / 60);
            let tseconds = Math.floor(pNum % 60);
            if (tseconds != 0) {
                tseconds_str = tseconds.toString().padStart(2, '0') + (i18nMgr.isCN ? '秒' : 's');
            }
            return tMinutes.toString() + (i18nMgr.isCN ? '分钟' : 'm') + tseconds_str;
        } else if (pNum < 60) {
            return Math.ceil(pNum).toString() + (i18nMgr.isCN ? '秒' : 's');
        }
        return '';
    }

    /**
     * 定义延时函数
     * delaytime 延时时长，单位毫秒
     */
    public static Sleep(delaytime = 1000) {
        return new Promise(resolve => setTimeout(resolve, delaytime));
    }

    /**
     * 获取格式化时间  MM/dd HH:mm
     */
    public static TimeToString(time: number, format: string) {
        let date = new Date(time);
        let MM = this.ZeroNum(date.getMonth() + 1);
        let dd = this.ZeroNum(date.getDate());
        let HH = this.ZeroNum(date.getHours());
        let mm = this.ZeroNum(date.getMinutes());
        let result = format;
        result = result.replace('MM', MM);
        result = result.replace('dd', dd);
        result = result.replace('HH', HH);
        result = result.replace('mm', mm);
        return result;
    }

    public static ZeroNum(num: number): string {
        return `${num < 10 ? 0 : ''}${num}`;
    }

    static getYMD(t: number, flag: string = null, isMil: boolean = false) {
        let data = this.getDateStructYMD(t, isMil);
        if (flag) {
            return `${data.year}${flag}${data.month}${flag}${data.day}`;
        }
        if (i18nMgr.isCN) {
            return `${data.year}年${data.month}月${data.day}日`;
        } else {
            return `${this.getMonthENName(Number(data.month))} ${data.day}, ${data.year}`;
        }
    }

    static getMD(t: number, flag: string = null, isMil: boolean = false) {
        let data = this.getDateStructYMD(t, isMil);
        if (flag) {
            return `${data.month}${flag}${data.day}`;
        }
        if (i18nMgr.isCN) {
            return `${data.month}月${data.day}日`;
        } else {
            return `${this.getMonthENName(Number(data.month))} ${data.day}`;
        }
    }

    static getMDHMS(t: number, flag: string = '/') {
        // let data = this.getDateStructYMD(t, isMil);
        // let hms = this.getDateStructHMS(t, isMil)
        let year = new Date(t).getFullYear();
        let month = new Date(t).getMonth() + 1;
        let day = new Date(t).getDate();
        return `${year}${flag}${month}${flag}${day}`;
    }

    /**
     *
     * @param t :
     * @param flag
     * @param isMil
     * @returns
     */
    static getHM(t: number, flag: string = null, isMil: boolean = false) {
        let data = this.getDateStructHMS(t, isMil);
        if (flag) {
            return `${data.hour}${flag}${data.min}`;
        }
        if (i18nMgr.isCN) {
            return `${data.hour}时${data.min}分`;
        } else {
            return `${data.hour}:${data.min}`;
        }
    }

    static getHMS(t: number, flag: string = null, isMil: boolean = false) {
        let data = this.getDateStructHMS(t, isMil);
        if (flag) {
            return `${data.hour}${flag}${data.min}${flag}${data.sec}`;
        }
        if (i18nMgr.isCN) {
            return `${data.hour}时${data.min}分${data.sec}秒`;
        } else {
            return `${data.hour}:${data.min}:${data.sec}`;
        }
    }

    static getTimeBefore(t: number, isMil: boolean = false) {
        let subTime = this.NowS - t / (isMil ? 1000 : 1);
        if (subTime < 60) {
            return i18nMgr.isCN ? `${subTime}秒前` : `${subTime}s ago`;
        }
        if (subTime < 60 * 60) {
            return i18nMgr.isCN ? `${Math.floor(subTime / 60)}分钟前` : `${subTime}min ago`;
        }
        if (subTime < 60 * 60 * 24) {
            return i18nMgr.isCN ? `${Math.floor(subTime / 60 / 60)}小时前` : `${subTime}h ago`;
        }
        if (subTime < 60 * 60 * 24 * 365) {
            return i18nMgr.isCN ? `${Math.floor(subTime / 60 / 60 / 24)}天前` : `${subTime}day ago`;
        }
        return i18nMgr.isCN ? `${Math.floor(subTime / 60 / 60 / 24 / 365)}年前` : `${subTime}year ago`;
    }

    static getSubTimeHMS(subTime: number, flag: string = null, isMil: boolean = false) {
        let data = this.getSubDateStructHMS(subTime, isMil);
        if (flag) {
            return `${data.hour}${flag}${data.min}${flag}${data.sec}`;
        }
        if (i18nMgr.isCN) {
            return data.hour + '小时' + data.min + '分钟' + data.sec + '秒';
        } else {
            return `${data.hour}h${data.min}m${data.sec}s`;
        }
    }

    static getSubTimeMS(subTime: number, flag: string = null, isMil: boolean = false) {
        let data = this.getSubDateStructHMS(subTime, isMil);
        if (flag) {
            return `${data.min}${flag}${data.sec}`;
        }
        if (i18nMgr.isCN) {
            return data.min + '分钟' + data.sec + '秒';
        } else {
            return `${data.min}m${data.sec}s`;
        }
    }

    static getSubTimeHM(subTime: number, flag: string = null, isMil: boolean = false) {
        let data = this.getSubDateStructHMS(subTime, isMil);
        if (flag) {
            return `${data.hour}${flag}${data.min}${flag}${data.sec}`;
        }
        if (i18nMgr.isCN) {
            return data.hour + '小时' + data.min + '分钟 ';
        } else {
            return `${data.hour}h${data.min}m`;
        }
    }

    static getSubD(subTime: number, flag: string = null, isMil: boolean = false, isUp: boolean = true) {
        let day = subTime / (24 * 3600 * (isMil ? 1000 : 1));
        day = isUp ? Math.ceil(day) : Math.floor(day);
        if (flag) {
            return `${day}${flag}`;
        }
        if (i18nMgr.isCN) {
            return day + '天';
        } else {
            return `${day}day${day > 1 ? 's' : ''}`;
        }
    }

    static getSubH(subTime: number, flag: string = null, isMil: boolean = false, isUp: boolean = true) {
        let hour = subTime / (3600 * (isMil ? 1000 : 1));
        hour = isUp ? Math.ceil(hour) : Math.floor(hour);
        if (flag) {
            return `${hour}${flag}`;
        }
        if (i18nMgr.isCN) {
            return hour + '小时';
        } else {
            return `${hour}day${hour > 1 ? 's' : ''}`;
        }
    }

    static getSubM(subTime: number, flag: string = null, isMil: boolean = false, isUp: boolean = true) {
        let m = subTime / (60 * (isMil ? 1000 : 1));
        m = isUp ? Math.ceil(m) : Math.floor(m);
        if (flag) {
            return `${m}${flag}`;
        }
        if (i18nMgr.isCN) {
            return m + '分钟';
        } else {
            return `${m}day${m > 1 ? 's' : ''}`;
        }
    }

    static getDays(time: number, isMil: boolean = false) {
        // 0是从8点开始，所以加8；  0点算第二天的开始，所以加一
        time = time / (isMil ? 1000 : 1) + 8 * 60 * 60 + 1;
        return Math.ceil(time / 86400);
    }

    static isToday(time: number, isMil: boolean = false) {
        return this.isSameDay(this.NowS, time, isMil);
    }

    static isYesterday(time: number, isMil: boolean = false) {
        return this.isSameDay(this.NowS - 24 * 60 * 60, time, isMil);
    }

    static isSameDay(milTime1: number, milTime2: number, isMil: boolean = false) {
        let day1 = new Date(milTime1 * (isMil ? 1 : 1000));
        let day2 = new Date(milTime2 * (isMil ? 1 : 1000));
        return day1.getFullYear() == day2.getFullYear() && day1.getMonth() == day2.getMonth() && day1.getDate() == day2.getDate();
    }

    static getDateStructYMD(t: number, isMil: boolean = false) {
        let data = new Date(t * (isMil ? 1 : 1000));
        let year = this.toTimeFormat(data.getFullYear());
        let month = this.toTimeFormat(data.getMonth() + 1);
        let day = this.toTimeFormat(data.getDate());
        return { year, month, day };
    }

    private static getDateStructHMS(t: number, isMil: boolean = false) {
        let data = new Date(t * (isMil ? 1 : 1000));
        let hour = this.toTimeFormat(data.getHours());
        let min = this.toTimeFormat(data.getMinutes());
        let sec = this.toTimeFormat(data.getSeconds());
        return { hour, min, sec };
    }

    private static getSubDateStructHMS(subTime: number, isMil: boolean = false) {
        let subSecond = isMil ? subTime / 1000 : subTime;
        //计算出小时数
        let subDaySecond = subSecond % (24 * 3600); //计算天数后剩余的秒数
        //计算相差分钟数
        let subHourSecond = subSecond % 3600; //计算小时数后剩余的秒数
        //计算相差秒数
        let subMinSecond = subSecond % 60; //计算分钟数后剩余的秒数
        let hour = this.toTimeFormat(Math.floor(subDaySecond / 3600));
        let min = this.toTimeFormat(Math.floor(subHourSecond / 60));
        let sec = this.toTimeFormat(Math.ceil(subMinSecond));
        return { hour, min, sec };
    }

    public static toTimeFormat(unit: number) {
        return unit >= 0 ? `${unit < 10 ? '0' : ''}${unit}` : '00';
    }

    private static getMonthENName(m: number) {
        return ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November,', 'December'][m - 1];
    }

    //格式:余下----5:22:10  小时:分钟:秒</summary>
    public static ShowRemainingSemicolonPure(pNum: number): string {
        //1小时3600秒      1天86400秒
        let tHour, tMinutes, tseconds;
        if (pNum >= 3600) //>1小时
        {
            tHour = (pNum / 3600) ^ 0;
            tMinutes = ((pNum % 3600) / 60) ^ 0;
            tseconds = (pNum % 3600) % 60;
            return `${this.PadZero(tHour)}:${this.PadZero(tMinutes)}:${this.PadZero(tseconds)}`;
        } else if (pNum >= 60) //>1分钟
        {
            tMinutes = (pNum / 60) ^ 0;
            tseconds = pNum % 60;
            return `${this.PadZero(tMinutes)}:${this.PadZero(tseconds)}`;
        } else if (pNum < 60) {
            return `00:${this.PadZero(pNum)}`;
        }
        return '';
    }

    //小于10,前补0
    public static PadZero(num: number) {
        return num < 10 ? `0${num}` : `${num}`;
    }

    // 时间转换 2022-12-27T10:03:02Z 转换为本地时间
    public static UTCToLocal(time: string) {
        time = new Date(time).toString();
        time = time.replace('+0000 ', '');
        time = time.replace(/-/g, '/'); //苹果需要这样处理
        return TimeHelper.convertUTCTimeToLocalTime(time);
    }
    //转换时间为本地时间
    // style
    // 0:'01/01/2022 19:00'
    // 1:'19:00'
    //
    public static TransformUTC(time: string, style: number = 0) {
        let date = new Date(time);
        let yy = date.getFullYear();
        let mm = this.PadZero(date.getMonth() + 1);
        let dd = this.PadZero(date.getDate());
        let h = this.PadZero(date.getHours());
        let m = this.PadZero(date.getMinutes());
        let s = this.PadZero(date.getSeconds());
        switch (style) {
            case 0:
                return `${dd}/${mm}/${yy} ${h}:${m}`;
            case 1:
                return `${h}:${m}`;
        }
    }

    private static MonthLanMap: Record<number, string> = {
        1: 'StrJanuary',
        2: 'StrFebruary',
        3: 'StrMarch',
        4: 'StrApril',
        5: 'StrMay',
        6: 'StrJune',
        7: 'StrJuly',
        8: 'StrAugust',
        9: 'StrSeptember',
        10: 'StrOctober',
        11: 'StrNovember',
        12: 'StrDecember'
    };
    private static DayLanMap: Record<number, string> = {
        1: 'WeekMon',
        2: 'WeekTues',
        3: 'WeekWed',
        4: 'WeekThur',
        5: 'WeekFri',
        6: 'WeekSat',
        7: 'WeekSun'
    };

    //获取月份的多语言
    public static MonthLanguage(month: number) {
        return i18nMgr.Get(this.MonthLanMap[month]);
    }

    //获取星期几的多语言
    public static DayLanguage(day: number) {
        return i18nMgr.Get(this.DayLanMap[day]);
    }

    //获取分钟:秒
    public static MinSec(second: number) {
        let min = this.PadZero((second / 60) ^ 0);
        let sec = this.PadZero(second % 60);
        return `${min}:${sec}`;
    }
}

(window as any).TimeHelper = TimeHelper;
