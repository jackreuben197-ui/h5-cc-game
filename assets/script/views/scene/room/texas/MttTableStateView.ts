import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../../core/decorator/DataBind';
import { createLogger } from '../../../../core/decorator/LogTrace';
import TexasGameRoomData from '../../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataMtt from '../../../../data/room/texas/TexasGameRoomDataMtt';
import mttRoomLifecycle from '../../../../game/MttRoomLifecycle';
import { CPErrorCode } from '../../../../i18n/CPErrorCode';
import { i18nMgr } from '../../../../i18n/i18nMgr';
import viewManager from '../../../UIViewManager';
import TexasTableEvent from './events/TexasTableEvent';

const { ccclass, menu } = cc._decorator;

const _plog = createLogger('MttTableStateView');

const TIMER_INTERVAL_MS = 1000;

const ROTATING_TIP_INTERVAL_SECONDS = 4;

const MTT_NODE_NAMES = {
    addOn: 'Button_AddOn',
    cancelTrust: 'Button_CancelTrust',
    countDownOverlay: 'Image_WaitForStartTips',
    redistributionTips: 'Image_RedistributionTips',
    bubbleTips: 'Image_WaitForStartBathTips',
    tipLabel: 'Text_Tips'
};

const BUBBLE_TIP_KEYS = ['UIBathTip001', 'UIBathTip002', 'UIBathTip003'];

const TRANSFER_TIP_KEYS = ['MTTroomNum_001', 'MTTroomNum_002', 'MTTroomNum_003', 'MTTroomNum_004', 'MTTroomNum_005', 'MTTroomNum_006', 'MTTroomNum_007'];

@ccclass
@menu('Scene/Room/Texas/MttTableStateView')
export default class MttTableStateView extends cc.Component {
    private _roomData: TexasGameRoomData = null;
    private _addOnNode: cc.Node = null;
    private _addOnButton: cc.Button = null;
    private _cancelTrustNode: cc.Node = null;
    private _cancelTrustButton: cc.Button = null;
    private _startTipsNode: cc.Node = null;
    private _startTipsLabel: cc.Label = null;
    private _redistributionTipsNode: cc.Node = null;
    private _redistributionTipsLabel: cc.Label = null;
    private _bubbleTipsNode: cc.Node = null;
    private _bubbleTipsLabel: cc.Label = null;
    private _tipsIndex: number = 0;
    private _timer: ReturnType<typeof setInterval> = null;
    private _breakOverlayVisible: boolean = false;

    public initialize(roomData: TexasGameRoomData): void {
        unBindEventsAll(this);
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
        this._addOnButton?.node.targetOff(this);
        this._cancelTrustButton?.node.targetOff(this);
        this._roomData = roomData;
        this._tipsIndex = 0;
        this._breakOverlayVisible = false;
        // 复用牌桌现有节点，不再为开赛和休息维护两套倒计时 UI。
        this._addOnNode = this._findNode(this.node, MTT_NODE_NAMES.addOn);
        this._cancelTrustNode = this._findNode(this.node, MTT_NODE_NAMES.cancelTrust);
        this._startTipsNode = this._findNode(this.node, MTT_NODE_NAMES.countDownOverlay);
        this._redistributionTipsNode = this._findNode(this.node, MTT_NODE_NAMES.redistributionTips);
        this._bubbleTipsNode = this._findNode(this.node, MTT_NODE_NAMES.bubbleTips);
        this._addOnButton = this._findButton(this._addOnNode);
        this._cancelTrustButton = this._findButton(this._cancelTrustNode);
        this._startTipsLabel = this._findLabel(this._startTipsNode, MTT_NODE_NAMES.tipLabel);
        this._redistributionTipsLabel = this._findLabel(this._redistributionTipsNode, MTT_NODE_NAMES.tipLabel);
        this._bubbleTipsLabel = this._findLabel(this._bubbleTipsNode, MTT_NODE_NAMES.tipLabel);
        this._addOnButton?.node.on('click', this.onAddOnClicked, this);
        this._cancelTrustButton?.node.on('click', this.onCancelTrustClicked, this);
        autoBindEvents(this, { mtt: roomData.mtt });
        this._startTimer();
        this._render();
    }

    protected onEnable(): void {
        if (!this._roomData || this._timer) return;
        autoBindEvents(this, { mtt: this._roomData.mtt });
        this._startTimer();
        this._render();
    }

    protected onDisable(): void {
        unBindEventsAll(this);
        if (this._timer) {
            clearInterval(this._timer);
            this._timer = null;
        }
    }

    @bindEvent(TexasGameRoomDataMtt.STATE_CHANGED, 'mtt')
    private onMttStateChanged(): void {
        this._render();
    }

    @bindEvent(TexasGameRoomDataMtt.ADDON_RESULT, { dataSource: 'mtt', initIgnore: true })
    private onMttAddOnResult(status: number): void {
        if (status == 0) {
            viewManager.showToast(i18nMgr.Get('AddGcg'));
        } else {
            viewManager.showToast(CPErrorCode.ServerErrorDescription(status));
        }
    }

    @bindEvent(TexasGameRoomDataMtt.AUTO_OP_RESULT, { dataSource: 'mtt', initIgnore: true })
    private onMttAutoOpResult(status: number): void {
        if (status == 0) {
            viewManager.showToast(i18nMgr.Get('Hosting_surre'));
        } else {
            viewManager.showToast(CPErrorCode.ServerErrorDescription(status));
        }
    }

    @bindEvent(TexasGameRoomDataMtt.SETTLEMENT_REQUESTED, { dataSource: 'mtt', initIgnore: true })
    private onMttSettlementRequested(rebuy: boolean): void {
        mttRoomLifecycle.showSettlement(this._roomData, rebuy);
    }

    @bindEvent(TexasGameRoomDataMtt.REENTER_REQUESTED, { dataSource: 'mtt', initIgnore: true })
    private onMttReenterRequested(): void {
        mttRoomLifecycle.reenter(this._roomData);
    }

    @bindEvent(TexasGameRoomDataMtt.NOTICE, { dataSource: 'mtt', initIgnore: true })
    private onMttNotice(i18nKey: string): void {
        viewManager.showToast(i18nMgr.Get(i18nKey));
    }

    @bindEvent(TexasGameRoomDataMtt.ROOM_READY, { dataSource: 'mtt', initIgnore: true })
    private onMttRoomReady(roomID: number): void {
        mttRoomLifecycle.exchangeRoom(this._roomData, roomID);
    }

    @bindEvent(TexasGameRoomDataMtt.BREAK_REMINDER, { dataSource: 'mtt', initIgnore: true })
    private onMttBreakReminder(minutesToStart: number, durationMinutes: number): void {
        // 休息预告沿用 pokerqueen 的本地化占位符规则。
        const timeText = `${minutesToStart}${i18nMgr.Get('UIClubData_Text_time')}`;
        const message = i18nMgr.Get('timeBeforeBreakNotice').replace('{time}', timeText).replace('{duration}', String(durationMinutes));
        viewManager.showToast(message);
    }

    private onAddOnClicked(): void {
        if (this._roomData) {
            TexasTableEvent.MttAddOn(this._roomData);
        }
    }

    private onCancelTrustClicked(): void {
        if (this._roomData) {
            TexasTableEvent.MttSetAutoOp(this._roomData, false);
        }
    }

    private _render(): void {
        const roomData = this._roomData;
        if (!roomData) return;
        const mtt = roomData.mtt;
        const player = roomData.seatsStateManager.getSeatPlayer(roomData.mine.seatNo);
        const addOnMode = mtt.currentAddOnMode;
        if (this._addOnNode) {
            this._addOnNode.active = mtt.displayAddOnMode != 0;
        }
        if (this._addOnButton) {
            this._addOnButton.interactable = addOnMode != 0 && !mtt.addOnPending;
        }
        if (this._cancelTrustNode) {
            // 开启托管放在 MTT 菜单，牌桌常驻按钮只负责取消托管。
            this._cancelTrustNode.active = !!player?.isAuto;
        }
        const nowSeconds = Math.floor(Date.now() / 1000);
        const startSeconds = mtt.getStartRemainingSeconds(nowSeconds);
        const breakSeconds = mtt.getBreakRemainingSeconds(nowSeconds);
        const showBreak = mtt.shouldShowBreak(nowSeconds);
        if (showBreak != this._breakOverlayVisible) {
            this._breakOverlayVisible = showBreak;
        }
        if (this._startTipsNode) {
            // 休息浮层优先级高于开赛倒计时，两种状态共用同一背景和文本。
            this._startTipsNode.active = showBreak || (!mtt.gameStarted && startSeconds > 0);
        }
        if (this._startTipsLabel) {
            if (showBreak) {
                this._startTipsLabel.string = this._formatBreakText(mtt, breakSeconds, !!player?.seated);
            } else if (!mtt.gameStarted && startSeconds > 0) {
                // 开赛浮层沿用 pokerqueen 的“赛事名称 + 倒计时”结构。
                this._startTipsLabel.string = `${mtt.matchName}\n${this._formatDuration(startSeconds)}`;
            }
        }
        if (this._bubbleTipsNode) {
            // 休息窗口优先于泡沫等待，避免 UIBathTip 文案覆盖 RefreshBreakTip 文案。
            this._bubbleTipsNode.active = mtt.bubbleWaiting && !mtt.breakWindowActive;
        }
        if (this._bubbleTipsLabel && mtt.bubbleWaiting && !mtt.breakWindowActive) {
            const bubbleKey = BUBBLE_TIP_KEYS[Math.floor(this._tipsIndex / ROTATING_TIP_INTERVAL_SECONDS) % BUBBLE_TIP_KEYS.length];
            this._bubbleTipsLabel.string = i18nMgr.Get(bubbleKey);
        }
        if (this._redistributionTipsNode) {
            // 休息期间不显示拆合桌提示，服务端结束休息后再恢复对应业务状态。
            this._redistributionTipsNode.active = !mtt.breakWindowActive && (mtt.redistributionWaiting || mtt.tableTransferWaiting);
        }
        if (this._redistributionTipsLabel && !mtt.breakWindowActive && (mtt.redistributionWaiting || mtt.tableTransferWaiting)) {
            const transferKey = TRANSFER_TIP_KEYS[Math.floor(this._tipsIndex / ROTATING_TIP_INTERVAL_SECONDS) % TRANSFER_TIP_KEYS.length];
            this._redistributionTipsLabel.string = i18nMgr.Get(transferKey);
        }
    }

    private _startTimer(): void {
        this._timer = setInterval(() => {
            this._tipsIndex++;
            // 定时状态刷新负责确认待休息，渲染方法只读取已经确定的状态。
            this._roomData?.mtt.updateBreakPresentation();
            this._render();
        }, TIMER_INTERVAL_MS);
    }

    private _formatBreakText(mtt: TexasGameRoomDataMtt, seconds: number, isSeated: boolean): string {
        const countDown = this._formatDuration(seconds);
        if (!isSeated) {
            return `${i18nMgr.Get('playerInBreakState')}\n${countDown}`;
        }
        if (mtt.breakType == TexasGameRoomDataMtt.BREAK_TYPE_FINAL) {
            return `${i18nMgr.Get('adjustStateBeforeFinal')}\n${countDown}`;
        }
        // 对齐旧版 RefreshBreakTip：普通休息把倒计时填入“{time}后比赛继续进行”。
        return i18nMgr.Get('timeAfterMatchResume').replace('{time}', countDown);
    }

    private _findNode(root: cc.Node, name: string): cc.Node | null {
        if (!root) return null;
        if (root.name == name) return root;
        for (const child of root.children) {
            const result = this._findNode(child, name);
            if (result) return result;
        }
        return null;
    }

    private _findButton(root: cc.Node): cc.Button | null {
        if (!root) return null;
        const direct = root.getComponent(cc.Button);
        if (direct) return direct;
        for (const child of root.children) {
            const result = this._findButton(child);
            if (result) return result;
        }
        return null;
    }

    private _findLabel(root: cc.Node, name: string): cc.Label | null {
        const node = this._findNode(root, name);
        return node?.getComponent(cc.Label) || null;
    }

    private _formatDuration(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainder = seconds % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${remainder < 10 ? '0' : ''}${remainder}`;
    }
}
