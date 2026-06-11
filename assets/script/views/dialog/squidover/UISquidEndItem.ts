import { traceClass, traceMethod } from '../../../core/decorator/LogTrace';
import { StringHelper } from '../../../helper/StringHelper';
import { i18nMgr } from '../../../i18n/i18nMgr';
import RemoteSprite from '../../widget/RemoteSprite';

export interface UISquidEndItemShowData {
    userID: number;
    nick: string;
    avatar: string;
    money: number;
    squidNum: number;
    rate: number;
    isPunish: boolean;
}

const { property, menu, ccclass } = cc._decorator;

@ccclass
@traceClass()
export default class UISquidEndItem extends cc.Component {
    @property({ type: RemoteSprite, displayName: '头像' })
    private memberIcon: RemoteSprite = null;
    @property({ type: cc.Label, displayName: '名字' })
    private memberNameTxt: cc.Label = null;
    @property({ type: cc.Label, displayName: 'ID' })
    private memberIDTxt: cc.Label = null;
    @property({ type: cc.RichText, displayName: '成绩' })
    private memberScoreTxt: cc.RichText = null;
    @property({ type: cc.Node, displayName: '落败节点' })
    private squidLose: cc.Node = null;
    @property({ type: cc.Node, displayName: '奖励背景' })
    private rewardBg: cc.Node = null;
    @property({ type: cc.Node, displayName: '倍率' })
    private rateLabel: cc.RichText = null;

    @traceMethod()
    public Refresh(data: UISquidEndItemShowData): void {
        if (this.memberNameTxt) {
            this.memberNameTxt.string = StringHelper.LengthNick(data.nick || '-');
        }
        if (this.memberIDTxt) {
            this.memberIDTxt.string = `ID:${data.userID || 0}`;
        }
        if (this.memberScoreTxt) {
            const scoreColor = data.money > 0 ? '#B0FFAE' : data.money < 0 ? '#FF7C7C' : '#EEF5FF';
            this.memberScoreTxt.string = `<color=${scoreColor}>${StringHelper.GetSignedLongString(data.money || 0)}</color>`;
        }
        if (this.squidLose) {
            this.squidLose.active = (data.money || 0) < 0;
        }
        const showRate = !data.isPunish && (data.rate || 0) > 0;
        if (this.rewardBg) {
            this.rewardBg.active = showRate;
        }
        if (this.rateLabel && showRate) {
            this.rateLabel.string = `<color=#FFFC5F>${data.rate}x</color> <color=#FFFFFF>${i18nMgr.Get('UISquidEndReward')}</color>`;
        }
        if (this.memberIcon) {
            this.memberIcon.url = data.avatar;
        }
    }
    // private CacheRefs(): void {
    //     if (this.memberIcon) {
    //         return;
    //     }
    //     this.memberIcon = cc.find('MemberIcon', this.node)?.getComponent(cc.Sprite);
    //     this.memberNameTxt = cc.find('MemberNameTxt', this.node)?.getComponent(cc.Label);
    //     this.memberIDTxt = cc.find('MemberIDTxt', this.node)?.getComponent(cc.Label);
    //     this.memberScoreTxt = cc.find('MemberScoreTxt', this.node)?.getComponent(cc.RichText);
    //     this.squidLose = cc.find('squid_lose', this.node);
    //     this.rewardBg = cc.find('squid_reward_bg', this.node);
    //     this.rateLabel = cc.find('squid_reward_bg/rateLabel', this.node)?.getComponent(cc.RichText);
    // }
}
