import { traceClass } from '../../../core/decorator/LogTrace';
import GameplayUtil from '../../../game/util/GameplayUtil';
import { PokerCardType } from '../../loader/AssetLoader';
import AssetManager from '../../loader/AssetManager';

const { ccclass, property } = cc._decorator;

@ccclass
@traceClass()
export class PokerCardTypeItem extends cc.Component {
    @property(cc.Toggle)
    toggle: cc.Toggle = null;
    @property({
        type: [cc.Sprite],
        displayName: '多个卡片'
    })
    cardSprites: cc.Sprite[] = [];
    private cards: number[] = [];
    private _pokerCardType: PokerCardType;
    public get pokerCardType() {
        return this._pokerCardType;
    }
    public get isChecked() {
        return this.toggle.isChecked;
    }

    public setChecked(b: boolean, triggedCallbac: boolean) {
        if (this.toggle.isChecked == b) return;
        this.toggle.isChecked = b;
        if (triggedCallbac) {
            if (this.onCheckedCallback) {
                this.onCheckedCallback(this.toggle, this._pokerCardType);
            }
        }
    }

    public setCardNums(te: PokerCardType, v1: number, v2: number, v3: number, v4: number) {
        this.cards = [v1, v2, v3, v4];
        this._pokerCardType = te;
        this._refreshView();
    }

    private _refreshView(): void {
        this.cards.forEach((v, i) => {
            let sf = AssetManager.getAsset(this._pokerCardType, GameplayUtil.CardNoToLocalResource(v));
            if (sf) {
                if (this.cardSprites[i]) {
                    this.cardSprites[i].spriteFrame = sf;
                }
            } else {
                // 过滤非运行状态，只有在游戏实际运行且节点有效时才抛出资源缺失错误，避免卡死编辑器
                if (cc.isValid(this.node)) {
                    this.tracelog.error(`未能成功获取到sprite:${i} 为 ${v} 的 SpriteFrame 指针`);
                }
            }
        });
    }

    // 声明一个回调，用于向上传递事件
    public onCheckedCallback: (toggle: cc.Toggle, cardType: PokerCardType) => void = null;

    onLoad() {
        // 2.4 的 Toggle 事件数组是 checkEvents
        this.toggle.node.on('toggle', this.onToggleClick, this);
        if (this.cardSprites.length != 4) {
            this.tracelog.error('sprite length is not equal to 4');
        }
    }

    // 注意：Cocos 2.4 的 Toggle 回调第一个参数就是 toggle 本身
    private onToggleClick(toggle: cc.Toggle) {
        // 过滤掉“取消选中”的触发，只保留“被选中”的触发
        if (this.onCheckedCallback) {
            this.onCheckedCallback(toggle, this._pokerCardType);
        }
    }
}
