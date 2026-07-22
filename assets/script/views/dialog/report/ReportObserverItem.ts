import { TexasReportObserver } from '../../../data/room/texas/TexasGameRoomDataReport';
import { StringHelper } from '../../../helper/StringHelper';
import RemoteSprite from '../../widget/RemoteSprite';

const { ccclass, property, menu } = cc._decorator;

// 观众头像和名字都在条目自己内部处理，主面板不用认识子节点。
@ccclass
@menu('Dialog/Report/ReportObserverItem')
export default class ReportObserverItem extends cc.Component {
    @property({ type: cc.Node, displayName: '头像节点 icon' })
    private avatarNode: cc.Node = null;
    @property({ type: cc.Label, displayName: '昵称 Text_Name' })
    private nameLabel: cc.Label = null;
    private _observer: TexasReportObserver = null;
    private _onClick: (observer: TexasReportObserver) => void = null;

    protected onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onItemClicked, this);
    }

    protected onDestroy(): void {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onItemClicked, this);
    }

    public show(observer: TexasReportObserver, onClick: (observer: TexasReportObserver) => void): void {
        this._observer = observer;
        this._onClick = onClick;
        this.nameLabel.string = StringHelper.LengthNick(observer.name || '');
        if (observer.avatar) {
            // 头像地址有值时才启动远程图片加载。
            const remoteSprite = this.avatarNode.getComponent(RemoteSprite) || this.avatarNode.addComponent(RemoteSprite);
            remoteSprite.url = observer.avatar;
        }
    }

    private onItemClicked(): void {
        if (this._observer && this._onClick) this._onClick(this._observer);
    }

}
