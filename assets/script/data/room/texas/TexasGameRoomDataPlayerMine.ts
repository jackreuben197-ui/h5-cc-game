import { Def, RoomAdmin } from '@silenthill/agreement-web';
import { bindData, IObservableBindings, observable, pureEvent } from '../../../core/decorator/DataBind';
import { traceClass } from '../../../core/decorator/LogTrace';
import { handValueTypeToString } from '../../../core/poker/PoerkCard';
import { getMaxHandValueByPokeType } from '../../../core/poker/PokerUtil';
import { AutoOperationTypeTexas } from '../../../game/constant/AutoOpertaionType';
import { ButtonState } from '../../../game/constant/Constants';
import agoraManager from '../../../net/agora/AgoraManager';
import { OperatorMine } from './model/Operator';
import TexasGameRoomData from './TexasGameRoomData';
import TexasGameRoomDataPlayer from './TexasGameRoomDataPlayer';

interface TexasGameRoomDataPlayerMine extends IObservableBindings<TexasGameRoomDataPlayerMine> {}

@bindData()
@traceClass()
class TexasGameRoomDataPlayerMine extends cc.EventTarget {
    public static readonly STORECHIPS_CHANGE = 'STORECHIPS_CHANGE';
    public static readonly STORE_CHIPS_RESULT = 'STORE_CHIPS_RESULT';
    public static readonly PREPARE_OPERATION_MINE = 'PREPARE_OPERATION_MINE';
    public static readonly TOTAL_CHIPS = 'TOTAL_CHIPS'; // 在这个牌桌上的所有输赢的总和
    public static readonly TABLE_USER_DEPOSIT = 'TABLE_USER_DEPOSIT';
    public static readonly HIGHLIGHT_CARDS = 'HIGHLIGHT_CARDS';
    public static readonly SEATNO_CHANGED = 'SEATNO_CHANGED';
    public static readonly HAND_VALUE_TYPE_CHANGE = 'HAND_VALUE_TYPE_CHANGE';
    public static readonly AUTO_OPERATION_TYPE_CHANGE = 'AUTO_OPERATION_TYPE_CHANGE';
    public static readonly VALID_AUTO_OPERATIONS_CHANGE = 'VALID_AUTO_OPERATIONS_CHANGE';
    public static readonly SHOW_SQUID_IN = 'SHOW_SQUID_IN';
    public static readonly SHOW_VIEW_PLAYER_CARDS_BUTTON = 'SHOW_VIEW_PLAYER_CARDS_BUTTON';
    public static readonly VIEW_PLAYER_CARDS_COST = 'VIEW_PLAYER_CARDS_COST';
    public static readonly SHOW_VIEW_PUBLIC_CARDS_BUTTON = 'SHOW_VIEW_PUBLIC_CARDS_BUTTON';
    public static readonly VIEW_PUBLIC_CARDS_COST = 'VIEW_PUBLIC_CARDS_COST';
    public static readonly LOCAL_CAMERA_STATE_CHANGE = 'LOCAL_CAMERA_STATE_CHANGE';
    public static readonly LOCAL_CAMERA_BTN_STATE_CHANGE = 'LOCAL_CAMERA_BTN_STATE_CHANGE';
    public static readonly LOCAL_CAMERA_STATE_CHANGE_DELAY = 'LOCAL_CAMERA_STATE_CHANGE_DELAY';
    public static readonly LOCAL_MICROPHONE_STATE_CHANGE = 'LOCAL_MICROPHONE_STATE_CHANGE';
    public static readonly LOCAL_MICROPHONE_BTN_STATE_CHANGE = 'LOCAL_MICROPHONE_BTN_STATE_CHANGE';
    public static readonly VIDEO_MASK_BTN_STATE_CHAGE = 'VIDEO_MASK_BTN_STATE_CHAGE';
    public static readonly REMOTE_CAMERA_STATE_CHANGE = 'REMOTE_CAMERA_STATE_CHANGE';
    public static readonly REMOTE_MICROPHONE_ENABLED_CHANGE = 'REMOTE_MICROPHONE_ENABLED_CHANGE';
    public static readonly RANDOM_VIDEO_ACTIVE_CHANGE = 'RANDOM_VIDEO_ACTIVE_CHANGE';
    public static readonly RANDOM_VIDEO_END_TIME_CHANGE = 'RANDOM_VIDEO_END_TIME_CHANGE';
    public static readonly ROOM_ADMIN_PERMISSIONS_CHANGE = 'ROOM_ADMIN_PERMISSIONS_CHANGE';
    public static readonly CALL_TIME_CHANGE = 'CALL_TIME_CHANGE';
    private _roomData: TexasGameRoomData;
    public get roomData() {
        return this._roomData;
    }

    constructor(roomData: TexasGameRoomData) {
        super();
        this._roomData = roomData;
    }

    @observable(TexasGameRoomDataPlayerMine.STORECHIPS_CHANGE)
    public storeChips: number = 0;

    @pureEvent(TexasGameRoomDataPlayerMine.STORE_CHIPS_RESULT)
    public storeChipsResult(status: number) {}

    @observable(TexasGameRoomDataPlayerMine.PREPARE_OPERATION_MINE)
    public operator: OperatorMine = null;
    @observable(TexasGameRoomDataPlayerMine.TOTAL_CHIPS)
    public totalChips: number = 0;
    @observable(TexasGameRoomDataPlayerMine.TABLE_USER_DEPOSIT)
    public deposit: number = 0;
    @observable(TexasGameRoomDataPlayerMine.ROOM_ADMIN_PERMISSIONS_CHANGE)
    public isRoomManager: boolean = false;
    @observable(TexasGameRoomDataPlayerMine.ROOM_ADMIN_PERMISSIONS_CHANGE)
    public cnaDisbandRoom: boolean = false;
    @observable(TexasGameRoomDataPlayerMine.ROOM_ADMIN_PERMISSIONS_CHANGE)
    public canAdminStandUp: boolean = false;
    @observable(TexasGameRoomDataPlayerMine.ROOM_ADMIN_PERMISSIONS_CHANGE)
    public canAdminLeave: boolean = false;
    @observable(TexasGameRoomDataPlayerMine.ROOM_ADMIN_PERMISSIONS_CHANGE)
    public canAdminViewVideo: boolean = false;

    @pureEvent(TexasGameRoomDataPlayerMine.HIGHLIGHT_CARDS)
    public highlightCards(cards: number[]) {}

    // 真实状态(摄像机)
    @observable(TexasGameRoomDataPlayerMine.LOCAL_CAMERA_STATE_CHANGE)
    public localCameraEnabled: boolean = false;
    // 延迟渲染（摄像头)
    @observable(TexasGameRoomDataPlayerMine.LOCAL_CAMERA_STATE_CHANGE_DELAY)
    public localCameraEnabledDelayed: boolean = false;
    // 按钮（摄像头）
    @observable(TexasGameRoomDataPlayerMine.LOCAL_CAMERA_BTN_STATE_CHANGE)
    public localCameraBtnState: ButtonState = ButtonState.DISABLE;
    // 真实状态（麦克风）
    @observable(TexasGameRoomDataPlayerMine.LOCAL_MICROPHONE_STATE_CHANGE)
    public localMicrophoneEnabled: boolean = false;
    // 按钮（麦克风）
    @observable(TexasGameRoomDataPlayerMine.LOCAL_MICROPHONE_BTN_STATE_CHANGE)
    public localMicrophoneBtnState: ButtonState = ButtonState.DISABLE;
    // 按钮（节能）
    @observable(TexasGameRoomDataPlayerMine.VIDEO_MASK_BTN_STATE_CHAGE)
    public maskBtnState: ButtonState = ButtonState.DISABLE;
    //public maskBtnIncludeDisable: boolean = false;
    @observable(TexasGameRoomDataPlayerMine.REMOTE_CAMERA_STATE_CHANGE)
    public remoteCameraEnabled: ButtonState = ButtonState.HIDDEN;
    @observable(TexasGameRoomDataPlayerMine.REMOTE_MICROPHONE_ENABLED_CHANGE)
    public remoteMicrophoneEnabled: ButtonState = ButtonState.HIDDEN;
    public get needVideoPermision() {
        return this._roomData.basicInfo.antiCheatConfig.isInVideoRoom;
    }

    public async clearVideoAndAudio() {
        this.randomVideoActive = false;
        this.randomVideoEndTime = 0;
        await agoraManager.disableCamera();
        await agoraManager.disableMicrophone();
        this.muteEvents();
        this.localCameraBtnState = ButtonState.DISABLE;
        this.localMicrophoneBtnState = ButtonState.DISABLE;
        this.remoteCameraEnabled = ButtonState.HIDDEN;
        this.remoteMicrophoneEnabled = ButtonState.HIDDEN;
        this.unmuteEvents();
    }

    public updateRoomAdminPermissions(roomAdmin: RoomAdmin.AsObject | null): void {
        this.muteEvents();
        this.isRoomManager = !!roomAdmin?.isAdmin;
        this.cnaDisbandRoom = this.isRoomManager && roomAdmin?.disbandRoom == 1;
        this.canAdminStandUp = this.isRoomManager && roomAdmin?.userStandUp == 1;
        this.canAdminLeave = this.isRoomManager && roomAdmin?.userLeave == 1;
        this.canAdminViewVideo = this.isRoomManager && roomAdmin?.viewVideo == 1;
        this.unmuteEvents();
        this.emit(TexasGameRoomDataPlayerMine.ROOM_ADMIN_PERMISSIONS_CHANGE);
    }
    // ==================== 随机视频验证状态 ====================
    /** 是否正在随机视频验证中 */
    @observable(TexasGameRoomDataPlayerMine.RANDOM_VIDEO_ACTIVE_CHANGE)
    public randomVideoActive: boolean = false;
    /** 随机视频验证结束时间戳（毫秒），0 表示未在验证 */
    @observable(TexasGameRoomDataPlayerMine.RANDOM_VIDEO_END_TIME_CHANGE)
    public randomVideoEndTime: number = 0;
    // 如果有座位,座位号 > 0
    @observable(TexasGameRoomDataPlayerMine.SEATNO_CHANGED)
    public seatNo: number = 0;
    public get player(): TexasGameRoomDataPlayer | null {
        if (this.seatNo == 0) return null;
        return this.roomData.seatsStateManager.getSeatPlayer(this.seatNo);
    }
    // 纯本地记录自动带上桌(wallet)
    public autoOnTableLocal: number = 0;
    // 当前货币的卡包俱乐部ID(真实ID,非RID)
    private _currentWalletClubID: number = 0;
    public get currentWalletClubID() {
        return this._currentWalletClubID;
    }
    public set currentWalletClubID(v: number) {
        this._currentWalletClubID = v;
        this.tmpCurrentWalletClubID = v;
    }
    public tmpCurrentWalletClubID: number = 0;
    // calltime当前连续手数
    @observable(TexasGameRoomDataPlayerMine.CALL_TIME_CHANGE)
    public callTimeCount: number = 0;
    // callTimeStay 满足盈利条件后是否必须留桌打满手数
    @observable(TexasGameRoomDataPlayerMine.CALL_TIME_CHANGE)
    public callTimeStay: boolean = false;
    // public videoMaskId: number = 0;
    @observable(TexasGameRoomDataPlayerMine.HAND_VALUE_TYPE_CHANGE)
    public handValueType: string = '';
    private _autoOperationType: AutoOperationTypeTexas = AutoOperationTypeTexas.NO;
    public get autoOperationType() {
        return this._autoOperationType;
    }
    public set autoOperationType(t: AutoOperationTypeTexas) {
        if (this._autoOperationType == t) return;
        const old = this._autoOperationType;
        this._autoOperationType = t;
        this.autoOperationTypeChange(old, this._autoOperationType);
    }

    @pureEvent(TexasGameRoomDataPlayerMine.AUTO_OPERATION_TYPE_CHANGE)
    private autoOperationTypeChange(oldType: AutoOperationTypeTexas, newType: AutoOperationTypeTexas) {}

    private _rightPannel: AutoOperationTypeTexas = AutoOperationTypeTexas.NO;
    private _rightPaneelNumber: number = 0;
    public get rightPannel() {
        return this._rightPannel;
    }

    public setRightAutoOpPannel(rightAutoOpType: AutoOperationTypeTexas, amount: number) {
        if (this._rightPannel == rightAutoOpType && amount == this._rightPaneelNumber) return;
        this._rightPannel = rightAutoOpType;
        this._rightPaneelNumber = amount;
        this.setRightAutoOpPannelEmit(this._rightPannel, this._rightPaneelNumber);
    }

    @pureEvent(TexasGameRoomDataPlayerMine.VALID_AUTO_OPERATIONS_CHANGE, {
        initParams() {
            return [this._rightPannel, this._rightPaneelNumber];
        }
    })
    private setRightAutoOpPannelEmit(rightAutoOpType: AutoOperationTypeTexas, amount: number) {}

    @observable(TexasGameRoomDataPlayerMine.SHOW_SQUID_IN)
    public showSquidInButton: boolean = false;
    @observable(TexasGameRoomDataPlayerMine.SHOW_VIEW_PLAYER_CARDS_BUTTON, { forceEmit: true })
    public showViewPlayerCardsButton: boolean = false;
    @observable(TexasGameRoomDataPlayerMine.VIEW_PLAYER_CARDS_COST)
    public viewPlayerCardsCost: number = 0;
    @observable(TexasGameRoomDataPlayerMine.SHOW_VIEW_PUBLIC_CARDS_BUTTON, { forceEmit: true })
    public showViewPublicCardsButton: boolean = false;
    @observable(TexasGameRoomDataPlayerMine.VIEW_PUBLIC_CARDS_COST)
    public viewPublicCardsCost: number = 0;
    public isPlaying: boolean = false;

    /** 计算当前能带入的上下限 */
    public caculateCanBringMinMax() {
        let needDeposit = this.roomData.basicInfo.deposit;
        let totalChips = 0;
        needDeposit = needDeposit - this.deposit;
        totalChips = this.totalChips;
        let step = this.roomData.basicInfo.sbante.sb * 2;
        let minAmount = this.roomData.basicInfo.curMinRate * step;
        minAmount += needDeposit;
        const maxAmount = this.roomData.basicInfo.curMaxRate * step - totalChips;
        return {
            minAmount,
            maxAmount,
            step,
            needDeposit: needDeposit > 0
        };
    }

    /** 计算手牌牌型并高亮 */
    public caculateHandValueTypeAndHighlight() {
        if (this.seatNo == 0) return;
        const mineSeatPlayer = this.player;
        if (
            mineSeatPlayer.action != Def.Action.FOLD &&
            mineSeatPlayer.cards.length > 0 &&
            mineSeatPlayer.cards.filter(v => v == 0).length == 0 &&
            this.roomData.publicCards.publicCards.length > 0
        ) {
            const hv = getMaxHandValueByPokeType(this.roomData.publicCards.publicCards, mineSeatPlayer.cards, this.roomData.basicInfo.pokerType);
            //牌型显示
            this.handValueType = handValueTypeToString(hv.handValueType);
            const sets = new Set(hv.rawCards());
            //牌型高亮
            this.highlightCards(mineSeatPlayer.cards.filter(v => sets.has(v)));
            //公共牌高亮
            this.roomData.publicCards.higlightPublicards(this.roomData.publicCards.publicCards.filter(v => sets.has(v)));
        }
    }

    /** 根据自动操作类型做自动修正 */
    public caculateValidAutoOperationType(roundBet: number) {
        if (this.seatNo == 0) return;
        const mineSeatPlayer = this.player;
        // 前人全部check || 我是最后一个BB选手
        if (roundBet == 0 || (!mineSeatPlayer.roundActioned && roundBet == mineSeatPlayer.roundBet)) {
            this.setRightAutoOpPannel(AutoOperationTypeTexas.AUTO_CHECK, 0);
            return;
        }
        // 筹码足够CALL
        if (roundBet > 0 && mineSeatPlayer.chip > roundBet - mineSeatPlayer.roundBet) {
            this.setRightAutoOpPannel(AutoOperationTypeTexas.AUTO_CALL, roundBet - mineSeatPlayer.roundBet);
            // 没选中,则重置
            if (this.autoOperationType != AutoOperationTypeTexas.AUTO_CALL && this.autoOperationType != AutoOperationTypeTexas.AUTO_FOLD) {
                this.autoOperationType = AutoOperationTypeTexas.NO;
            }
            return;
        }
        // 筹码不够CALL只能ALLIN
        if (roundBet > 0 && mineSeatPlayer.chip <= roundBet - mineSeatPlayer.roundBet) {
            this.setRightAutoOpPannel(AutoOperationTypeTexas.AUTO_ALLIN, mineSeatPlayer.chip);
            // 没选中,则重置
            if (this.autoOperationType != AutoOperationTypeTexas.AUTO_ALLIN && this.autoOperationType != AutoOperationTypeTexas.AUTO_FOLD) {
                this.autoOperationType = AutoOperationTypeTexas.NO;
            }
            return;
        }
    }

    public roundReset() {
        if (this.seatNo == 0) return;
        this.autoOperationType = AutoOperationTypeTexas.NO;
        const mineSeatPlayer = this.player;
        if (mineSeatPlayer.canOpearate) {
            this.setRightAutoOpPannel(AutoOperationTypeTexas.AUTO_CHECK, 0);
        } else {
            this.setRightAutoOpPannel(AutoOperationTypeTexas.NO, 0);
        }
    }

    public handStart() {
        this.isPlaying = true;
        this.showViewPlayerCardsButton = false;
        this.showViewPublicCardsButton = false;
    }

    public handEnd() {
        if (this.seatNo == 0) return;
        this.setRightAutoOpPannel(AutoOperationTypeTexas.NO, 0);
        this.autoOperationType = AutoOperationTypeTexas.NO;
        this.isPlaying = false;
    }

    public handClear() {
        this.handValueType = '';
        this.showViewPlayerCardsButton = false;
        this.showViewPublicCardsButton = false;
    }

    public clearData() {
        this.seatNo = 0;
        //this.muteEvents();
        this.storeChips = 0;
        this.totalChips = 0;
        this.deposit = 0;
        //this.unmuteEvents();
        this.handValueType = '';
        this.showViewPlayerCardsButton = false;
        this.showViewPublicCardsButton = false;
        this.setRightAutoOpPannel(AutoOperationTypeTexas.NO, 0);
        this.autoOperationType = AutoOperationTypeTexas.NO;
        this.callTimeCount = 0;
        this.callTimeStay = false;
    }
}

export default TexasGameRoomDataPlayerMine;
