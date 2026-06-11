import storageManager from '../../../data/LocalStorage';
import UIComponentBaseDialog from '../../base/UIComponentDialogBase';

export enum UIGuideDialogType {
    Mushroom = 1,
    CriticalHit = 2
}

export type UIGuideDialogParam = {
    title: string;
    guideType: UIGuideDialogType;
    content: string;
    commitAction?: () => void;
    closeAction?: () => void;
};

const { property, menu, ccclass } = cc._decorator;

@ccclass
export default class UIGuideDialog extends UIComponentBaseDialog<UIGuideDialogParam> {
    @property({ type: cc.Button, displayName: '提交按钮' })
    Button_Commit: cc.Button = null;
    @property({ type: cc.RichText, displayName: '标题' })
    Text_Title: cc.RichText = null;
    @property({ type: cc.RichText, displayName: '内容' })
    Text_Content_Rich: cc.RichText = null;
    @property({ type: cc.Node, displayName: '蘑菇图' })
    mushroomImageNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '暴击图' })
    criticalHitImageNode: cc.Node = null;
    @property({ type: cc.Button, displayName: '不再提示按钮' })
    NoToggle: cc.Toggle = null;
    private _guideType = UIGuideDialogType.Mushroom;
    private _actionCommit: () => void = null;
    private _actionClose: () => void = null;

    protected onLoad(): void {
        this.Button_Commit.node.on('click', this.onCommitClick, this);
    }

    public initialize(param: UIGuideDialogParam): void {
        const data = param;
        this.Text_Title.string = param.title;
        this.Text_Content_Rich.string = data.content;
        this.NoToggle.isChecked = true;
        this._guideType = param.guideType;
        this.mushroomImageNode.active = param.guideType == UIGuideDialogType.Mushroom;
        this.criticalHitImageNode.active = param.guideType == UIGuideDialogType.CriticalHit;
        this._actionCommit = param.commitAction;
        this._actionClose = param.closeAction;
    }

    private onCommitClick(): void {
        const noPrompt = this.NoToggle.isChecked;
        switch (this._guideType) {
            case UIGuideDialogType.CriticalHit:
                storageManager.canSHowCriticalHitIntroDialog = !noPrompt;
                break;
            default:
                storageManager.canShowMushroomIntroDialog = !noPrompt;
                break;
        }
        if (this._actionCommit) {
            this._actionCommit();
        }
        this.close();
    }

    public override close() {
        if (this._actionClose) {
            this._actionClose();
        }
        super.close();
    }
}
