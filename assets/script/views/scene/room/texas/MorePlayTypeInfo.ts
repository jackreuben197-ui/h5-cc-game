import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../../core/decorator/DataBind';
import { traceClass, traceMethod } from '../../../../core/decorator/LogTrace';
import TexasGameRoomDataBasic from '../../../../data/room/texas/TexasGameRoomDataBasic';
import TexasGameRoomDataPlayerMine from '../../../../data/room/texas/TexasGameRoomDataPlayerMine';
import { AnimateDisplayTypePlayType } from '../../../../game/constant/AnimateDisplayType';
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
    }

    public initData(mine: TexasGameRoomDataPlayerMine) {
        this._mine = mine;
        this._bindEventsAndRefresh();
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
        autoBindEvents(this, { mine: this._mine, basic: this._mine.roomData.basicInfo });
    }

    //=================== 鱿鱼 ==================================
    @bindEvent(TexasGameRoomDataPlayerMine.SHOW_SQUID_IN, 'mine')
    private onShowButton(b: boolean) {
        this.joinButton.node.active = b;
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
}
