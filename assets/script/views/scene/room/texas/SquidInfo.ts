import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../../core/decorator/DataBind';
import { traceClass, traceMethod } from '../../../../core/decorator/LogTrace';
import TexasGameRoomDataPlayerMine from '../../../../data/room/texas/TexasGameRoomDataPlayerMine';
import TexasTableEvent from './events/TexasTableEvent';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@traceClass()
@menu('Scene/Room/Texas/SquidInfo')
export default class SquidInfo extends cc.Component {
    @property({ type: cc.Node, displayName: '根节点' })
    private rootNode: cc.Button = null!;
    @property({ type: cc.Button, displayName: '加入鱿鱼按钮' })
    private joinButton: cc.Button = null!;
    private _mine: TexasGameRoomDataPlayerMine = null!;
    private _onJoinSquidClicked: () => void;

    protected onLoad(): void {
        //自动操作面板
        this._onJoinSquidClicked = () => {
            TexasTableEvent.JoinSquid(this._mine);
        };
        this.joinButton.node.on('click', this._onJoinSquidClicked, this);
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
        autoBindEvents(this, { mine: this._mine });
    }

    @bindEvent(TexasGameRoomDataPlayerMine.SHOW_SQUID_IN, 'mine')
    @traceMethod({ level: 'debug' })
    private onShowButton(b: boolean) {
        this.joinButton.node.active = b;
    }
}
