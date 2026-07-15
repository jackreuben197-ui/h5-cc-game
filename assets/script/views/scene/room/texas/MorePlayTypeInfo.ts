import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../../core/decorator/DataBind';
import { traceClass, traceMethod } from '../../../../core/decorator/LogTrace';
import TexasGameRoomDataBasic from '../../../../data/room/texas/TexasGameRoomDataBasic';
import TexasGameRoomDataPlayerMine from '../../../../data/room/texas/TexasGameRoomDataPlayerMine';
import ccviewData, { CCViewData } from '../../../../data/system/CCViewData';
import { AnimateDisplayTypePlayType } from '../../../../game/constant/AnimateDisplayType';
import { SquidMode } from '../../../../game/constant/Squid';
import { i18nMgr } from '../../../../i18n/i18nMgr';
import { UISquidEndItemShowData } from '../../../dialog/squidover/UISquidEndItem';
import viewManager from '../../../UIViewManager';
import TexasTableEvent from './events/TexasTableEvent';

const { ccclass, property, menu } = cc._decorator;

/**
 *  更多游戏类型的绑定放这里
 */
@ccclass
@traceClass()
@menu('Scene/Room/Texas/MorePlayTypeInfo')
export default class MorePlayTypeInfo extends cc.Component {
    @property({ type: cc.Node, displayName: '根节点' })
    private rootNode: cc.Button = null!;
    @property({ type: cc.Button, displayName: '加入鱿鱼按钮' })
    private joinButton: cc.Button = null!;
    @property({ type: cc.Animation, displayName: '鱿鱼开场动画' })
    private squidStartAnimation: cc.Animation = null!;
    @property({ type: cc.Animation, displayName: '暴击开场动画' })
    private critialHitStartAnimation: cc.Animation = null!;
    @property({ type: cc.Node, displayName: '左边鱿鱼按钮' })
    private squidButton: cc.Node = null;
    @property({ type: cc.Button, displayName: '鱿鱼轮站起按钮' })
    private squidStandUp: cc.Button = null!;
    @property({ type: cc.Node, displayName: '剩余鱿鱼节点' })
    private remainingSquidCount: cc.Node = null!;
    @property({ type: cc.Node, displayName: '剩余鱿鱼数量节点' })
    private remainingSquidLabel: cc.Node = null!;
    @property({ type: cc.Label, displayName: '剩余鱿鱼数量' })
    private remainingSquidLabelCount: cc.Label = null!;
    private _mine: TexasGameRoomDataPlayerMine = null!;
    private _onJoinSquidClicked: () => void;

    protected onLoad(): void {
        //自动操作面板
        this._onJoinSquidClicked = () => {
            TexasTableEvent.JoinSquid(this._mine);
        };
        this.joinButton.node.on('click', this._onJoinSquidClicked, this);
        this.squidStartAnimation.node.active = false;
        this.squidStartAnimation.on('finished', () => {
            this.squidStartAnimation.node.active = false;
        });
        this.squidStandUp.node.on('click', this.onSquidStandUpClicked, this);
    }

    public initData(mine: TexasGameRoomDataPlayerMine) {
        this._mine = mine;
        this._bindEventsAndRefresh();
    }

    @bindEvent(CCViewData.FRAME_SIZE_UPDATE, { dataSource: 'ccviewData', initPriority: 20 })
    protected onFrameResize(
        visibleSizeWidth: number,
        visibleSizeHeight: number,
        frameSizeWidth: number,
        frameSizeHeight: number,
        suggestScale: number,
        saveAreaTop: number
    ) {
        if (suggestScale < 1) {
            this.squidButton.height = 390;
            this.joinButton.node.setPosition(0, -visibleSizeHeight / 2 + 200 * suggestScale + 440 * suggestScale);
        } else {
            this.squidButton.height = 450;
            this.joinButton.node.setPosition(0, -visibleSizeHeight / 2 + 200 * suggestScale + 520);
        }
        const squidWidget = this.squidButton.getComponent(cc.Widget);
        squidWidget.top = saveAreaTop;
        squidWidget.updateAlignment();
    }

    protected onEnable(): void {
        this._bindEventsAndRefresh();
    }

    protected onDisable(): void {
        unBindEventsAll(this);
    }

    /**
     * 托管全自动事件激活绑定
     */
    private _bindEventsAndRefresh() {
        if (!this._mine) return;
        // 统一激活绑定，注入强类型 tag 推导过滤机制
        autoBindEvents(this, { mine: this._mine, basic: this._mine.roomData.basicInfo, ccviewData: ccviewData });
    }

    //=================== 鱿鱼 ==================================
    @bindEvent(TexasGameRoomDataPlayerMine.SHOW_SQUID_IN, 'mine')
    private onShowButton(): void {
        this._refreshJoinButton();
    }

    @bindEvent(TexasGameRoomDataBasic.SQUID_ENABLED, 'basic')
    @traceMethod()
    private onSquieStatusChange(b: boolean, ant: AnimateDisplayTypePlayType = AnimateDisplayTypePlayType.Staic) {
        if (b && ant == AnimateDisplayTypePlayType.Start) {
            this.squidStartAnimation.node.active = true;
            this.squidStartAnimation.play('squid_start');
        }
    }

    @bindEvent(TexasGameRoomDataBasic.SQUID_RESULTS, { dataSource: 'basic', initIgnore: true })
    private showResults(records: UISquidEndItemShowData[]) {
        if (records.length == 0) {
            viewManager.closeDialog('SquidOver');
            return;
        }
        viewManager.openDialog('SquidOver', {
            rows: records
        });
    }

    //===================== 暴击 ==========================================

    @bindEvent(TexasGameRoomDataBasic.CRITIAL_HIT_ENABLED, 'basic')
    @traceMethod()
    private onCriticalHitStatusChange(b: boolean, ant: AnimateDisplayTypePlayType = AnimateDisplayTypePlayType.Staic) {
        if (b && ant == AnimateDisplayTypePlayType.Start) {
            this.critialHitStartAnimation.node.active = true;
            this.critialHitStartAnimation.play('critical_hit_start');
        }
    }

    @bindEvent(TexasGameRoomDataBasic.SQUID_ENABLED, 'basic')
    private onSquidStatusChanged(enabled: boolean): void {
        this.remainingSquidCount.active = enabled;
        this.remainingSquidLabel.active = enabled;
        this._refreshRemainingSquidCount();
        this._refreshSquidStandUp();
        this._refreshJoinButton();
    }

    @bindEvent(TexasGameRoomDataBasic.SQUID_REMAINING_COUNT_CHANGED, { dataSource: 'basic', initIgnore: true })
    private onSquidRemainingCountChanged(): void {
        this._refreshRemainingSquidCount();
    }

    @bindEvent(TexasGameRoomDataPlayerMine.SEATNO_CHANGED, 'mine')
    private onMineSeatChanged(): void {
        this._refreshSquidStandUp();
        this._refreshJoinButton();
    }

    private onSquidStandUpClicked(): void {
        if (this._mine.seatNo == 0) {
            viewManager.showToast(i18nMgr.Get('Good_luck'));
            return;
        }
        // 鱿鱼模式下的站起需要额外确认逻辑
        const mine = this._mine.player;
        if (this._mine.roomData.basicInfo.hasSquid && this._mine.roomData.basicInfo.squidStatusEnabled && mine.squidIn) {
            if (this._mine.roomData.basicInfo.squidMode === SquidMode.NORMAL) {
                if (mine.isKeepSeat) {
                    TexasTableEvent.CancelKeepSeat(this._mine);
                } else {
                    TexasTableEvent.Standup(this._mine);
                }
                return;
            }
            if (this._mine.roomData.basicInfo.squidMode === SquidMode.XZ) {
                if (mine.squidCount <= 0) {
                    viewManager.openDialog('ConfirmOrNotice', {
                        title: i18nMgr.Get('UIGuild_TipsTitle'),
                        content: i18nMgr.Get('UISquid_Tips3'),
                        commit: i18nMgr.Get('adaptation10012'),
                        cancel: i18nMgr.Get('adaptation10013'),
                        commit_click: () => {
                            if (mine.isKeepSeat) {
                                TexasTableEvent.CancelKeepSeat(this._mine);
                            } else {
                                TexasTableEvent.Standup(this._mine);
                            }
                        }
                    });
                }
                return;
            }
        }
        TexasTableEvent.Standup(this._mine);
    }

    private _refreshSquidStandUp(): void {
        this.squidStandUp.node.active = this._mine.roomData.basicInfo.squidStatusEnabled && this._mine.seatNo > 0;
    }

    private _refreshJoinButton(): void {
        this.joinButton.node.active =
            this._mine.roomData.basicInfo.squidStatusEnabled && this._mine.seatNo > 0 && this._mine.showSquidInButton;
    }

    private _refreshRemainingSquidCount(): void {
        const roomData = this._mine.roomData;
        if (!roomData.basicInfo.squidStatusEnabled) return;
        let playerCount = 0;
        let markedTotal = 0;
        roomData.seatsStateManager.forEachPlayer(player => {
            if (!player.squidIn) return;
            playerCount++;
            markedTotal += player.squidCount;
        });
        let total = 0;
        if (roomData.basicInfo.squidMode === SquidMode.XZ) {
            total = roomData.basicInfo.squidTotalLimit
            if (roomData.basicInfo.squidTail) total++;
        } else {
            total = Math.max(playerCount - 1, 0);
            if (roomData.basicInfo.squidHead) total++;
            if (roomData.basicInfo.squidTail) total++;
        }
        this.remainingSquidLabelCount.string = `${Math.max(0, total - markedTotal)}`;
    }
}
