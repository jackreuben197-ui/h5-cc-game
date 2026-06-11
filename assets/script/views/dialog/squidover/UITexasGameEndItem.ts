import { StringHelper } from '../../../helper/StringHelper';
import RemoteSprite from '../../widget/RemoteSprite';

const { ccclass } = cc._decorator;

const GamePlaySubTypeNone = 0;

const GamePlaySubTypeMush = 1;

const GamePlaySubTypeSquid = 2;

export var TextColor = {
    Color1: '#FFFFFF',
    Color2: '#35A3B3',
    Color3: '#757CAB',
    Color4: '#7187FF',
    Color5: '#B0FFAE',
    Color6: '#FF7C7C',
    Color7: '#EEF5FF',
    Color8: '#FEEC8E'
};

@ccclass
export default class UITexasGameEndItem extends cc.Component {
    private MemberNameTxt: cc.Label = null;
    private MemberIDTxt: cc.Label = null;
    private MemberComeTxt: cc.Label = null;
    private MemberHandleTxt: cc.Label = null;
    private MemberScoreTxt: cc.Label = null;
    private MemberIcon: RemoteSprite = null;
    private bg_a: cc.Node = null;
    private bg_b: cc.Node = null;
    private c_0: cc.Node = null;
    private c_1: cc.Node = null;
    private c_2: cc.Node = null;
    private mushNode: cc.Node = null;
    private mushNumTxt: cc.Label = null;
    private mushChipsTxt: cc.Label = null;
    private squidChipsTxt: cc.Label = null;
    private gamePlaySubType: number = GamePlaySubTypeNone;
    public index = 0;

    protected onLoad(): void {
        // this.MemberNameTxt = this.getChildNodeOrComponent('MemberNameTxt', cc.Label);
        // this.MemberIDTxt = this.getChildNodeOrComponent('MemberIDTxt', cc.Label);
        // this.MemberComeTxt = this.getChildNodeOrComponent('MemberComeTxt', cc.Label);
        // this.MemberHandleTxt = this.getChildNodeOrComponent('MemberHandleTxt', cc.Label);
        // this.MemberScoreTxt = this.getChildNodeOrComponent('MemberScoreTxt', cc.Label);
        // this.MemberIcon =
        //     cc.find('MemberContent/MemberIconMask/MemberIcon', this.node)?.getComponent(cc.Sprite) || this.getChildNodeOrComponent('MemberIcon', cc.Sprite);
        // this.bg_a = this.getChildNodeOrComponent('bg_a');
        // this.bg_b = this.getChildNodeOrComponent('bg_b');
        // this.c_0 = this.getChildNodeOrComponent('c_0');
        // this.c_1 = this.getChildNodeOrComponent('c_1');
        // this.c_2 = this.getChildNodeOrComponent('c_2');
        // this.mushNode = this.getChildNodeOrComponent('mush');
        // this.mushNumTxt = this.getChildNodeOrComponent('mushNum', cc.Label);
        // this.mushChipsTxt = this.getChildNodeOrComponent('mushChips', cc.Label);
        // this.squidChipsTxt = this.getChildNodeOrComponent('squidChips', cc.Label);
    }

    public SetGamePlaySubType(type: number): void {
        this.gamePlaySubType = type;
    }

    public initData(param?: any): void {
        this.MemberNameTxt.string = StringHelper.LengthNick(param.nick_name || '');
        this.MemberIDTxt.string = `ID:${param.user_random_id || 0}`;
        this.MemberComeTxt.string = `${StringHelper.GetLongString(param.bring_in || 0)}`;
        this.MemberHandleTxt.string = `${param.user_hand_num || 0}`;
        const score = Number((param.bring_out || 0) - (param.bring_in || 0));
        this.MemberScoreTxt.string = `${StringHelper.GetSignedLongString(score)}`;
        this.MemberIcon.url = param.avatar;
        // WebImageHelper.SetUrlImage(this.MemberIcon, param.avatar, AssetContext.getAsset('RadHead'));
        this.UpdateExtraGamePlayInfo(param);
        this.setScoreColor(this.MemberScoreTxt, score);
        this.setBg();
        this.setTop();
    }

    private UpdateExtraGamePlayInfo(param: any): void {
        if (this.mushNode) {
            this.mushNode.active = this.gamePlaySubType === GamePlaySubTypeMush;
        }
        if (this.gamePlaySubType === GamePlaySubTypeMush) {
            if (this.mushNumTxt) {
                this.mushNumTxt.string = StringHelper.FormatToString('{0:N0}', param.mushroom_count || 0);
            }
            if (this.mushChipsTxt) {
                this.mushChipsTxt.string = `(${StringHelper.GetLongString(param.mushroom_amount || 0)})`;
            }
        } else {
            if (this.mushNumTxt) this.mushNumTxt.string = '0';
            if (this.mushChipsTxt) this.mushChipsTxt.string = '(0)';
        }
        if (this.squidChipsTxt) {
            if (this.gamePlaySubType === GamePlaySubTypeSquid) {
                const squidNet = Number(param.squid_in || 0) - Number(param.squid_out || 0) - Number(param.punish_fee || 0);
                this.squidChipsTxt.string = StringHelper.GetSignedLongString(squidNet);
                this.setScoreColor(this.squidChipsTxt, squidNet);
            } else {
                this.squidChipsTxt.string = '0';
                this.squidChipsTxt.node.color = cc.Color.WHITE;
            }
        }
    }

    private setBg(): void {
        if (this.bg_a) this.bg_a.active = this.index % 2 === 0;
        if (this.bg_b) this.bg_b.active = this.index % 2 === 1;
    }

    private setTop(): void {
        if (this.c_0) this.c_0.active = this.index === 0;
        if (this.c_1) this.c_1.active = this.index === 1;
        if (this.c_2) this.c_2.active = this.index === 2;
    }

    private setScoreColor(label: cc.Label, value: number): void {
        if (!label) {
            return;
        }
        if (value > 0) {
            label.node.color = cc.Color.BLACK.fromHEX(TextColor.Color6);
        } else if (value < 0) {
            label.node.color = cc.Color.BLACK.fromHEX(TextColor.Color5);
        } else {
            label.node.color = cc.Color.WHITE;
        }
    }
}
