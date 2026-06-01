import roomDataManager from '../../data/room/RoomDataManager';
import TexasGameRoomData from '../../data/room/texas/TexasGameRoomData';
import ProtocolAgency from '../../net/websocket/ProtocolAgency';
import { Code } from '../../protobuf/holdem/code_pb';
import { Def } from '../../protobuf/holdem/define_pb';
import { ServerMessageMttDetail, ClientMessageMttDetail } from '../../protobuf/holdem/req_rpc_mtt_detail_pb';
import { ClientMessageEnterRoom } from '../../protobuf/holdem/req_th_enter_room_pb';
import { AntiCheatType } from '../constant/AntiCheatType';
import { MttPlayerStatus } from '../constant/Constants';
import AGameplayEntrance, { LoadIndicator } from './AGameplayEntrance';

/**
 * @description 德州MTT玩法入口
 */

export default class MttTexasGameplayEntrance extends AGameplayEntrance {
    /**
     * 比赛信息
     */
    public _mttDetails: ServerMessageMttDetail.AsObject = null;
    /**
     * 是否是观众 (mtt类玩法使用)
     */
    public _isObserver: boolean = false;
    /**
     * 带入额度
     * @remarks 可以部分带入或全额带入. 全额带入传0, 部分带入可按某个比例带入全额的一部分,剩余的部分可供之后带入
     */
    public _partialBringIn: number = 0;
    // ==================== 计算属性 ====================
    /**
     * 重购费用
     */
    public get rebuyCost(): number {
        return this._mttDetails.mtt.applyFeePool + this._mttDetails.mtt.applyFeeService;
    }
    // ==================== 构造函数 ====================
    /**
     * 强制在构造时必须提供核心数据
     * @param roomType 玩法类型
     * @param matchId 比赛id
     * @param roomId 房间id
     */
    constructor(roomType: number, matchId: number, roomId: number, observer: boolean) {
        super(roomType, matchId, roomId);
        this._isObserver = observer;
    }
    // ==================== 启动参数 ====================
    /**
     * 设置入口启动时所需要的额外参数
     * @param launchArgs 额外启动参数
     */
    public setLaunchArgs(launchArgs: any): void {
        // C#: public override void SetLaunchArgs(GameplayLaunchArgs launchArgs)
        if (launchArgs == null) {
            return;
        }
        // C#: base.SetLaunchArgs(launchArgs);
        // TODO: 调用基类 setLaunchArgs (基类尚未实现)
        this._isObserver = launchArgs._isMttObserver || false;
        this._partialBringIn = launchArgs._mttPartialBringIn || 0;
    }
    // ==================== 表现层复用 ====================
    /**
     * 是否可复用表现层
     * @param roomType 玩法类型
     */
    public override isCanReuseViewLayer(roomType: number): boolean {
        // C#: if (GameUtil.IsTexasCategoryGameplay((int)roomType))
        // TODO: 横屏切换 - 需要 GameUtil.IsTexasCategoryGameplay 和 UIManager/UIGameplayTexasComponent
        return false;
    }
    // ==================== 通信层 ====================
    /**
     * 通信层进入玩法 - MTT版本
     * @param isEnterForeground 是否进入前台
     */
    protected override async messageLayerEnterAsync(isEnterForeground: boolean): Promise<boolean> {
        console.log(`${this.constructor.name}: messageLayerEnterAsync: ${this.tableId}, isEnterForeground=${isEnterForeground}`);
        // C#: int status = await RequestMttDetailsAsync();
        const status: number = await this.requestMttDetailsAsync();
        if (status != 0) {
            console.error(`${this.constructor.name}: messageLayerEnterAsync: requestMttDetailsAsync failed: ${status}`);
            // C#: UIManager.Instance.Toast(CPErrorCode.ServerErrorDescription(status));
            // TODO: 显示错误提示
            this._isHasToast = true;
            return false;
        }
        // C#: bool isCanEnter = await CheckCanEnterAsync(isEnterForeground);
        const isCanEnter: boolean = await this.checkCanEnterAsync(isEnterForeground);
        if (!isCanEnter) {
            return false;
        }
        // C#: bool isReady = await PrepareForEnterAsync();
        const isReady: boolean = await this.prepareForEnterAsync();
        if (!isReady) {
            return false;
        }
        // C#: int enterStatus = await RequestEnterAsync();
        const enterStatus: number = await this.requestEnterAsync(false);
        console.log(`star-----> [mtt] enterStatus = ${enterStatus}`);
        this._enterStatus = enterStatus;
        // C#: if (enterStatus != 0 && enterStatus == (int)ServerErrorCode.UIPushBlack)
        // C#: UIManager.Instance.ShowNoAnimation(UIType.UI_DIALOG_CONTENT_SIZE, ...)
        // C#: 联盟黑名单提示弹窗
        if (enterStatus != 0) {
            // TODO: 处理特殊错误码 UIPushBlack - 显示联盟黑名单弹窗
            // TODO: 处理 Gameplay_AutoSeatReturnToInvalidGame 错误码
            console.error(`${this.constructor.name}: messageLayerEnterAsync: request enter fail: enterStatus=${enterStatus}`);
            this._isHasToast = true;
            return false;
        }
        return true;
    }

    /**
     * 通信层离开玩法
     */
    public override messageLayerLeave(): void {
        // C#: CPGameSessionComponent.Instance?.Send(new Protocol_Holdem_Leave() { ... })
        // TODO: 发送 Protocol_Holdem_Leave 消息
    }
    // ==================== MTT详情请求 ====================
    /**
     * 请求MTT详细信息
     * @param isForceSync 是否强制同步 (忽略缓存)
     */
    public async requestMttDetailsAsync(isForceSync: boolean = false): Promise<number> {
        // C#: if (!isForceSync && _mttDetails != null) return 0;
        if (!isForceSync && this._mttDetails != null) {
            console.log(`${this.constructor.name}: requestMttDetailsAsync: AVOID REPEAT REQUEST MTT DETAILS`);
            return 0;
        }
        console.log(`${this.constructor.name}: requestMttDetailsAsync: request mtt details`);
        // C#: return await RequestRoomInfoAsync();  -- sends Protocol_Holdem_MttDetail
        return await this.requestRoomInfoAsync();
    }

    /**
     * 请求房间信息 - MTT版本重写
     * C#: public override async ETTask<int> RequestRoomInfoAsync()
     * 发送 Protocol_Holdem_MttDetail 而非 Protocol_Holdem_Rooms
     */
    public async requestRoomInfoAsync(): Promise<number> {
        try {
            const resp = await ProtocolAgency.SendAsync(Code.MSG_R_MTT_DETAIL, {
                matchId: this.matchId,
                rpcId: 1
            });
            if (resp.status != 0) {
                console.error(`${this.constructor.name}: requestRoomInfoAsync: ${resp.status}`);
                return -1;
            }
            if (resp.mtt == null) {
                console.error(`${this.constructor.name}: requestRoomInfoAsync: room not exist`);
                return -1;
            }
            this._mttDetails = resp;
            return 0;
        } catch (error) {
            console.error(`${this.constructor.name}: requestRoomInfoAsync: wait room info failed, ${error}`);
            return -1;
        }
    }
    // ==================== 进入前准备 ====================
    /**
     * 准备进入比赛
     * C#: private async ETTask<bool> PrepareForEnterAsync()
     */
    private async prepareForEnterAsync(): Promise<boolean> {
        // C#: _partialBringIn = 0;
        this._partialBringIn = 0;
        // C#: if (_isObserver) return true;
        if (this._isObserver) {
            // 玩家只想做个观众, 不需要更多处理
            return true;
        }
        // 玩家是以参赛选手的身份进入比赛
        // C#: MttPlayerStatus mttPlayerStatus = (MttPlayerStatus)_mttDetails.StateCode;
        const mttPlayerStatus: MttPlayerStatus = this._mttDetails.stateCode || 0;
        switch (mttPlayerStatus) {
            case MttPlayerStatus.CAN_JOIN:
                await this.handlePartialBringInAsync(0, 0);
                break;
            case MttPlayerStatus.LOSE_CAN_REBUY:
                // C#: TODO: 对于当前已经输了的但是可以通过重购重新进入比赛的情况，需要仔细考虑该如何交互，目前直接返回
                console.error(`${this.constructor.name}: prepareForEnterAsync: incorrect player status: ${mttPlayerStatus}`);
                return false;
            default:
                console.error(`${this.constructor.name}: prepareForEnterAsync: incorrect player status: ${mttPlayerStatus}`);
                return false;
        }
        return true;
    }

    /**
     * 处理玩法内的部分带入
     * @param curChips 玩家当前桌上的筹码
     * @param storeChips 玩家当前未上桌的用于部分带入的筹码
     */
    public async handlePartialBringInAsync(curChips: number, storeChips: number): Promise<void> {
        // C#: 比赛是否允许部分带入
        const isEnablePartial: boolean = this._mttDetails.state?.partialEnable;
        const initChips: number = this._mttDetails.mtt.initialScore;
        const startTime: string = this._mttDetails.mtt.startTime;
        const upBlindInterval: number = this._mttDetails.mtt.upblindInterval;
        const rebuyMaxBlindLevel: number = this._mttDetails.mtt.maxRebuyBl;
        console.log(`${this.constructor.name}: handlePartialBringInAsync: isEnablePartial=${isEnablePartial}, storeChips=${storeChips}`);
        // C#: _partialBringIn = await GameplayManagerEntity.MttGetPartialBringInAmountAsync(...)
        // TODO: 调用 GameplayManagerEntity.MttGetPartialBringInAmountAsync 计算部分带入额度
        // extraInfo: { startTime, upBlindInterval, rebuyMaxBlindLevel }
    }

    /**
     * 处理玩法内的重购
     * @param totalRebuyCnt 比赛允许的总重购次数
     * @param alreadyRebuyCnt 玩家已经重购的次数
     * @returns 0-成功, 非0-失败
     */
    public async handleRebuyAsync(totalRebuyCnt: number, alreadyRebuyCnt: number): Promise<number> {
        console.log(`${this.constructor.name}: handleRebuyAsync`);
        // C#: return await GameplayManagerEntity.MttRebuyAsync(_mttDetails.Mtt, totalRebuyCnt, alreadyRebuyCnt);
        // TODO: 调用 GameplayManagerEntity.MttRebuyAsync 处理重购
        return 0;
    }
    // ==================== 进入房间请求 ====================
    /**
     * 请求进入房间 - MTT版本重写
     * @param isUseCache 是否使用缓存
     */
    public override async requestEnterAsync(isUseCache: boolean): Promise<number> {
        // C#: _protoEnterRequest = new Protocol_Holdem_EnterRoom { ... }
        // C#: 携带额外字段: Observer = _isObserver, MttPartialBringIn = (ulong)_partialBringIn
        // TODO: 发送 Protocol_Holdem_EnterRoom 协议 (MTT版本携带 Observer + MttPartialBringIn 字段)
        console.log(`star----->[mtt] requestEnterAsync: isUseCache=${isUseCache}`);
        // TODO: 从响应中获取 MttRoom.RoomId 并调用 RefreshRoomId
        // C#: if (response.Status == 0) RefreshRoomId((int)response.MttRoom.RoomId);
        // 请求进入德州房间
        // ProcedureManager.StartProcedure(ProcedureDefine.Texas, GameCache.Instance.enter_param);
        const roomData = new TexasGameRoomData(this._roomId, this.matchId);
        roomData.basicInfo.roomName = this._mttDetails.mtt.name;
        roomData.basicInfo.roomType = this._mttDetails.mtt.type;
        roomData.basicInfo.delaySeeCard = this._mttDetails.mtt.delayViewCardOn > 0;
        roomData.basicInfo.invitationCode = this._mttDetails.mtt.invitationCode;
        // 没法取到的数据(enterRoom后获取把)
        // roomData.basicInfo.sbante = { sb: this._mttDetails.mtt.sb, ante: this._mttDetails.mtt.ante };
        roomData.basicInfo.clubID = this._mttDetails.mtt.clubId;
        roomData.basicInfo.squidEnabled = false;
        roomData.basicInfo.mushroomEnabled = false;
        roomData.basicInfo.goldType = this._mttDetails.mtt.goldType;
        roomData.basicInfo.normalAntiCheatOrderType = this._mttDetails.mtt.antiCheatOrderType;
        roomData.basicInfo.normalAntiCheatOrderMicType = this._mttDetails.mtt.antiCheatOrderMicType;
        roomData.basicInfo.antiCheatTimeLimit = this._mttDetails.mtt.antiCheatTimelimit;
        roomData.basicInfo.videoEffectType = 0;
        roomData.basicInfo.videoPowerSaving = 0;
        //this.tracelog.info('[VideoMask] 节能模式(窗花) power_saving:', roomData.basicInfo.videoPowerSaving, '(1=开,2=关)');
        roomData.basicInfo.videoVerifyType = this._mttDetails.mtt.videoVerifyType;
        if (this._mttDetails.mtt.antiCheatType == AntiCheatType.VIDEO) {
            roomData.basicInfo.videoModel = this._mttDetails.mtt.antiCheatVideoType;
        } else {
            roomData.basicInfo.videoModel = 0;
        }
        roomData.seatsStateManager.seatsCount = this._mttDetails.mtt.seatCount;
        roomDataManager.setRoomData(this._roomId, this.matchId, roomData);
        const body: ClientMessageEnterRoom.AsObject = {
            room: { roomId: this._roomId, matchId: this.matchId },
            gps: { longitude: '', latitude: '' },
            mttPartialBringIn: 0,
            observer: this._isObserver,
            wantSeat: Def.WantSeatType.WST_NO
        };
        ProtocolAgency.Send({
            code: Code.MSG_D_ENTER_ROOM,
            roomID: this._roomId,
            matchID: this.matchId,
            body: body
        });
        return 0;
    }

    /**
     * 刷新房间ID (MTT比赛中房间ID可能动态变化)
     * @param roomId 新房间ID
     */
    public refreshRoomId(roomId: number): void {
        // C#: if (_roomId == roomId) return;
        if (this._roomId == roomId) {
            return;
        }
        const oldRoomId: number = this._roomId;
        this._roomId = roomId;
        console.log(`${this.constructor.name}: refreshRoomId: oldRoomId=${oldRoomId}, newRoomId=${roomId}`);
        // C#: Game.EventSystem.Run(EventIdType.MULTI_TABLE_EVENT_REFRESH_MTT_ROOM_ID, (AGameplayEntrance)this, oldRoomId);
        // TODO: 触发 EventIdType.MULTI_TABLE_EVENT_REFRESH_MTT_ROOM_ID 事件
    }
    // ==================== 进入条件检查 ====================
    /**
     * 检查是否可以进入玩法 - MTT版本重写
     * @param isEnterForeground 是否进入前台
     */
    protected async checkCanEnterAsync(isEnterForeground: boolean): Promise<boolean> {
        // C#: if (_mttDetails == null) return false;
        if (this._mttDetails == null) {
            console.error(`${this.constructor.name}: checkCanEnterAsync: missing key mtt info`);
            return false;
        }
        // C#: if (_isObserver) return true; // 观众不做过多检查
        if (this._isObserver) {
            return true;
        }
        // C#: MTTRecord mtt = _mttDetails.Mtt;
        // C#: AntiCheatType antiCheatType = (AntiCheatType)mtt.AntiCheatType;
        // C#: bool isDevicePermissionOk = CheckDevicePermission(antiCheatType);
        // TODO: 检查设备权限 (音频/视频/人脸) - 无GPS检查
        // C#: if (isEnterForeground) bool isFaceOk = await CheckFaceValidAsync(antiCheatType);
        // TODO: 人脸验证检查 (仅前台进入时)
        return true;
    }
    // ==================== 加载玩法 ====================
    /**
     * 加载整个玩法 - MTT版本
     */
    protected override loadGameplay(): any {
        console.log(`${this.constructor.name}: loadGameplay: ${this.tableId}`);
        // ///////////////////////////////////////////////////////////////////////
        // 此时消息层面进入已成功, 玩法启动所需的所有必要数据都已经准备好
        // 接下来的逻辑都建立在此基础上
        // ///////////////////////////////////////////////////////////////////////
        // C#: TexasGame game = CreateGameplayEntity();
        // C#: GameCache.Instance._curGame = game;
        // C#: game.SetViewLayerToCleanStatus();
        // C#: game.ChangeGameState(TexasGameState.LAUNCH, null);  // 注意: sourceData 为 null!
        // TODO: 创建 MTT 游戏实体并启动状态机
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
        console.log(`${this.constructor.name}: unloadViewLayer: ${this.tableId}, loadIndicator=${loadIndicator}`);
        // C#: TexasGame.UnloadAllViews(loadIndicator);
        // TODO: 卸载 MTT 德州玩法表现层
        super.unloadViewLayer(loadIndicator);
    }
    // ==================== 缓存全局数据 ====================
    /**
     * 加载玩法前缓存相关全局数据 - MTT版本重写
     * @param isClear 是否清理缓存数据
     */
    protected override cacheGlobalDataBeforeLoad(isClear: boolean): void {
        super.cacheGlobalDataBeforeLoad(isClear);
        // C#: MTTRecord mtt = _mttDetails.Mtt; MTTMore more = _mttDetails.More;
        const mtt = this._mttDetails?.mtt;
        const more = this._mttDetails?.more;
        console.log(`${this.constructor.name}: cacheGlobalDataBeforeLoad: matchId=${this.matchId}, isClear=${isClear}`);
        // C#:
        // GameCache.Instance._roomName = isClear ? default : UILoginModel.Instance.GetRoomNameByKey(mtt.Name);
        // TODO: 需要 UILoginModel.Instance.GetRoomNameByKey
        // GameCache.Instance.roomName = isClear ? '' : mtt.name;
        // GameCache.Instance.seat_count = isClear ? 0 : mtt.seatCount;
        // // C#: GameCache.Instance._wheelTemplateId = isClear ? default : (int)_roomInfo.WheelTemplateId;
        // GameCache.Instance.game_type = isClear ? 0 : mtt.gameType;
        // GameCache.Instance.poker_type = isClear ? 0 : mtt.pokerType;
        // GameCache.Instance.bet_type = isClear ? 0 : mtt.limitBetType;
        // // MTT 特有字段
        // GameCache.Instance._mttRebuyLevel = isClear ? 0 : mtt.maxRebuyBl;
        // GameCache.Instance._mttAddCloseRebuyLevel = isClear ? 0 : mtt.addonEndBl;
        // GameCache.Instance._mttAddopRebuyLevel = isClear ? 0 : mtt.addonBeginBl;
        // GameCache.Instance._mttCurBlindLevel = isClear ? 0 : more.bl;
        // GameCache.Instance._mttForceCloseTime = isClear ? 0 : mtt.forceCloseTime;
        // GameCache.Instance._texasData._tribeId = isClear ? 0 : mtt.tribeId;
        // GameCache.Instance._tableSkin = isClear ? '' : mtt.tableclothTag;
        // GameCache.Instance._isMttHunterGame = isClear ? false : mtt.hunterOn != 0;
        // GameCache.Instance._chatType = isClear ? 0 : mtt.chatType;
        // GameCache.Instance._limitDelayTimes = isClear ? 0 : mtt.limitDelayTimes;
        // GameCache.Instance._isRoomManager = isClear ? false : this._mttDetails.isAdmin;
        // GameCache.Instance._mttSourceType = isClear ? 0 : mtt.originType;
        // GameCache.Instance._delayTimeType = isClear ? 0 : mtt.delayTimeType;
        // // if (!isClear) {
        // //     // C#: 构建盲注延迟时间表 _mttBlindDelayTimes
        // //     // for (int index = 0; index < mtt.BlindLevelDelayTimeTable.count; index++) { ... }
        // //     // TODO: 构建 _mttBlindDelayTimes 列表
        // //     // C#: UIMatchMTTModel.Instance.SetMttInfo(_mttDetails);
        // //     // TODO: 调用 UIMatchMTTModel.Instance.SetMttInfo
        // // } else {
        // //     // C#: GameCache.Instance._mttBlindDelayTimes = default;
        // //     // TODO: 清空 _mttBlindDelayTimes
        // // }
        // if (!isClear) {
        //     GameCache.Instance._mttBlindDelayTimes = new Array<typeof WebRoomCenterDelayTimeBlindLevelQuery.BlindLevel>();
        //     for (let index = 0; index < mtt.blindLevelDelayTimeTableList.length; index++) {
        //         let temp = index;
        //         GameCache.Instance._mttBlindDelayTimes.push({
        //             level: mtt.blindLevelDelayTimeTableList[temp].level,
        //             ante: mtt.blindLevelDelayTimeTableList[temp].ante,
        //             small_blind: mtt.blindLevelDelayTimeTableList[temp].smallBlind,
        //             delay_times: mtt.blindLevelDelayTimeTableList[temp].delayTimes
        //         });
        //     }
        //     //UIMatchMTTModel.Instance.SetMttInfo(_mttDetails);
        //     //UIMTTModel.MttInfo = this._mttDetails;
        // } else {
        //     GameCache.Instance._mttBlindDelayTimes = new Array<typeof WebRoomCenterDelayTimeBlindLevelQuery.BlindLevel>();
        // }
        // GameCache.Instance._mttMaxDelayTimes = isClear ? 0 : mtt.maxDelayTimes;
        // GameCache.Instance._mttAutoDelayTime = isClear ? 0 : mtt.autoDelayTime;
        // // 反作弊配置
        // GameCache.Instance._antiCheatType = isClear ? 0 : mtt.antiCheatType;
        // if (GameCache.Instance._antiCheatType == AntiCheatType.VIDEO) {
        //     GameCache.Instance._videoModel = mtt.antiCheatVideoType;
        // } else {
        //     GameCache.Instance._videoModel = 0;
        // }
        // GameCache.Instance._normalAntiCheatOrderType = isClear ? 0 : mtt.antiCheatOrderType;
        // GameCache.Instance._normalAntiCheatOrderMicType = isClear ? 0 : mtt.antiCheatOrderMicType;
        // // TODO: 反作弊顺序类型处理
        // GameCache.Instance._sngInvitationCode = isClear ? '' : mtt.sngInvitationCode;
        // GameCache.Instance._antiCheatTimeLimit = isClear ? 0 : mtt.antiCheatTimelimit;
        // GameCache.Instance._videoVerifyType = isClear ? 0 : mtt.videoVerifyType;
        // // MTT默认开启视频桌特效  & 默认不开启视频节能模式
        // GameCache.Instance._videoEffectType = isClear ? 0 : 1;
        // GameCache.Instance._videoPowerSaving = isClear ? 0 : 2;
        // GameCache.Instance._videoEffectType = isClear ? 0 : 1;
        // GameCache.Instance._videoPowerSaving = isClear ? 0 : 2;
    }

    /**
     * 加载玩法后缓存相关全局数据 - MTT版本重写
     * @param isClear 是否清理缓存数据
     */
    protected override cacheGlobalDataAfterLoad(isClear: boolean): void {
        super.cacheGlobalDataAfterLoad(isClear);
        if (!isClear) {
            // C#: DataStatisticsManager.Instance.MTTGameEnterEvent(
            //     _roomType, _matchId, _roomId, _gameType, _roomName);
            // TODO: 发送 MTT 进入事件打点
        }
    }
    // ==================== 玩法实体创建 ====================
    /**
     * 创建玩法逻辑实体
     * C#: private TexasGame CreateGameplayEntity()
     */
    private createGameplayEntity(): any {
        // C#: UI view = LaunchViewLayer();
        // C#: TexasGame game = InstantiateGameplayEntity(_roomType, view, false);
        // C#: game._isObserver = _isObserver;
        // TODO: 创建 MTT 德州玩法实体
        return null;
    }

    /**
     * 启动玩法表现层
     * C#: private UI LaunchViewLayer()
     */
    private launchViewLayer(): any {
        // C#: ScreenManager.Instance.ChangeOrientationByExitGame();
        // C#: string fromUI = _mttDetails.Mtt.SngId > 0
        //      ? UIType.UI_SNG_MATCH_DETAILS : UIType.UI_MATCH_MTT_DETAIL;
        // C#: UITexasComponent.ShowNoAnimation(fromUI, false, isReuse: ...)
        // TODO: 启动 MTT 德州表现层
        return null;
    }

    /**
     * 实例化玩法实体
     * C#: private TexasGame InstantiateGameplayEntity(RoomType roomType, UI mainView, bool fromPool = false)
     * @param roomType 玩法类型
     * @param mainView 主视图
     * @param fromPool 是否从对象池获取
     */
    private instantiateGameplayEntity(roomType: number, mainView: any, fromPool: boolean = false): any {
        console.log(`${this.constructor.name}: instantiateGameplayEntity: roomType=${roomType}, fromPool=${fromPool}`);
        // C#: switch (roomType)
        // C#:   case RoomType.MTT_TEXAS_HOLDEM_STANDARD_NO_LIMIT: ...
        // C#:     game = ComponentFactory.CreateWithId<TexasMttGame, UI, MttTexasGameplayEntrance>(...)
        // C#:   case RoomType.MTT_OMAHA4_*:
        // C#:     game = ComponentFactory.CreateWithId<TexasMttOmahaGameFour, ...>(...)
        // C#:   case RoomType.MTT_OMAHA5_*:
        // C#:     game = ComponentFactory.CreateWithId<TexasMttOmahaGameFive, ...>(...)
        // C#:   case RoomType.MTT_OMAHA6_*:
        // C#:     game = ComponentFactory.CreateWithId<TexasMttOmahaGameSix, ...>(...)
        // C#:   default: break;
        // TODO: MTT RoomType 枚举定义 (512-723 范围)
        // TODO: TexasMttGame, TexasMttOmahaGameFour/Five/Six 类
        // TODO: ComponentFactory.CreateWithId 方法
        return null;
    }
}
