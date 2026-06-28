import { traceClass } from '../../../core/decorator/LogTrace';
import GameplayUtil from '../../../game/util/GameplayUtil';
import { AssetCollectionType } from '../../loader/AssetLoader';
import AssetManager from '../../loader/AssetManager';

const { ccclass, property } = cc._decorator;

@ccclass
@traceClass()
export class DeskTypeItem extends cc.Component {
    @property(cc.Toggle)
    toggle: cc.Toggle = null;
    @property(cc.Sprite)
    tableImage: cc.Sprite = null;
    @property(cc.Label)
    textLbl: cc.Label = null;
    private _deskType: number;
    public get deskType() {
        return this._deskType;
    }
    public set deskType(index: number) {
        this._deskType = index;
        this._refreshView();
    }
    public get isChecked() {
        return this.toggle.isChecked;
    }

    public setChecked(b: boolean, triggedCallbac: boolean = false) {
        if (this.toggle.isChecked == b) return;
        this.toggle.isChecked = b;
        if (triggedCallbac) {
            if (this.onCheckedCallback) {
                this.onCheckedCallback(this.toggle, this._deskType);
            }
        }
    }

    public setDisplayName(v: string) {
        this.textLbl.string = v;
    }

    private _refreshView(): void {
        let sf = AssetManager.getAsset(AssetCollectionType.SpriteFrameTableSmall, GameplayUtil.DeskTypeIndexToLocalResource(this._deskType));
        if (sf) {
            if (this.tableImage) {
                this.tableImage.spriteFrame = sf;
            }
        } else {
            // 过滤非运行状态，只有在游戏实际运行且节点有效时才抛出资源缺失错误，避免卡死编辑器
            if (cc.isValid(this.node)) {
                this.tracelog.error(`未能成功获取到 deskType 为 ${this._deskType} 的 SpriteFrame 指针`);
            }
        }
    }

    // 声明一个回调，用于向上传递事件
    public onCheckedCallback: (toggle: cc.Toggle, deskType: number) => void = null;

    onLoad() {
        // 2.4 的 Toggle 事件数组是 checkEvents
        this.toggle.node.on('toggle', this.onToggleClick, this);
    }

    // 注意：Cocos 2.4 的 Toggle 回调第一个参数就是 toggle 本身
    private onToggleClick(toggle: cc.Toggle) {
        // 过滤掉“取消选中”的触发，只保留“被选中”的触发
        if (this.onCheckedCallback) {
            this.onCheckedCallback(toggle, this._deskType);
        }
    }
}
