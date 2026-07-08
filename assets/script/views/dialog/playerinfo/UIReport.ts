import PlayerStoreUtils from '../../../data/player/PlayerStoreUtils';
import { i18nMgr } from '../../../i18n/i18nMgr';
import UIComponentBaseDialog from '../../base/UIComponentDialogBase';
import viewManager from '../../UIViewManager';

const { ccclass, menu, property } = cc._decorator;

const REPORT_TYPES = [1, 2, 3, 4, 5];

const VIEW_MANAGER_MASK_NODE = 'ithinktisinotshouldbedupilcatednodename';

export interface UIReportParam {
    roomID: number;
    userRID?: number;
    sendName?: string;
    randomNum?: number;
    type?: number;
    matchID?: number;
    handNum?: number;
    roomUniqueID?: string;
    userGameRecordID?: number;
}

@ccclass
@menu('CrazyPoker/Texas/Dialog/UIReport')
export default class UIReport extends UIComponentBaseDialog<UIReportParam> {
    @property(cc.SpriteFrame)
    public checkedFrame: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    public uncheckedFrame: cc.SpriteFrame = null;
    private _panelClick: cc.Node = null;
    private _dialogNode: cc.Node = null;
    private _reasonNodes: cc.Node[] = [];
    private _reasonSelected: boolean[] = [false, false, false, false, false];
    private _editBox: cc.EditBox = null;
    private _param: UIReportParam = null;

    public initialize(param: UIReportParam): void {
        this._param = param;
        this._applyDialogLayout();
        this._resetState();
    }

    protected onLoad(): void {
        this._panelClick = this._findNode('$panel_click');
        this._dialogNode = this._findNode('DialogNode');
        this._bindClick(this._panelClick, this.close);
        if (this._dialogNode) {
            this._dialogNode.on(cc.Node.EventType.TOUCH_START, (event: cc.Event.EventTouch) => event.stopPropagation(), this);
            this._dialogNode.on(cc.Node.EventType.TOUCH_END, (event: cc.Event.EventTouch) => event.stopPropagation(), this);
            this._bindClick(this._dialogNode.getChildByName('closeBtn'), this.close);
            for (let i = 1; i <= 5; i++) {
                const node = this._dialogNode.getChildByName('reportReason' + i);
                if (!node) continue;
                const index = i - 1;
                this._reasonNodes.push(node);
                this._bindClick(node, () => this._clickReason(index));
            }
            const editBoxNode = cc.find('customReport/reasonEditbox', this._dialogNode);
            this._editBox = editBoxNode ? editBoxNode.getComponent(cc.EditBox) : null;
            if (this._editBox) {
                this._editBox.node.on(
                    'editing-did-began',
                    (editBox: cc.EditBox) => {
                        const impl = (editBox as any)._impl;
                        if (cc.sys.isBrowser && impl?._elem) {
                            (impl._elem as HTMLElement).style.zIndex = '20';
                        }
                    },
                    this
                );
            }
            this._bindClick(this._dialogNode.getChildByName('submitBtn'), this._clickSubmit);
        }
        if (this._param) this._resetState();
    }

    protected onDestroy(): void {
        this.node.targetOff(this);
        this._dialogNode?.targetOff(this);
        this._reasonNodes.forEach(node => node?.targetOff(this));
        this._editBox?.node.targetOff(this);
    }

    private _applyDialogLayout(): void {
        this.node.setPosition(0, 0);
        this.node.setContentSize(1242, 2688);
        const mask = this.node.getChildByName(VIEW_MANAGER_MASK_NODE);
        if (mask) {
            mask.setPosition(0, 0);
            mask.setContentSize(1242, 2688);
            mask.opacity = 190;
        }
        if (this._panelClick) {
            this._panelClick.setPosition(0, 0);
            this._panelClick.setContentSize(1242, 2688);
            this._panelClick.opacity = 0;
        }
        if (this._dialogNode) {
            this._dialogNode.setPosition(0, 0);
        }
    }

    private _resetState(): void {
        this._reasonSelected = [true, false, false, false, false];
        if (this._editBox) this._editBox.string = '';
        for (let i = 0; i < this._reasonNodes.length; i++) {
            this._refreshReason(i);
        }
    }

    private _clickReason(index: number): void {
        this._reasonSelected[index] = !this._reasonSelected[index];
        this._refreshReason(index);
    }

    private async _clickSubmit(): Promise<void> {
        const selectedTypes = REPORT_TYPES.filter((_, index) => this._reasonSelected[index]);
        const customText = this._editBox?.string?.trim() || '';
        if (selectedTypes.length === 0 && customText.length === 0) {
            viewManager.showToast(i18nMgr.Get('UIMine_Setting109') || '请选择举报原因或输入描述');
            return;
        }
        try {
            const res = await PlayerStoreUtils.report({
                roomID: this._param?.roomID || 0,
                matchID: this._param?.matchID || 0,
                userRID: this._param?.randomNum || this._param?.userRID || 0,
                reportType: selectedTypes.join(','),
                other: customText,
                type: this._param?.type || 1,
                handNum: this._param?.handNum,
                roomUniqueID: this._param?.roomUniqueID,
                userGameRecordID: this._param?.userGameRecordID
            });
            if (!cc.isValid(this.node)) return;
            if (res?.code === 0) {
                viewManager.showToast(i18nMgr.Get('UIChatReport011') || '举报成功');
                this.close();
                return;
            }
            viewManager.showToast(res?.message || '举报失败');
        } catch (error) {
            if (cc.isValid(this.node)) viewManager.showToast('举报失败');
        }
    }

    private _refreshReason(index: number): void {
        const node = this._reasonNodes[index];
        const sprite = node?.getChildByName('selectSpr')?.getComponent(cc.Sprite);
        if (!sprite) return;
        const frame = this._reasonSelected[index] ? this.checkedFrame : this.uncheckedFrame;
        if (frame) sprite.spriteFrame = frame;
        sprite.node.active = true;
    }

    private _bindClick(node: cc.Node, handler: () => void): void {
        if (!node) return;
        if (!node.getComponent(cc.Button)) {
            const button = node.addComponent(cc.Button);
            button.transition = cc.Button.Transition.NONE;
        }
        node.on('click', handler, this);
    }

    private _findNode(name: string): cc.Node {
        return this._findNodeRecursive(this.node, name);
    }

    private _findNodeRecursive(root: cc.Node, name: string): cc.Node {
        if (!root) return null;
        if (root.name === name) return root;
        for (let i = 0; i < root.childrenCount; i++) {
            const child = this._findNodeRecursive(root.children[i], name);
            if (child) return child;
        }
        return null;
    }
}
