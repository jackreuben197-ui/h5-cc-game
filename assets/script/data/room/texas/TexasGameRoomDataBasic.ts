import { Def, InsuranceOddsForPotsUserCount, RoomJackpotConfig, SquidCountRateConfig, SubRoomConfig } from '@silenthill/agreement-web';
import { bindData, IObservableBindings, observable, pureEvent } from '../../../core/decorator/DataBind';
import { AnimateDisplayTypePlayType } from '../../../game/constant/AnimateDisplayType';
import { ChatType } from '../../../game/constant/ChatType';
import { MushroomMode } from '../../../game/constant/Mushroom';
import { SquidLeaveMode, SquidMode } from '../../../game/constant/Squid';
import { ViewPlayerCardsMode } from '../../../game/constant/ViewPlayerCardsMode';
import GameplayUtil from '../../../game/util/GameplayUtil';
import { StringHelper } from '../../../helper/StringHelper';
import { UISquidEndItemShowData } from '../../../views/dialog/squidover/UISquidEndItem';
import texasGamePersonalSettings from './TexasGamePersonalSettings';
import TexasGameRoomData from './TexasGameRoomData';

export interface tableBetInfo {
    sb: number;
    ante: number;
}

type DataBaiscBindings = {
    criticalHitStatusEnabled: [AnimateDisplayTypePlayType];
    squidStatusEnabled: [AnimateDisplayTypePlayType];
    mushroomStatusEnabled: [AnimateDisplayTypePlayType];
    bombpotStatusEnabled: [AnimateDisplayTypePlayType];
};

interface TexasGameRoomDataBasic extends IObservableBindings<TexasGameRoomDataBasic, DataBaiscBindings> {}

@bindData()
class TexasGameRoomDataBasic extends cc.EventTarget {
    public static readonly TABLE_BET_INFO_CHANGE = 'TABLE_BET_INFO_CHANGE';
    public static readonly TABLE_HANDINFO_CHANGE = 'TABLE_HANDINFO_CHANGE';
    public static readonly BOMBPOT_ENABLED = 'BOMBPOT_ENABLED';
    public static readonly CRITIAL_HIT_ENABLED = 'CRITIAL_HIT_ENABLED';
    public static readonly SQUID_ENABLED = 'SQUID_ENABLED';
    public static readonly SQUID_RESULTS = 'SQUID_RESULTS';
    public static readonly MUSHROOM_ENABLED = 'MUSHROOM_ENABLED';
    // 不变的信息
    // 基础信息
    public roomName: string;
    public roomUniqueID: string = '';
    public gameType: number;
    public pokerType: number;
    public betType: number;
    public opDuration: number;
    // 房间存续期（秒）；0 表示无限。战绩面板用它配合 summary.startTime 算剩余时间。
    public playDuration: number = 0;
    public isMtt: boolean;
    public get seatsCount() {
        return this._roomData.seatsStateManager.seatsCount;
    }
    private _sunRoomConfig: SubRoomConfig.AsObject[];
    public set subRoomConfig(s: SubRoomConfig.AsObject[]) {
        this._sunRoomConfig = s;
    }
    //延迟看牌
    public delaySeeCard: boolean;
    //手牌数量
    private _handCardNum: number;
    public get handCardNum() {
        return this._handCardNum;
    }
    // 带入类型 1 货币
    public get bringInType() {
        return this.goldType == 1 ? 1 : this.originType == 3 ? 3 : 2;
    }
    public _gameStatus: Def.GameStatusMap[keyof typeof Def.GameStatus];
    private _roomData: TexasGameRoomData;

    constructor(rd: TexasGameRoomData) {
        super();
        this._roomData = rd;
    }

    public get gameStatus() {
        return this._gameStatus;
    }
    public set gameStatus(r: Def.GameStatusMap[keyof typeof Def.GameStatus]) {
        this._gameStatus = r;
    }
    // 在游戏中
    public get isPlaying() {
        return this.gameStatus >= Def.GameStatus.HAND_STARTED && this.gameStatus < Def.GameStatus.HAND_END;
    }
    // 房间类型
    private _roomType: number;
    public get roomType() {
        return this._roomType;
    }
    public set roomType(r: number) {
        const { gameType, pokerType, betType, isMTT } = GameplayUtil.RoomTypeExtract(r);
        this.gameType = gameType;
        this.pokerType = pokerType;
        this.betType = betType;
        this.isMtt = isMTT;
        switch (this.gameType) {
            case 1:
                this._handCardNum = 4;
                break;
            case 2:
                this._handCardNum = 5;
                break;
            case 3:
                this._handCardNum = 6;
                break;
            default:
                this._handCardNum = 2;
                break;
        }
    }
    //加密卡牌
    public encryptCards: boolean;
    //强制两派
    public forceShowCard: boolean;
    // 限制
    public limitIP: boolean;
    public limitGPS: boolean;
    // 自动换桌
    public autoChangeTableLimitHand: number = 0;
    public get isAutoChangeTable() {
        return this.autoChangeTableLimitHand > 0;
    }
    // AOF 配置
    public retainType: number;
    public retainMinRate: number;
    public retainMaxRate: number;
    // 基础信息俱乐部联盟ID
    public clubID: number;
    public tribeID: number;
    // callTime 相关
    public hasCallTime: boolean; // 是否开启
    public callTimeWinline: number; // 盈利线
    public callTimeLimit: number; // 次数限制最小手数
    // 使用货币类型
    public goldType: number;
    public originType: number;
    //安全房间
    public seatedMessage: boolean; // 坐下才有消息(也就是安全房间)
    public onlyIOS: boolean;
    // 视频相关
    public antiCheatType: number; // 防作弊类型 0 未知 1 无 2 实时语音 3 实时视频 4 人脸验证
    public normalAntiCheatOrderType: number;
    public normalAntiCheatOrderMicType: number;
    public antiCheatTimeLimit: number;
    public videoEffectType: number;
    public videoPowerSaving: number;
    public videoVerifyType: number;
    public videoModel: number;
    // 限制带入（只能申请）
    public limitBringIn: boolean;
    //强制随机坐下
    public randomSeated: boolean;
    // 朋友卓信息
    public invitationCode: string;
    // 付费看牌模式
    public viewPlayerCards: ViewPlayerCardsMode;
    // 聊天模式
    public chatType: ChatType; // 聊天类型 0 无 1 上桌玩家 2 上桌玩家和观众
    // 二道牌限制
    public secondPcsOn: boolean; // 二套牌开关 1 开 0 关
    public secondPcsOpduration: number; // 二套牌等同意等待时间
    public secondPcsUserLimit: number; // 二套牌开启限制人数
    // 保险相关
    public insuranceMode: Def.IsuranceModeMap[keyof Def.IsuranceModeMap];
    public hasInsurance: boolean; // 保险开关 1 开 0 关
    public insuranceOpduration: number; // 保险操作时间(s)
    public insuranceOdds: InsuranceOddsForPotsUserCount.AsObject[];
    public insuranceForceBuyRatio: number; // 保险强制购买比例(0-1000) 0表示不强制购买
    //配置
    public minPlayerChipRate: number; // 最低保留倍率(BB的倍数)
    public maxBringinTotalRate: number; // 累计带入上限倍率(BB的倍数)
    public bringinEqualLeaderPercent: number; // 带入追平至chipleadeer百分比
    // jackpot
    public jackpot: boolean;
    public jackpotID: number; // Jackpot模版ID
    public jackpotPool: number; // Jackpot模版奖池余额
    public jackpotConfig: RoomJackpotConfig.AsObject | null; // Jackpot模版配置
    public jackpotMainPool: number; // 主模板剩余
    // 下注信息会变
    @observable(TexasGameRoomDataBasic.TABLE_BET_INFO_CHANGE)
    public sbante: tableBetInfo;

    public showNumberWithShowBB(value: number): string {
        const base = this.sbante.sb * 2;
        const ratio = texasGamePersonalSettings.showBB ? base : 100;
        const ex: string = texasGamePersonalSettings.showBB ? 'BB' : '';
        return `${StringHelper.GetDecimalNWithKM(value / ratio)}${ex}`;
    }

    private _randomAnte: number[]; // anteMin, anteMax, randomStep
    public get randomAnte() {
        return this._randomAnte;
    }

    public setRandomAnte(s: string) {
        if (!s || s == '') {
            this._randomAnte = [];
            return;
        }
        this._randomAnte = JSON.parse(s);
        return;
    }

    //straddle
    public straddle: boolean;
    public straddleMax: number;
    // 最小最大带入限制
    public curMinRate: number;
    public curMaxRate: number;
    // 入池率限制
    public hcPoolRate: number;
    // 当前玩法已经持续多久,在鱿鱼或者特殊玩法时候和特殊玩法的值一致;
    public currentConfigContinueRounds: number = 0;
    @observable(TexasGameRoomDataBasic.TABLE_HANDINFO_CHANGE)
    public handNum: number;
    public deposit: number;
    // ================== 以下都是动态玩法 可以一直开启，也可能定数开启, 结合SubConfig 和 NextOptionChange(HandInfo决定)========================
    // ============ BombPot ===================
    private _hasBombPot: boolean;
    public get hasBombPot(): boolean {
        return this._hasBombPot;
    }
    private _bombPotRounds: number;
    public get bombPotRounds() {
        return this._bombPotRounds;
    } // 持续几个回合
    private _bombPotWaitRounds: number;
    public get bombPotWaitRounds() {
        return this._bombPotWaitRounds;
    }

    // 只检查当前房间配置和第一个SUBCONFIG
    public checkBombPot(roomConfigBombpot: number, rounds: number, subconfigs: SubRoomConfig.AsObject[]) {
        const hasBombpot = subconfigs.filter(v => v.bombpot > 0);
        // 优先子配置(问题在于历史原因) @TODO
        if (hasBombpot.length > 0) {
            this._hasBombPot = true;
            this._bombPotRounds = hasBombpot[0].rounds;
            this._bombPotWaitRounds = rounds;
        } else if (roomConfigBombpot > 0) {
            this._hasBombPot = true;
            this._bombPotRounds = rounds;
            if (subconfigs.length > 0) {
                this._bombPotWaitRounds = subconfigs[0].rounds;
            }
        }
    }

    @observable(TexasGameRoomDataBasic.BOMBPOT_ENABLED) // 以下都是动态变更
    public bombpotStatusEnabled: boolean; // 当前是否开启
    public get bombpottStatusRounds(): number {
        return this.currentConfigContinueRounds;
    } // 第几轮了
    // ============== 暴击部分 ================
    private _hasCriticalHit: boolean = false;
    public get hasCriticalHit() {
        return this._hasCriticalHit;
    }
    private _crticalHitAnte: number = 0;

    public getCriticalHitAnte(base: number = 1) {
        return this._crticalHitAnte / base;
    }

    private _critcalHitRounds: number = 0; // 要跑多少手
    public get criticalHitRounds() {
        return this._critcalHitRounds;
    }
    private _criticalHitWaitRounds: number = 0; // 等待开启要等带手数
    public get criticalHitWaitRounds() {
        return this._criticalHitWaitRounds;
    }

    // 只检查当前房间配置和第一个SUBCONFIG
    public checkCriticalHit(roomConfigCirticalHit: number, ante: number, rounds: number, subconfigs: SubRoomConfig.AsObject[]) {
        const hasCritcalConfigs = subconfigs.filter(v => v.criticalHit > 0);
        // 优先子配置(问题在于历史原因) @TODO
        if (hasCritcalConfigs.length > 0) {
            this._hasCriticalHit = true;
            this._crticalHitAnte = hasCritcalConfigs[0].ante;
            this._critcalHitRounds = hasCritcalConfigs[0].rounds;
            this._criticalHitWaitRounds = rounds;
        } else if (roomConfigCirticalHit > 0) {
            this._hasCriticalHit = true;
            this._crticalHitAnte = ante;
            this._critcalHitRounds = rounds;
            if (subconfigs.length > 0) {
                this._criticalHitWaitRounds = subconfigs[0].rounds;
            }
        }
    }

    @observable(TexasGameRoomDataBasic.CRITIAL_HIT_ENABLED) // 以下都是动态变更
    public criticalHitStatusEnabled: boolean; // 当前是否开启
    public get critialHitStatusRounds(): number {
        return this.currentConfigContinueRounds;
    } // 跑了多少手了，开启后
    // ============== 鱿鱼部分 ================
    // 鱿鱼玩法（固定配置)
    private _hasSquid: boolean = false;
    public get hasSquid() {
        return this._hasSquid;
    }
    private _squidBase: number;
    public get squidBase(): number {
        return this._squidBase;
    }
    public squidMax: number; // 玩家鱿鱼个数上限
    public squidMostGet: boolean; // 独揽鱿鱼 1 开 0 关
    public squidBetGet: boolean; // 无动作获胜无鱿鱼 1 开 0 关
    public squidHead: boolean; // 头鱿鱼
    public squidTail: boolean; // 尾鱿鱼 1 开 0 关
    public squidForceShowCard: boolean; // 获得鱿鱼强制亮牌 1 开 0 关
    public squidLeaveMode: SquidLeaveMode; // 鱿鱼轮离开模式 1 可以离开 2 不可以离开（一轮结束才可以离开，如果筹码不足没补充就走模式1）
    private _squidPlayerCountLimit: number = 0;
    public get squidPlayerCountLimit(): number {
        return this._squidPlayerCountLimit;
    } // 鱿鱼轮开启的人数限制
    public squidMode: SquidMode; // 鱿鱼模式：0经典，1血战
    public squidExtraCount: number; // 额外的鱿鱼个数（血战）
    public squidCountRateList: SquidCountRateConfig.AsObject[] = []; // // 血战鱿鱼，鱿鱼个数翻倍

    // 找到鱿鱼对应的倍率
    public getSquidCountRate(count: number) {
        if (this.squidCountRateList.length == 0) {
            return 0;
        }
        let rate = 0;
        this.squidCountRateList.forEach(cfg => {
            if (count >= cfg.count) {
                rate = cfg.rate;
            }
        });
        return Math.max(0, rate);
    }

    private _squidRounds: number = 0;
    public get squidRounds() {
        return this._squidRounds;
    } // 持续回合
    private _squidWaitRounds: number = 0; // 这一般是手数,等待开启要等带手数
    public get squidWaitRounds() {
        return this._squidRounds;
    }

    /**
     * 配置鱿鱼信息
     * @param squidBase 一个鱿鱼的价值
     * @param rounds 持续回合数
     * @param playerCount 开启的人数限制
     * @param subconfigs 子配置
     */
    public checkSquid(squidBase: number, rounds: number, playerCount: number, subconfigs: SubRoomConfig.AsObject[]) {
        const hasSquidConfig = subconfigs.filter(v => v.squidBase > 0);
        // 要么第一个配置就有, 要么子配置就有（默认都取第一个配置)
        // 特殊处理下（这里比较特殊)
        if (hasSquidConfig.length > 0) {
            this._hasSquid = true;
            this._squidBase = hasSquidConfig[0].squidBase;
            this._squidRounds = hasSquidConfig[0].rounds;
            this._squidWaitRounds = rounds;
            this._squidPlayerCountLimit = hasSquidConfig[0].playingPlayerCountLimit;
        } else if (squidBase > 0) {
            this._hasSquid = true;
            this._squidBase = squidBase;
            this._squidRounds = rounds;
            this._squidPlayerCountLimit = playerCount;
            if (subconfigs.length > 0) {
                this._squidWaitRounds = subconfigs[0].rounds; //假设是普通的配置
            }
        }
    }

    // 鱿鱼玩法以下都开启后计算的配置
    @observable(TexasGameRoomDataBasic.SQUID_ENABLED)
    public squidStatusEnabled: boolean = false;
    public get squidStatusRounds(): number {
        return this.currentConfigContinueRounds;
    } // 第几轮了

    @pureEvent(TexasGameRoomDataBasic.SQUID_RESULTS)
    public squiedResultsEmit(rows: UISquidEndItemShowData[]) {}

    // ============== 蘑菇玩法 ==================
    public get hasMushroom() {
        return this.mushroomBase > 0;
    }
    public mushroomMode: MushroomMode; // 0: 未开启蘑菇 1: 正常模式 2: 前注蘑菇模式
    public mushroomBase: number; // 蘑菇基数(1个蘑菇筹码)
    public mushroomStatic: number; // 蘑菇固定(如果是固定上桌限制的筹码要求)
    @observable(TexasGameRoomDataBasic.MUSHROOM_ENABLED)
    public mushroomStatusEnabled: boolean;
    public mushroomStatusPool: number;
    public get shouldShowBringInSecuritySetting(): boolean {
        if (this._roomData.matchID != 0) return false;
        switch (this.gameType) {
            case 0:
            case 1:
            case 2:
            case 3:
                return true;
            default:
                return false;
        }
    }

    public handClear() {
        this.gameStatus = Def.GameStatus.WAIT_HAND_START;
    }
}

export default TexasGameRoomDataBasic;
