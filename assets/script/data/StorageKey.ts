/*
 * @Author: xfj
 * @Date: 2022-08-22 00:32:52
 * @description:
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-12-05 16:28:28
 * @FilePath: /pokerqueen/assets/script/session/StorageKey.ts
 */

export default class StorageKey {
    // 是否保存SQUID介绍窗口
    static readonly SHOW_SQULD_INTRO_DIALOG = 'SHOW_SQULD_INTRO_DIALOG';
    // 是否保存MUSHROOM介绍窗口
    static readonly SHOW_MUSHROOM_INTRO_DIALOG = 'SHOW_MUSHROOM_INTRO_DIALOG';
    // 是否保存CRITICALHIT介绍窗口
    static readonly SHOW_CRITICALHIT_INTRO_DIALOG = 'SHOW_CRITICALHIT_INTRO_DIALOG';
    // //清理所有记录的标记
    // static CLEAN_ALL_FLAG: string = 'CLEAN_ALL_FLAG';
    // //登录数据
    // static LOGIN_DATA: string = 'LOGIN_DATA';
    // //token字符串
    // static TOKEN: string = 'TOKEN';
    // //token有效期
    // static TOKEN_EXPIREAT = 'TOKEN_EXPIREAT';
    // //电话区号
    // static AERA_CODE = 'AERA_CODE';
    // //手机号
    // static PHONE = 'PHONE';
    // /////////////////////////////////////////
    //语言
    static LANGUAGE = 'Language';
    // static KEY_USERID = 'KEY_USERID';
    // static KEY_PHONE = 'KEY_PHONE';
    // static KEY_PHONE_FIRST = 'KEY_PHONE_FIRST';
    // //验证码时间 忘记密码
    // static CODE_TIME_RESET_PHONE = 'CODE_TIME_RESET_PHONE';
    // static CODE_TIME_RESET_MAIL = 'CODE_TIME_RESET_MAIL';
    // //验证码时间 注册
    // static CODE_TIME_REGIST_PHONE = 'CODE_TIME_REGIST_PHONE';
    // static CODE_TIME_REGIST_MAIL = 'CODE_TIME_REGIST_MAIL';
    // ////验证码时间 快速登录
    // static CODE_TIME_QUIKLY_LOGIN_PHONE = 'CODE_TIME_QUIKLY_LOGIN_PHONE';
    // ////验证码时间 邮箱登录
    // static CODE_TIME_EMAIL = 'CODE_TIME_EMAIL';
    // ////验证码时间 跟换绑定
    // static CODE_TIME_CHANGE_BLIND = 'CODE_TIME_CHANGE_BLIND';
    // 热更新配置缓存
    static HOT_UPDATE_GLOBAL_CONFIG_CACHE = 'HOT_UPDATE_GLOBAL_CONFIG_CACHE';
    static HOT_UPDATE_ROOM_TEMPLATE_CACHE = 'HOT_UPDATE_ROOM_TEMPLATE_CACHE';
    // H5 侧 IndexedDB 表名
    static readonly STORE_TABLE_USER_BASE_INFO = 'table_user_base_info';
    static readonly STORE_TABLE_USER_DATA_INFO = 'table_user_data_info';
    static readonly STORE_GAME_REPLAYS = 'game_replays';

    static getReplayRoomKey(userId: number, roomId: number, handNum: number): string {
        return `${userId}_${roomId}_${handNum}`;
    }

    static getReplayMatchKey(userId: number, matchId: number, handNum: number): string {
        return `${userId}_m${matchId}_${handNum}`;
    }
    // static OpenBarrage: string = 'OpenBarrage'; //是否打开弹幕 1 关闭，0 打开
    // //=======================设置相关========================
    static SHOW_BB = 'SHOW_BB';
    static TEXAS_DESKTYPE = 'TEXAS_DESKTYPE';
    static TEXAS_POKERCARDTYPE = 'TEXAS_POKERCARDTYPE';
    static TEXAS_SHORTCUTS_MODE = 'TEXAS_SHORTCUTS_MODE';
    static TEXAS_SHORTCUTS_3 = 'TEXAS_SHORTCUTS_3';
    static TEXAS_SHORTCUTS_5 = 'TEXAS_SHORTCUTS_5';
    // static togglesCardType = 'togglesCardType'; // 牌面
    static SOUND_IS_OPEN = 'SOUND_IS_OPEN'; // 声音
}

(window as any).StorageKey = StorageKey;
