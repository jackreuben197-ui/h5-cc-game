import { ClientMessageEnterRoom, Code, Def } from '@silenthill/agreement-web';
import { traceClass } from '../../core/decorator/LogTrace';
import roomDataManager from '../../data/room/RoomDataManager';
import TexasGameRoomData from '../../data/room/texas/TexasGameRoomData';
import { i18nMgr } from '../../i18n/i18nMgr';
import ProtocolAgency from '../../net/websocket/ProtocolAgency';
import viewManager from '../../views/UIViewManager';
import { AntiCheatType } from '../constant/AntiCheatType';
import { VideoAntiCheatConfig } from '../constant/VideoModel';
import AGameplayEntrance, { LoadIndicator } from './AGameplayEntrance';

/**
 * @description 德州玩法入口
 */
@traceClass()
export default class TexasGameplayEntrance extends AGameplayEntrance {
    /**
     * @param roomType 玩法类型
     * @param matchId 比赛id
     * @param roomId 房间id
     */
    constructor(roomType: number, matchId: number, roomId: number) {
        super(roomType, matchId, roomId);
    }

    /**
     * 是否可复用表现层
     * @param roomType 玩法类型
     */
    public override isCanReuseViewLayer(roomType: number): boolean {
        // TODO: 横屏切换
        return false;
    }

    /**
     * 通信层进入玩法
     * @param isEnterForeground 是否进入前台
     */
    protected override async messageLayerEnterAsync(isEnterForeground: boolean): Promise<boolean> {
        this.tracelog.debug(`messageLayerEnterAsync: ${this.tableId}, isEnterForeground=${isEnterForeground}`);
        // C#: int status = await RequestRoomInfoAsync();
        const roomStatus: number = await this.requestRoomInfoAsync();
        if (roomStatus != 0) {
            this.tracelog.warn(`messageLayerEnterAsync: requestRoomInfoAsync failed: ${roomStatus}`);
            return false;
        }
        // 检查是否可以进入
        const isCanEnter: boolean = await this.checkCanEnterAsync(isEnterForeground);
        this.tracelog.debug(`messageLayerEnterAsync - CanEnter: ${isCanEnter}`);
        if (!isCanEnter) {
            return false;
        }
        // 请求进入房间
        this._enterStatus = await this.requestEnterAsync(true);
        this.tracelog.debug(`messageLayerEnterAsync - EnterStatus: ${this._enterStatus}`);
        if (this._enterStatus != 0 && this._enterStatus != 1015) {
            if (!this._isHasToast) {
                this._isHasToast = true;
                // TODO: 显示错误提示
            }
            return false;
        }
        return true;
    }

    /**
     * 请求房间信息 - 发送协议并等待响应
     * C#: public virtual async ETTask<int> RequestRoomInfoAsync()
     * @returns 0-成功, 非0-失败
     */
    public async requestRoomInfoAsync(): Promise<number> {
        // // C#: _protoRoomInfo = new Protocol_Holdem_Rooms() { request = new ClientMessageRooms() { ... } }
        // // 每次调用创建新的 Promise, 等待服务端响应
        // this._roomInfoPromise = new Promise<RoomRecord.AsObject>((resolve, reject) => {
        //     this._roomInfoResolve = resolve;
        //     this._roomInfoReject = reject;
        // });
        // 发送请求房间信息协议
        // const sendObj = {
        //     Code: ProtocolCode.Protocol_Holdem_Rooms,
        //     RoomID: 0,
        //     MatchID: 0,
        //     Body: {
        //         roomIdList: [this._roomId],
        //     },
        // };
        const resp = await ProtocolAgency.SendAsync(Code.MSG_R_ROOMS, {
            roomIdList: [this._roomId],
            rpcId: 1
        });
        // 等待响应 (由 ProcedureEnterTexas.onMsgHoldemRooms 调用 _roomInfoResolve)
        try {
            if (resp.status != 0) {
                this.tracelog.warn(`requestRoomInfoAsync: ${resp.status}`);
                return -1;
            }
            if (resp.roomsList == null || resp.roomsList.length == 0) {
                this.tracelog.warn(`requestRoomInfoAsync: room not exist`);
                return -1;
            }
            this._roomInfo = resp.roomsList[0];
            // 检查房间是否已关闭/已结束 (status >= 3)
            if (this._roomInfo.status >= 3) {
                this.tracelog.warn(`room is closed, status=${this._roomInfo.status}`);
                viewManager.showToast(i18nMgr.Get('GameRoom_ForceCloseTips'));
                return -1;
            }
            return 0;
        } catch (error) {
            this.tracelog.warn(`requestRoomInfoAsync: wait room info failed, ${error}`);
            return -1;
        }
    }

    /**
     * 检查是否可以进入
     * @param isEnterForeground 是否进入前台
     */
    private async checkCanEnterAsync(isEnterForeground: boolean): Promise<boolean> {
        // 房间已关闭或已结束，不允许进入
        if (this._roomInfo && this._roomInfo.status >= 3) {
            this.tracelog.warn(`checkCanEnterAsync: room is closed, status=${this._roomInfo.status}`);
            return false;
        }
        // TODO: 检查是否可以进入房间（人脸验证、金币检查等）
        return true;
    }

    /**
     * 通信层离开玩法
     */
    public override messageLayerLeave(): void {
        // 视频房间：离开时清理 Agora 频道
        // TODO: 发送离开房间消息
    }

    /**
     * 加载整个玩法
     */
    protected override loadGameplay(): any {
        this.tracelog.debug(`loadGameplay: ${this.tableId}`);
        // TODO: 加载德州玩法
        return null;
    }

    /**
     * 卸载逻辑层
     */
    protected override unloadLogicLayer(): void {
        super.unloadLogicLayer();
    }

    /**
     * 卸载表现层
     * @param loadIndicator 卸载玩法表现层后执行何种加载行为
     */
    protected override unloadViewLayer(loadIndicator: LoadIndicator): void {
        this.tracelog.debug(`unloadViewLayer: ${this.tableId}, loadIndicator=${loadIndicator}`);
        // TODO: 卸载德州玩法表现层
        super.unloadViewLayer(loadIndicator);
    }

    /**
     * 加载玩法前缓存相关全局数据
     * @param isClear 是否清理缓存数据
     */
    protected override cacheGlobalDataBeforeLoad(isClear: boolean): void {
        super.cacheGlobalDataBeforeLoad(isClear);
        if (!this._roomInfo) return;
        this.tracelog.debug(`cacheGlobalDataBeforeLoad: ${this._roomInfo.rid}, isClear=${isClear}`);
        // 特殊处理与房间存续期相关的数据缓存逻辑
        // GameCache.Instance._roomDurationTime = isClear ? 0 : this._roomInfo.playDuration;
        // if (isClear) {
        //     GameCache.Instance._roomStartTime = 0;
        //     GameCache.Instance._roomEndTime = 0;
        // } else {
        //     // 房间的start time是个动态数据, 缓存的roomInfo中此数据可能已经失效
        //     // 不要因为就只想获得这个数据再请求一次roomInfo，太耗
        //     // 此时进入房间所必须的所有数据都已准备好, 直接使用enter room响应中的返回值才是实时的
        //     // TODO: 需要从enter room响应中获取 startTime (需要协议支持)
        //     // C#: var enterResponse = (_protoEnterResponse as Protocol_Holdem_EnterRoom).response;
        //     // C#: GameCache.Instance._roomStartTime = enterResponse.RoomInfo.StartTime;
        //     GameCache.Instance._roomStartTime = 0;
        //     if (GameCache.Instance._roomStartTime == 0) {
        //         // 房间还未开始
        //         GameCache.Instance._roomStartTime = Math.floor(Date.now() / 1000);
        //     }
        //     GameCache.Instance._roomEndTime = GameCache.Instance._roomStartTime + this._roomInfo.playDuration;
        // }
        // GameCache.Instance._roomRecord = this._roomInfo;
        // GameCache.Instance._serviceId = isClear ? '' : this._roomInfo.serviceId;
        // GameCache.Instance.roomName = isClear ? '' : this._roomInfo.name;
        // GameCache.Instance.game_type = isClear ? 0 : this._roomInfo.gameType;
        // GameCache.Instance.poker_type = isClear ? 0 : this._roomInfo.pokerType;
        // GameCache.Instance.bet_type = isClear ? 0 : this._roomInfo.limitBetType;
        // GameCache.Instance.gold_type = isClear ? 0 : this._roomInfo.goldType;
        // // 俱乐部id
        // GameCache.Instance._texasData._clubId = isClear ? 0 : this._roomInfo.clubId;
        // // 联盟id
        // GameCache.Instance._texasData._tribeId = isClear ? 0 : this._roomInfo.tribeId;
        // GameCache.Instance.seat_count = isClear ? 0 : this._roomInfo.seatCount;
        // GameCache.Instance._wheelTemplateId = isClear ? 0 : this._roomInfo.wheelTemplateId;
        // GameCache.Instance.straddle = isClear ? 0 : this._roomInfo.straddleOn;
        // GameCache.Instance._straddleMax = isClear ? 0 : this._roomInfo.straddleMax;
        // GameCache.Instance._secondPcsOn = isClear ? false : this._roomInfo.secondPcsOn == 1;
        // GameCache.Instance._texasData._isOpenInsurance = isClear ? false : this._roomInfo.insuranceOn != 0;
        // GameCache.Instance._texasData._insuranceMode = isClear ? 0 : this._roomInfo.insuranceMode;
        // GameCache.Instance._selectedOuts = isClear ? 0 : this._roomInfo.selectOuts;
        // GameCache.Instance._bringInLimitType = isClear ? 0 : this._roomInfo.bringinLimitType;
        // GameCache.Instance._muck = isClear ? 0 : this._roomInfo.muckOn;
        // GameCache.Instance._isShowLeftTime = isClear ? false : false;
        // GameCache.Instance._tableSkin = isClear ? '' : this._roomInfo.tableclothTag;
        // GameCache.Instance._shareTableType = isClear ? 0 : this._roomInfo.shareTable;
        // GameCache.Instance._originType = isClear ? 0 : this._roomInfo.originType;
        // GameCache.Instance._friendsTableCode = isClear ? '' : this._roomInfo.invitationCode;
        // GameCache.Instance._friendsTableLimitBringIn = isClear ? false : this._roomInfo.limitBringIn > 0;
        // GameCache.Instance._chatType = isClear ? 0 : this._roomInfo.chatType;
        // GameCache.Instance._autoRecharge = isClear ? 0 : this._roomInfo.autoOnTableSwitch;
        // GameCache.Instance._currentRoomID = isClear ? 0 : this._roomId;
        // GameCache.Instance._isRoomManager = isClear ? false : this._roomInfo.roomAdmin?.isAdmin;
        // GameCache.Instance._isHasDisbandRoomPrivileges = isClear ? false : this._roomInfo.roomAdmin?.disbandRoom == 1;
        // GameCache.Instance._isHasUseLeavePrivileges = isClear ? false : this._roomInfo.roomAdmin?.userLeave == 1;
        // GameCache.Instance._isHasUserStandUpPrivileges = isClear ? false : this._roomInfo.roomAdmin?.userStandUp == 1;
        // GameCache.Instance._isHasViewVideoPrivileges = isClear ? false : this._roomInfo.roomAdmin?.viewVideo == 1;
        // GameCache.Instance._texasData._isBombPot = isClear ? false : this._roomInfo.bombpot == 1;
        // GameCache.Instance._creatorId = isClear ? 0 : this._roomInfo.creatorRandomId;
        // GameCache.Instance._settlementType = isClear ? 0 : this._roomInfo.settlementType;
        // GameCache.Instance._poolRateSwitch = isClear ? 0 : this._roomInfo.hcPoolRateLv;
        // GameCache.Instance._poolRate = isClear ? 0 : this._roomInfo.hcPoolRate;
        // GameCache.Instance._totalHandSwitch = isClear ? 0 : this._roomInfo.hcTotalHandLv;
        // GameCache.Instance._totalHand = isClear ? 0 : this._roomInfo.hcTotalHand;
        // GameCache.Instance._randomSeat = isClear ? 0 : this._roomInfo.randomSeat;
        // GameCache.Instance._forceShowCard = isClear ? 0 : this._roomInfo.forceShowCard;
        // GameCache.Instance._squidForceShowCard = isClear ? 0 : this._roomInfo.squidForceShowCard;
        // GameCache.Instance._onlyIOS = isClear ? 0 : this._roomInfo.onlyIos;
        // GameCache.Instance._playHandsLimit = isClear ? 0 : this._roomInfo.playHandsLimit;
        // GameCache.Instance._notEnoughCloseDuration = isClear ? 0 : this._roomInfo.notEnoughCloseDuration;
        // GameCache.Instance._playDurationType = isClear ? 0 : this._roomInfo.playDurationType;
        // GameCache.Instance._limitDelayTimes = isClear ? 0 : this._roomInfo.limitDelayTimes;
        // GameCache.Instance._lookHandCard = isClear ? 0 : this._roomInfo.viewPlayerCards;
        // GameCache.Instance._blockchainType = isClear ? 0 : this._roomInfo.encryptCards;
        // GameCache.Instance._bringinEqualLeader = isClear ? 0 : this._roomInfo.bringinEqualLeader;
        // GameCache.Instance._minPlayerChipRate = isClear ? 0 : this._roomInfo.minPlayerChipRate;
        // GameCache.Instance._maxBringinTotalRate = isClear ? 0 : this._roomInfo.maxBringinTotalRate;
        // GameCache.Instance._texasData._jackpot = isClear ? 0 : this._roomInfo.jackpot;
        // GameCache.Instance.jackPot_id = isClear ? 0 : this._roomInfo.jackpotId;
        // GameCache.Instance._texasData._jackpotGold = isClear ? 0 : this._roomInfo.jackpotGold;
        // GameCache.Instance._texasData._jackpotParentGold = isClear ? 0 : this._roomInfo.jackpotParentGold;
        // GameCache.Instance._texasData._jackpotConfig = isClear ? null : this._roomInfo.jackpotConfig;
        // GameCache.Instance._texasData._limitRetainMinRate = isClear ? 0 : this._roomInfo.retainMinRate;
        // GameCache.Instance._autoStartMinPlayer = isClear ? 0 : this._roomInfo.autostartMinPlayers;
        // GameCache.Instance._minPlayer = isClear ? 0 : this._roomInfo.minPlayers;
        // GameCache.Instance._texasData._retainMinRate = isClear ? 0 : this._roomInfo.retainMinRate;
        // GameCache.Instance._texasData._retainMaxRate = isClear ? 0 : this._roomInfo.retainMaxRate;
        // GameCache.Instance._opDuration = isClear ? 0 : this._roomInfo.opDuration;
        // GameCache.Instance._texasData._allinBanChatType = isClear ? 0 : this._roomInfo.allInMute;
        // GameCache.Instance._texasData._insuranceForceBuyRatio = isClear ? 0 : this._roomInfo.insuranceForceBuyRatio;
        // GameCache.Instance.room_jackpot_config = isClear ? null : this._roomInfo.jackpotConfig;
        // // 多语言房间名设置
        // if (isClear) {
        //     GameCache.Instance._multiLanguage = null;
        // } else {
        //     // TODO: 多语言处理 - 需要MultiLanguage类和相关反射实现
        //     // C#: GameCache.Instance._multiLanguage = GameCache.Instance._multiLanguage ?? new MultiLanguage();
        //     // C#: foreach (var mlName in _roomInfo.MultiLangNames) { ... }
        // }
        // GameCache.Instance._antiCheatType = isClear ? 0 : this._roomInfo.antiCheatType;
        // if (GameCache.Instance._antiCheatType == AntiCheatType.VIDEO) {
        //     this.tracelog.info('-------------------客户端已进入视频房间-------------------');
        //     GameCache.Instance._videoModel = this._roomInfo.antiCheatVideoType;
        // } else {
        //     GameCache.Instance._videoModel = 0;
        // }
        // GameCache.Instance._normalAntiCheatOrderType = isClear ? 0 : this._roomInfo.antiCheatOrderType;
        // GameCache.Instance._normalAntiCheatOrderMicType = isClear ? 0 : this._roomInfo.antiCheatOrderMicType;
        // GameCache.Instance._antiCheatTimeLimit = isClear ? 0 : this._roomInfo.antiCheatTimelimit;
        // GameCache.Instance._videoEffectType = isClear ? 0 : this._roomInfo.videoEffectType;
        // GameCache.Instance._videoPowerSaving = isClear ? 0 : this._roomInfo.powerSaving;
        // this.tracelog.info('[VideoMask] 节能模式(窗花) power_saving:', GameCache.Instance._videoPowerSaving, '(1=开,2=关)');
        // GameCache.Instance._videoVerifyType = isClear ? 0 : this._roomInfo.videoVerifyType;
        // // 保险赔率表 - TODO: 需要GameUtil._outsList实现
        // // C#: GameUtil._outsList.Clear();
        // // C#: foreach (var insurance in _roomInfo.InsuranceOdds) { ... }
        // // C#: GameUtil._outsList.Add((uint)insurance.PotUserCount, oddsList);
        // if (!isClear) {
        //     // 鱿鱼设置
        //     if (this._roomInfo.squidBase == 0 && (this._roomInfo.subConfigsList == null || this._roomInfo.subConfigsList.length == 0)) {
        //         GameCache.Instance._texasData._squidBase = this._roomInfo.squidBase;
        //     } else {
        //         GameCache.Instance._texasData._squidMostGet = this._roomInfo.squidMostGet;
        //         GameCache.Instance._texasData._squidBetGet = this._roomInfo.squidBetGet;
        //         GameCache.Instance._texasData._squidHead = this._roomInfo.squidHead;
        //         GameCache.Instance._texasData._squidTail = this._roomInfo.squidTail;
        //         GameCache.Instance._texasData._squidMaxCount = this._roomInfo.squidMax;
        //         GameCache.Instance._texasData._squidRound = this._roomInfo.rounds;
        //         GameCache.Instance._texasData._squidMode = this._roomInfo.squidMode;
        //         GameCache.Instance._texasData._squidExtraCount = this._roomInfo.squidExtraCount;
        //         GameCache.Instance._texasData._squidCountRates = this._roomInfo.squidCountRateList || [];
        //         GameCache.Instance._texasData._squidDepositPercent = this._roomInfo.depositPercent;
        //         if (this._roomInfo.subConfigsList != null && this._roomInfo.subConfigsList.length > 0) {
        //             GameCache.Instance._texasData._squidOpenNumber = this._roomInfo.subConfigsList[0].playingPlayerCountLimit;
        //         } else {
        //             GameCache.Instance._texasData._squidOpenNumber = this._roomInfo.squidPlayerCount;
        //         }
        //         if (this._roomInfo.squidBase == 0) {
        //             if (this._roomInfo.subConfigsList != null && this._roomInfo.subConfigsList.length > 0) {
        //                 GameCache.Instance._texasData._squidBase = this._roomInfo.subConfigsList[0].squidBase;
        //             }
        //         } else {
        //             GameCache.Instance._texasData._squidBase = this._roomInfo.squidBase;
        //         }
        //     }
        //     if (!GameCache.Instance._texasData._isSquidEnable) {
        //         if (this._roomInfo.subConfigsList != null && this._roomInfo.subConfigsList.length > 0) {
        //             GameCache.Instance._texasData._subGamePlayAnte = this._roomInfo.subConfigsList[0].ante;
        //             GameCache.Instance._texasData._isCriticalHitEnable = this._roomInfo.subConfigsList[0].criticalHit == 1;
        //         } else {
        //             GameCache.Instance._texasData._subGamePlayAnte = 0;
        //             GameCache.Instance._texasData._isCriticalHitEnable = false;
        //         }
        //         GameCache.Instance._texasData._criticalHitRound = this._roomInfo.rounds;
        //     }
        //     // Club/Tribe 权限缓存 - TODO: 需要对应实现
        //     // C#: GameCache.Instance._clubRoomPermissionsPart.CacheClubRoomPermission(...);
        //     // C#: GameCache.Instance._tribeBlackUserDataPart.CacheBlackUserList(...);
        //     // C#: GameCache.Instance._jackpotTemplateListPart.CacheJackpotAwardDetail(...);
        //     // C#: GameCache.Instance._wheelTemplateListPart.CacheAwardDetail(...);
        // } else {
        //     // 鱿鱼设置 isClear
        //     GameCache.Instance._texasData._squidBase = 0;
        //     GameCache.Instance._texasData._squidMostGet = 0;
        //     GameCache.Instance._texasData._squidBetGet = 0;
        //     GameCache.Instance._texasData._squidHead = 0;
        //     GameCache.Instance._texasData._squidTail = 0;
        //     GameCache.Instance._texasData._squidMaxCount = 0;
        //     GameCache.Instance._texasData._squidRound = 0;
        //     GameCache.Instance._texasData._squidOpenNumber = 0;
        //     GameCache.Instance._texasData._subGamePlayAnte = 0;
        //     GameCache.Instance._texasData._criticalHitRound = 0;
        //     GameCache.Instance._texasData._isCriticalHitEnable = false;
        //     GameCache.Instance._texasData._squidMode = 0;
        //     GameCache.Instance._texasData._squidExtraCount = 0;
        //     GameCache.Instance._texasData._squidCountRates = [];
        //     GameCache.Instance._texasData._squidDepositPercent = 0;
        // }
        // // 新增字段 (C# 408-417行)
        // GameCache.Instance._texasData._mushroomMode = isClear ? 0 : this._roomInfo.mushroomMode;
        // GameCache.Instance._texasData._mushroomBase = isClear ? 0 : this._roomInfo.mushroomBase;
        // // TODO: _enterRoomType 枚举定义
        // // C#: (EnterRoomType)_roomInfo.EnterRoomType
        // GameCache.Instance._enterRoomType = isClear ? 0 : this._roomInfo.enterRoomType;
        // GameCache.Instance._isWhiteList = isClear ? false : this._roomInfo.isWhitelist;
        // GameCache.Instance._texasData._anteRandomJumpConfig = isClear ? '' : this._roomInfo.randomAnte;
        // GameCache.Instance._texasData._callTime = isClear ? 0 : this._roomInfo.calltime;
        // GameCache.Instance._texasData._callTimeWinline = isClear ? 0 : this._roomInfo.calltimeWinLine;
        // GameCache.Instance._texasData._callTimeLimitCount = isClear ? 0 : this._roomInfo.calltimeLimit;
        // GameCache.Instance._texasData._autoChangeTable = isClear ? 0 : this._roomInfo.autoChangeRoomLimitHand;
        // GameCache.Instance._texasData._smallBlind = isClear ? 0 : this._roomInfo.sb;
        // GameCache.Instance._texasData._bigBlind = isClear ? 0 : this._roomInfo.sb * 2;
        // GameCache.Instance._texasData._ante = isClear ? 0 : this._roomInfo.ante;
        // GameCache.Instance._texasData._minBringIn = isClear ? 0 : this._roomInfo.sb * 2;
        // GameCache.Instance._texasData._curMaxRate = isClear ? 0 : this._roomInfo.maxRate;
        // GameCache.Instance._texasData._curMinRate = isClear ? 0 : this._roomInfo.minRate;
    }

    /**
     * 请求进入房间
     * @param isUseCache 是否使用缓存
     */
    public override async requestEnterAsync(isUseCache: boolean): Promise<number> {
        let roomData: TexasGameRoomData;
        if (roomDataManager.existRoomData(this._roomId, this.matchId)) {
            roomData = roomDataManager.getRoomData<TexasGameRoomData>(this._roomId, this.matchId);
        }
        if (!roomData) {
            roomData = new TexasGameRoomData(this._roomId, this.matchId);
        }
        roomData.basicInfo.subRoomConfig = this._roomInfo.subConfigsList ?? [];
        roomData.basicInfo.roomName = this._roomInfo.name;
        roomData.basicInfo.roomType = this._roomInfo.roomType;
        roomData.basicInfo.delaySeeCard = this._roomInfo.delayViewCardOn > 0;
        roomData.basicInfo.invitationCode = this._roomInfo.invitationCode;
        roomData.basicInfo.sbante = { sb: this._roomInfo.sb, ante: this._roomInfo.ante };
        roomData.basicInfo.curMaxRate = this._roomInfo.maxRate;
        roomData.basicInfo.curMinRate = this._roomInfo.minRate;
        roomData.basicInfo.retainType = this._roomInfo.retainType;
        roomData.basicInfo.retainMaxRate = this._roomInfo.retainMaxRate;
        roomData.basicInfo.retainMinRate = this._roomInfo.retainMinRate;
        roomData.basicInfo.onlyIOS = this._roomInfo.onlyIos == 1;
        // 加密卡牌
        roomData.basicInfo.encryptCards = this._roomInfo.encryptCards > 0;
        // 强制亮牌
        roomData.basicInfo.forceShowCard = this._roomInfo.forceShowCard == 1;
        // 自动换桌
        roomData.basicInfo.autoChangeTableLimitHand = this._roomInfo.autoChangeRoomLimitHand;
        // 入池率限制
        roomData.basicInfo.hcPoolRate = this._roomInfo.hcPoolRate;
        // 看对手牌模式
        roomData.basicInfo.viewPlayerCards = this._roomInfo.viewPlayerCards;
        // 二道牌
        roomData.basicInfo.secondPcsOn = this._roomInfo.secondPcsOn > 0;
        roomData.basicInfo.secondPcsOpduration = this._roomInfo.secondPcsOpDuration;
        roomData.basicInfo.secondPcsUserLimit = this._roomInfo.secondPcsUserLimit;
        // 保险
        roomData.basicInfo.insuranceMode = this._roomInfo.insuranceMode;
        roomData.basicInfo.hasInsurance = this._roomInfo.insuranceOn > 0;
        roomData.basicInfo.insuranceOdds = this._roomInfo.insuranceOddsList;
        roomData.basicInfo.insuranceForceBuyRatio = this._roomInfo.insuranceForceBuyRatio;
        roomData.basicInfo.insuranceOpduration = this._roomInfo.insuranceOpDuration;
        //stradle
        roomData.basicInfo.straddle = this._roomInfo.straddleOn > 0;
        roomData.basicInfo.straddleMax = this._roomInfo.straddleMax;
        //baseInfo
        roomData.basicInfo.clubID = this._roomInfo.clubId;
        roomData.basicInfo.tribeID = this._roomInfo.tribeId;
        roomData.basicInfo.originType = this._roomInfo.originType;
        roomData.basicInfo.limitIP = this._roomInfo.limitIpOn > 0;
        roomData.basicInfo.limitGPS = this._roomInfo.limitGpsOn > 0;
        roomData.basicInfo.setRandomAnte(this._roomInfo.randomAnte);
        //限制带入
        roomData.basicInfo.minPlayerChipRate = this._roomInfo.minPlayerChipRate;
        roomData.basicInfo.maxBringinTotalRate = this._roomInfo.maxBringinTotalRate;
        roomData.basicInfo.bringinEqualLeaderPercent = this._roomInfo.bringinEqualLeader;
        //callTime
        roomData.basicInfo.hasCallTime = this._roomInfo.calltime == 1; // 2 是关闭
        roomData.basicInfo.callTimeWinline = this._roomInfo.calltimeWinLine;
        roomData.basicInfo.callTimeLimit = this._roomInfo.calltimeLimit;
        roomData.basicInfo.handNum = this._roomInfo.handNum;
        roomData.basicInfo.playDuration = this._roomInfo.playDuration;
        roomData.basicInfo.goldType = this._roomInfo.goldType;
        //jackpot
        roomData.basicInfo.jackpot = this._roomInfo.jackpot == 1;
        roomData.basicInfo.jackpotID = this._roomInfo.jackpotId;
        roomData.basicInfo.jackpotPool = this._roomInfo.jackpotGold;
        roomData.basicInfo.jackpotConfig = this._roomInfo.jackpotConfig;
        roomData.basicInfo.jackpotMainPool = this._roomInfo.jackpotParentGold;
        //hasBombPot
        roomData.basicInfo.checkBombPot(this._roomInfo.bombpot, this._roomInfo.rounds, this._roomInfo.subConfigsList);
        //hasCriticalHit
        roomData.basicInfo.checkCriticalHit(this._roomInfo.criticalHit, this._roomInfo.ante, this._roomInfo.rounds, this._roomInfo.subConfigsList);
        //hasSquid
        roomData.basicInfo.checkSquid(this._roomInfo.squidBase, this._roomInfo.rounds, this._roomInfo.squidPlayerCount, this._roomInfo.subConfigsList);
        roomData.basicInfo.squidMostGet = this._roomInfo.squidMostGet > 0;
        roomData.basicInfo.squidBetGet = this._roomInfo.squidBetGet > 0;
        roomData.basicInfo.squidHead = this._roomInfo.squidHead > 0;
        roomData.basicInfo.squidTail = this._roomInfo.squidTail > 0;
        roomData.basicInfo.squidForceShowCard = this._roomInfo.squidForceShowCard > 0;
        roomData.basicInfo.squidMode = this._roomInfo.squidMode; // 鱿鱼模式：0经典，1血战
        roomData.basicInfo.squidExtraCount = this._roomInfo.squidExtraCount; // 额外的鱿鱼个数（血战）
        roomData.basicInfo.squidLeaveMode = this._roomInfo.squidLeaveMode; // 鱿鱼轮离开模式 1 可以离开 2 不可以离开（一轮结束才可以离开，如果筹码不足没补充就走模式1）
        roomData.basicInfo.squidCountRateList = this._roomInfo.squidCountRateList;
        // 带入必须申请
        roomData.basicInfo.limitBringIn = this._roomInfo.limitBringIn > 0;
        //hasMushroom
        roomData.basicInfo.mushroomBase = this._roomInfo.mushroomBase;
        roomData.basicInfo.mushroomMode = this._roomInfo.mushroomMode;
        roomData.basicInfo.mushroomStatic = this._roomInfo.mushroomStatic;
        //强制随机坐下
        roomData.basicInfo.randomSeated = this._roomInfo.randomSeat == 1; // 2 关闭
        //安全屋
        roomData.basicInfo.seatedMessage = this._roomInfo.seatedMessaging > 0;
        // mock video
        // this._roomInfo.antiCheatType = AntiCheatType.VIDEO;
        // this._roomInfo.antiCheatVideoType = 3;
        // this._roomInfo.powerSaving = 0;
        // this._roomInfo.videoSeatSwitch = 0;
        // this._roomInfo.videoMiddleSwitch = 1,
        // this._roomInfo.micSeatSwitch = 0;
        // this._roomInfo.micMiddleSwitch = 1;
        // this._roomInfo.powerSavingSeatSwitch = 0;
        // this._roomInfo.powerSavingMiddleSwitch = 1;
        //video/audio
        if (this._roomInfo.antiCheatType == AntiCheatType.VIDEO || this._roomInfo.antiCheatType == AntiCheatType.AUDIO) {
            roomData.basicInfo.antiCheatConfig = new VideoAntiCheatConfig(
                this._roomInfo.antiCheatType,
                this._roomInfo.antiCheatTimelimit,
                this._roomInfo.antiCheatVideoType, // 视频模式 0 未知 1 全时长 2 随机验证 3 麦序, 5, 6
                this._roomInfo.micSeatSwitch == 1,
                this._roomInfo.micMiddleSwitch == 1,
                this._roomInfo.videoSeatSwitch == 1,
                this._roomInfo.videoMiddleSwitch == 1,
                this._roomInfo.powerSaving == 1,
                this._roomInfo.powerSavingSeatSwitch == 1,
                this._roomInfo.powerSavingMiddleSwitch == 1,
                this._roomInfo.antiCheatOrderType,
                this._roomInfo.videoVerifyType
            );
        } else {
            roomData.basicInfo.antiCheatConfig = null;
        }
        roomData.mine.updateRoomAdminPermissions(this._roomInfo.roomAdmin || null);
        roomData.seatsStateManager.seatsCount = this._roomInfo.seatCount;
        roomDataManager.setRoomData(this._roomId, this.matchId, roomData);
        const body: ClientMessageEnterRoom.AsObject = {
            room: { roomId: this._roomId, matchId: this.matchId },
            gps: { longitude: '', latitude: '' },
            mttPartialBringIn: 0,
            observer: false,
            wantSeat: Def.WantSeatType.WST_BOTH
        };
        ProtocolAgency.Send({
            code: Code.MSG_D_ENTER_ROOM,
            roomID: this._roomId,
            matchID: this.matchId,
            body: body
        });
        return 0;
    }
}
