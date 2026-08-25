import soundManager from '../../../core/SoundManager';
import { i18nMgr } from '../../../i18n/i18nMgr';
import roomDataManager from '../../../data/room/RoomDataManager';
import texasGamePersonalSettings, { ShortCut, shortCutMode } from '../../../data/room/texas/TexasGamePersonalSettings';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataPlayerMine from '../../../data/room/texas/TexasGameRoomDataPlayerMine';
import UIComponentBaseDialog from '../../base/UIComponentDialogBase';
import { AssetCollectionType, PokerCardType } from '../../loader/AssetLoader';
import CustomButton from '../../widget/CustomButton';
import StepSlider from '../../widget/StepSlider';
import SwitchNode from '../../widget/SwitchNode';
import ToggleButton from '../../widget/ToggleButton';
import { DeskTypeItem } from './DeskTypeItem';
import { PokerCardTypeItem } from './PokerCardTypeItem';

export type UIPersonalSettingsParam = {
    roomID: number;
    matchID: number;
};

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('Dialog/PersonalSettings/UIPersonalSettings')
export default class UIPersonalSettings extends UIComponentBaseDialog<UIPersonalSettingsParam> {
    // ==================== Tab标签页 ====================
    @property({ type: cc.Toggle, displayName: '牌桌设置' })
    private toggleDesk: cc.Toggle = null;
    @property({ type: cc.Toggle, displayName: '快捷设置' })
    private toggleShortCut: cc.Toggle = null;
    @property({ type: cc.Toggle, displayName: '系统设置' })
    private toggleSystem: cc.Toggle = null;
    // ==================== 牌面样式 ====================
    @property({ type: cc.Node, displayName: '牌桌设置内容ROOT' })
    private deskNode: cc.Node = null!;
    @property({ type: cc.Node, displayName: '牌面样式缩略图容器(子节点每个含Checkmark)' })
    private cardGroup: cc.Node = null!;
    @property({ type: cc.Prefab, displayName: '牌面样式缩略图容器' })
    private cardTypePrefab: cc.Prefab = null;
    private _cardTypes: PokerCardTypeItem[] = [];
    // ==================== 桌面背景 ====================
    @property({ type: cc.Node, displayName: '桌面背景缩略图网格容器)' })
    private deskGroup: cc.Node = null;
    @property({ type: cc.Prefab, displayName: '桌面样式缩略图容器' })
    private deskPrefab: cc.Prefab = null;
    private _deskTypes: DeskTypeItem[] = [];
    @property({ type: ToggleButton, displayName: '桌面展开/收起按钮(子节点Arrow切换箭头贴图)' })
    private tableExpand: ToggleButton = null;
    @property({ type: cc.Node, displayName: '系统设置内容ROOT' })
    private systemNode: cc.Node = null!;
    // ==================== 声音开关(Toggle按钮) ====================
    @property({ type: SwitchNode, displayName: '声音切换按钮' })
    private toggleVoice: SwitchNode = null;
    // ==================== Showbb(Toggle按钮) ====================
    @property({ type: SwitchNode, displayName: 'ShowBB切换按钮' })
    private toggleShowBB: SwitchNode = null;
    @property({ type: cc.Node, displayName: '快捷设置内容ROOT' })
    private shortCutNode: cc.Node = null!;
    // ==================== 按钮组切换(三按钮/五按钮) ====================
    @property({ type: CustomButton, displayName: '三按钮布局按钮(含Background+Label)' })
    private threeButtonSet: CustomButton = null;
    @property({ type: CustomButton, displayName: '五按钮布局按钮(含Background+Label)' })
    private fiveButtonSet: CustomButton = null;
    @property({ type: cc.Node, displayName: '三按钮容器' })
    private threeBtnsContainer: cc.Node = null;
    private _threeBtns: CustomButton[] = [];
    @property({ type: cc.Node, displayName: '五按钮容器' })
    private fiveBtnContainer: cc.Node = null;
    private _fiveBtns: CustomButton[] = [];
    @property({ type: cc.Prefab, displayName: '快捷按钮' })
    private buttonPrefab: cc.Prefab = null;
    @property({ type: cc.Label, displayName: '显示文字' })
    private displayLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: '最小' })
    private minLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: '最大' })
    private maxLabel: cc.Label = null;
    private _currentShortCutButton: CustomButton = null!;
    // ==================== 自定义滑块 ====================
    @property({ type: StepSlider, displayName: '百分比滑块容器(含base/slider可拖拽+base/progress进度条)' })
    private progressSlider: StepSlider = null;
    // ==================== 私有状态 ====================
    private _defaultShourts: ShortCut[] = null;
    private _mine: TexasGameRoomDataPlayerMine = null;
    // ==================== 常量 ====================
    private static readonly DESK_VISIBLE_COUNT = 4;
    private static readonly DESK_NAME_KEYS = [
        'UIDeskStyle_GreenPattern',
        'UIDeskStyle_GlassGreen',
        'UIDeskStyle_DarkGreen',
        'UIDeskStyle_Bamboo',
        'UIDeskStyle_BluePattern',
        'UIDeskStyle_StarryBlue',
        'UIDeskStyle_DeepBlue',
        'UIDeskStyle_Europe',
        'UIDeskStyle_Black',
        'UIDeskStyle_Night',
        'UIDeskStyle_Graphite',
        'UIDeskStyle_NightGlow',
        'UIDeskStyle_LightGreen',
        'UIDeskStyle_IceBlue',
        'UIDeskStyle_SkyBlue',
        'UIDeskStyle_Purple'
    ];
    private static readonly DESK_COUNT = UIPersonalSettings.DESK_NAME_KEYS.length;
    private static readonly COLOR_SELECTED = cc.Color.BLACK;
    private static readonly COLOR_NORMAL = cc.Color.WHITE;
    private static readonly SLIDER_BASE_WIDTH = 800;
    private static readonly SLIDER_MIN_X = 80;
    private static readonly SLIDER_STEP = 8;
    // ====================================================
    // 生命周期
    // ====================================================

    protected onLoad(): void {
        this._defaultShourts = texasGamePersonalSettings.getAllShortCuts();
        this._initCardGroup();
        this._initDeskGroup();
        this._initTabTitle();
        this._initShortCut();
        this._initSoundAndShowBB();
    }

    public initialize(param: UIPersonalSettingsParam): void {
        this._mine = roomDataManager.getRoomData<TexasGameRoomData>(param.roomID, param.matchID).mine;
        this._initCardSelected();
        this._initDeskSelected();
        this._initTab();
        this.toggleVoice.onoff(texasGamePersonalSettings.soundOn);
        this.toggleShowBB.onoff(texasGamePersonalSettings.showBB);
    }

    public override close(): void {
        if (this._mine) this._mine.personalSettingsDialogOpen = false;
        super.close();
    }

    protected override onFrameResize(
        visibleSizeWidth: number,
        visibleSizeHeight: number,
        frameSizeWidth: number,
        frameSizeHeight: number,
        suggestScale: number,
        saveAreaTop: number
    ): void {
        const maxHeight = 2200;
        if (visibleSizeHeight < maxHeight) {
            const scale = visibleSizeHeight / maxHeight;
            this.node.setScale(scale, scale);
        }
    }
    // ====================================================
    // Tab 标签页
    // ====================================================
    private onDeskClicked = (v: cc.Toggle) => {
        if (!v.isChecked) return;
        this.deskNode.active = true;
        this.shortCutNode.active = false;
        this.systemNode.active = false;
    };
    private onShortCutClicked = (v: cc.Toggle) => {
        if (!v.isChecked) return;
        this.deskNode.active = false;
        this.shortCutNode.active = true;
        this.systemNode.active = false;
    };
    private onSystemClicked = (v: cc.Toggle) => {
        if (!v.isChecked) return;
        this.deskNode.active = false;
        this.shortCutNode.active = false;
        this.systemNode.active = true;
    };

    private _initTabTitle(): void {
        this.toggleDesk.node.on('toggle', this.onDeskClicked, this);
        this.toggleShortCut.node.on('toggle', this.onShortCutClicked, this);
        this.toggleSystem.node.on('toggle', this.onSystemClicked, this);
    }

    private _initTab(): void {
        this.toggleDesk.isChecked = true;
        this.deskNode.active = true;
        this.shortCutNode.active = false;
        this.systemNode.active = false;
    }
    // ====================================================
    // 桌面背景
    // ====================================================

    private _initDeskGroup(): void {
        for (let i = 1; i <= UIPersonalSettings.DESK_COUNT; i++) {
            const tbg = cc.instantiate(this.deskPrefab);
            const tm = tbg.getComponent(DeskTypeItem);
            tm.setDisplayName(i18nMgr.Get(UIPersonalSettings.DESK_NAME_KEYS[i - 1]));
            tbg.parent = this.deskGroup;
            tm.onCheckedCallback = (v, deskType) => {
                texasGamePersonalSettings.setDeskTypeToStorage(deskType);
            };
            tm.deskType = i;
            this._deskTypes.push(tm);
            if (tm.deskType > UIPersonalSettings.DESK_VISIBLE_COUNT) {
                tbg.active = false;
            }
        }
        this.tableExpand.onToggleCallback = (isOn: boolean) => {
            let delay = 0;
            if (isOn) {
                this._deskTypes.forEach(v => {
                    if (v.deskType > UIPersonalSettings.DESK_VISIBLE_COUNT) {
                        const child = v.node;
                        // 渐进式激活
                        cc.tween(child)
                            .delay(delay) // 动态增加延迟时间
                            .call(() => {
                                child.active = true;
                                // 关键：由于 2.4 Layout 的自动刷新有时会滞后，
                                // 每激活一个，最好手动强制 layout 重新排列一次
                                this.deskGroup.getComponent(cc.Layout).updateLayout();
                                // 选做：顺便给子节点加一个微型的缩放动画，效果更丝滑
                                child.scale = 0;
                                cc.tween(child).to(0.15, { scale: 1 }, { easing: 'backOut' }).start();
                            })
                            .start();
                        delay += 0.08; // 每个节点间隔 0.08 秒显示
                    }
                });
            } else {
                this._deskTypes.forEach(v => {
                    if (v.deskType > UIPersonalSettings.DESK_VISIBLE_COUNT) {
                        const child = v.node;
                        child.active = false;
                    }
                });
            }
        };
    }

    private _initDeskSelected(): void {
        let selected = texasGamePersonalSettings.deskType;
        const f = this._deskTypes.filter(v => v.deskType == selected);
        if (f.length > 0) {
            f[0].setChecked(true, false);
        } else {
            this._deskTypes[0].setChecked(true, false);
        }
        if (selected > UIPersonalSettings.DESK_VISIBLE_COUNT) {
            this.tableExpand.check(true, true);
        }
    }
    // ====================================================
    // 牌面样式
    // ====================================================

    private _initCardGroup(): void {
        const c1 = cc.instantiate(this.cardTypePrefab);
        c1.parent = this.cardGroup;
        const pm1 = c1.getComponent(PokerCardTypeItem);
        pm1.onCheckedCallback = (v: cc.Toggle, pc: PokerCardType) => {
            texasGamePersonalSettings.setPokerCardTypeToStorage(pc);
        };
        pm1.setCardNums(AssetCollectionType.SpriteFrameCard0, 10, 26, 43, 58);
        const c2 = cc.instantiate(this.cardTypePrefab);
        c2.parent = this.cardGroup;
        const pm2 = c2.getComponent(PokerCardTypeItem);
        pm2.setCardNums(AssetCollectionType.SpriteFrameCard1, 10, 26, 43, 58);
        pm2.onCheckedCallback = (v: cc.Toggle, pc: PokerCardType) => {
            texasGamePersonalSettings.setPokerCardTypeToStorage(pc);
        };
        const c3 = cc.instantiate(this.cardTypePrefab);
        c3.parent = this.cardGroup;
        const pm3 = c3.getComponent(PokerCardTypeItem);
        pm3.setCardNums(AssetCollectionType.SpriteFrameCard2, 10, 26, 43, 58);
        pm3.onCheckedCallback = (v: cc.Toggle, pc: PokerCardType) => {
            texasGamePersonalSettings.setPokerCardTypeToStorage(pc);
        };
        this._cardTypes.push(pm1, pm2, pm3);
    }

    private _initCardSelected(): void {
        let selected = texasGamePersonalSettings.pokerCardType;
        const f = this._cardTypes.filter(v => v.pokerCardType == selected);
        if (f.length > 0) {
            f[0].setChecked(true, false);
        } else {
            this._cardTypes[0].setChecked(true, false);
        }
    }
    // ====================================================
    // 声音切换按钮 (Toggle_Voice)
    // ====================================================

    private _initSoundAndShowBB(): void {
        this.toggleVoice.onSwitchCallback = b => {
            texasGamePersonalSettings.setSoundOnToStorage(b);
            soundManager.volumeOnOff(b);
        };
        this.toggleShowBB.onSwitchCallback = b => {
            texasGamePersonalSettings.setShowBBToStorage(b);
        };
    }
    // ====================================================
    // 按钮组切换 (三按钮 / 五按钮)
    // ====================================================

    private _initShortCut(): void {
        this._initSlider();
        this.threeButtonSet.groups = [this.threeButtonSet, this.fiveButtonSet];
        this.fiveButtonSet.groups = [this.threeButtonSet, this.fiveButtonSet];
        this.threeButtonSet.onCheckedCallback = () => {
            this.threeBtnsContainer.active = true;
            this.fiveBtnContainer.active = false;
            if (this._threeBtns.length > 0) {
                this._threeBtns[0].check(true);
                this._currentShortCutButton = this._threeBtns[0];
            }
            texasGamePersonalSettings.shortCutMode = shortCutMode.Button3;
        };
        this.fiveButtonSet.onCheckedCallback = () => {
            this.threeBtnsContainer.active = false;
            this.fiveBtnContainer.active = true;
            if (this._fiveBtns.length > 0) {
                this._fiveBtns[0].check(true);
                this._currentShortCutButton = this._fiveBtns[0];
            }
            texasGamePersonalSettings.shortCutMode = shortCutMode.Button5;
        };
        if (texasGamePersonalSettings.shortCutMode == shortCutMode.Button5) {
            this.fiveButtonSet.check(true);
            this._currentShortCutButton = this._fiveBtns[0];
        } else {
            this.threeButtonSet.check(true);
            this._currentShortCutButton = this._threeBtns[0];
        }
        for (let i = 0; i < texasGamePersonalSettings.shortCut3ActionsIndex.length; i++) {
            const selectIndex = texasGamePersonalSettings.shortCut3ActionsIndex[i];
            const sc = texasGamePersonalSettings.getShortCut(selectIndex);
            const node = cc.instantiate(this.buttonPrefab);
            this.threeBtnsContainer.addChild(node);
            const cb = node.getComponent(CustomButton);
            cb.setText(sc.name, i);
            cb.checkedTextColor = cb.uncheckedTextColor;
            cb.onCheckedCallback = () => {
                this._currentShortCutButton = cb;
                this.progressSlider.setProgress(this.progressSlider.step * selectIndex);
            };
            this._threeBtns.push(cb);
        }
        this._threeBtns.forEach(v => (v.groups = this._threeBtns));
        this._threeBtns[0].check(true, true);
        for (let i = 0; i < texasGamePersonalSettings.shortCut5ActionsIndex.length; i++) {
            const selectIndex = texasGamePersonalSettings.shortCut5ActionsIndex[i];
            const sc = texasGamePersonalSettings.getShortCut(selectIndex);
            const node = cc.instantiate(this.buttonPrefab);
            this.fiveBtnContainer.addChild(node);
            const cb = node.getComponent(CustomButton);
            cb.setText(sc.name, i);
            cb.checkedTextColor = cb.uncheckedTextColor;
            cb.onCheckedCallback = () => {
                this._currentShortCutButton = cb;
                this.progressSlider.setProgress(this.progressSlider.step * selectIndex);
            };
            this._fiveBtns.push(cb);
        }
        this._fiveBtns.forEach(v => (v.groups = this._fiveBtns));
        this._fiveBtns[0].check(true);
    }

    private _initSlider(): void {
        this.minLabel.string = this._defaultShourts[0].name;
        this.maxLabel.string = this._defaultShourts[this._defaultShourts.length - 1].name;
        this.progressSlider.step = 1 / (this._defaultShourts.length - 1);
        this.progressSlider.onValueChanged = (progress: number) => {
            const index = Math.round(progress / this.progressSlider.step);
            const sc = this._defaultShourts[index];
            this.displayLabel.string = sc.name;
            if (this._currentShortCutButton) {
                const btnIndex = this._currentShortCutButton.getInnerValue<number>();
                if (texasGamePersonalSettings.shortCutMode == shortCutMode.Button3) {
                    if (texasGamePersonalSettings.shortCut3ActionsIndex[btnIndex] == index) return;
                    const a3 = [...texasGamePersonalSettings.shortCut3ActionsIndex];
                    a3[btnIndex] = index;
                    texasGamePersonalSettings.shortCut3ActionsIndex = a3;
                } else {
                    if (texasGamePersonalSettings.shortCut5ActionsIndex[btnIndex] == index) return;
                    const a5 = [...texasGamePersonalSettings.shortCut5ActionsIndex];
                    a5[btnIndex] = index;
                    texasGamePersonalSettings.shortCut5ActionsIndex = a5;
                }
                this._currentShortCutButton.setText(sc.name, btnIndex);
            }
        };
        this.progressSlider.setProgress(0);
    }
}
