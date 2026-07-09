import { TexasChatMessage } from '../../../data/room/texas/TexasGameRoomDataChat';
import RemoteSprite from '../../widget/RemoteSprite';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('Dialog/Chat/ChatMsgItem')
export default class ChatMsgItem extends cc.Component {
    @property({ type: cc.Label, displayName: '聊天内容 chatContent' })
    private chatContentLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: '用户名 userName' })
    private userNameLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: '时间 time' })
    private timeLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: '性别图标-男 male' })
    private maleNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '性别图标-女 female' })
    private femaleNode: cc.Node = null;
    @property({ type: cc.Sprite, displayName: '头像 Round' })
    private avatarSprite: cc.Sprite = null;

    public initData(msg: TexasChatMessage): void {
        this.chatContentLabel.string = msg.content;
        this.userNameLabel.string = msg.name;
        this.timeLabel.string = msg.time;
        this.maleNode.active = msg.sex === 1;
        this.femaleNode.active = msg.sex === 2;
        if (msg.headUrl) {
            let remote = this.avatarSprite.getComponent(RemoteSprite);
            if (!remote) {
                remote = this.avatarSprite.addComponent(RemoteSprite);
            }
            remote.url = msg.headUrl;
        }
    }
}
