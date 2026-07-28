import { RoomInfo } from '@silenthill/agreement-web';
import { autoBindEvents, bindEvent, unBindEvents, unBindEventsAll } from '../../../../core/decorator/DataBind';
import { traceClass } from '../../../../core/decorator/LogTrace';
import roomDataManager from '../../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataMtt from '../../../../data/room/texas/TexasGameRoomDataMtt';
import TexasGameRoomDataPlayer from '../../../../data/room/texas/TexasGameRoomDataPlayer';
import TexasGameRoomDataPlayerMine from '../../../../data/room/texas/TexasGameRoomDataPlayerMine';
import ccviewData, { CCViewData } from '../../../../data/system/CCViewData';
import { SquidMode } from '../../../../game/constant/Squid';
import h5MessageManager from '../../../../H5MsgMgr';
import { StringHelper } from '../../../../helper/StringHelper';
import { i18nLabel } from '../../../../i18n/i18nLabel';
import { i18nMgr } from '../../../../i18n/i18nMgr';
import viewManager from '../../../UIViewManager';
import SwitchNode from '../../../widget/SwitchNode';
import TexasTableEvent from './events/TexasTableEvent';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@traceClass()
@menu('Scene/Room/Texas/UITexasMenu')
export default class UITexasMenu extends cc.Component {
    //Menu_Buttons: cc.Node = null;
    @property({ type: cc.Button, displayName: '个性设置按钮' })
    public btnSetting: cc.Button = null;
    @property({ type: cc.Button, displayName: '规则按钮' })
    public btnRules: cc.Button = null;
    @property({ type: cc.Button, displayName: '保险规则按钮' })
    public btnInsure: cc.Button = null;
    @property({ type: cc.Button, displayName: '补充筹码按钮' })
    public btnBet: cc.Button = null;
    @property({ type: cc.Button, displayName: '带出筹码按钮' })
    public btnBringOut: cc.Button = null;
    @property({ type: cc.Label, displayName: '带出筹码文本' })
    public btnBringOutLabel: cc.Label = null;
    @property({ type: cc.Button, displayName: '留座离桌按钮' })
    public btnHalfLeave: cc.Button = null;
    @property({ type: cc.Button, displayName: '显示BB按钮' })
    public btnShowBB: cc.Button = null;
    @property({ type: SwitchNode, displayName: '显示BB开关' })
    public showBBSwitch: SwitchNode = null!;
    @property({ type: cc.Button, displayName: '站起围观按钮' })
    public btnStand: cc.Button = null;
    @property({ type: cc.Button, displayName: '离开房间按钮' })
    public btnLeaveGame: cc.Button = null;
    @property({ type: cc.Button, displayName: '解散牌桌按钮' })
    public btnDissolve: cc.Button = null;
    @property({ type: cc.Node, displayName: '存储信息节点' })
    public storeNode: cc.Node = null;
    @property({ type: cc.Label, displayName: '存储标题文本' })
    public storeTitleLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: '存储金额文本' })
    public storeChipsLabel: cc.Label = null;
    //按钮模板节点
    //Menu_Button: cc.Node = null;
    outTipNode: cc.Node = null;
    outGold: cc.Label = null;
    gold_click: cc.Node = null;
    ////////////////////////////////////
    //面板
    @property({ type: cc.Node, displayName: '菜单面板' })
    $panel: cc.Node = null;
    //黑色挡板
    @property({ type: cc.Node, displayName: '菜单黑色遮罩' })
    $black: cc.Node = null;
    @property({ type: cc.Node, displayName: '菜单触摸阻挡节点' })
    $block: cc.Node = null;
    private _roomData: TexasGameRoomData = null!;
    private _halfLeaveI18nLabel: i18nLabel = null!;
    private _halfLeaveTextLabel: cc.Label = null!;

    protected onLoad(): void {
        this._halfLeaveI18nLabel = this.btnHalfLeave.node.getComponentInChildren(i18nLabel);
        this._halfLeaveTextLabel = this.btnHalfLeave.node.getComponentInChildren(cc.Label);
        this.regiterTouchEvents();
    }

    public initData(roomID: number, matchID: number): void {
        this._roomData = roomDataManager.getRoomData(roomID, matchID);
        // 同一菜单 prefab 同时服务普通桌和 MTT，初始化时先恢复对应玩法的静态菜单项。
        this._applyRoomTypeMenu();
        this.fadeOut(false);
        this._bindEventsAndRefresh();
    }

    @bindEvent(CCViewData.FRAME_SIZE_UPDATE, { dataSource: 'ccviewData', initPriority: 20 })
    protected onFrameResize(
        visibleSizeWidth: number,
        visibleSizeHeight: number,
        frameSizeWidth: number,
        frameSizeHeight: number,
        suggestScale: number,
        saveAreaTop: number
    ) {
        const maxHeight = 2290;
        if (visibleSizeHeight < maxHeight) {
            const scale = visibleSizeHeight / maxHeight;
            this.node.setScale(scale, scale);
        } else {
            this.node.scale = suggestScale;
        }
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
        // 统一激活绑定，注入强类型 tag 推导过滤机制
        if (!this._roomData) return;
        autoBindEvents(this, {
            mine: this._roomData.mine,
            player: this._roomData.mine.player,
            mtt: this._roomData.mtt,
            ccviewData: ccviewData
        });
    }

    //(优先于seated执行保证展示正确)
    @bindEvent(TexasGameRoomDataPlayerMine.SEATNO_CHANGED, 'mine')
    private onUpdateSeated(seatNo: number) {
        const isDissolve = false; //gc._isRoomManager && gc._isHasDisbandRoomPrivileges;
        if (this._roomData.basicInfo.isMtt) {
            if (seatNo > 0) {
                autoBindEvents(this, { player: this._roomData.mine.player });
            } else {
                unBindEvents(this, 'player');
            }
            // MTT 没有站起、补充筹码和留座离桌，只按参赛及托管状态显示托管入口。
            this._refreshMttMenu();
            return;
        }
        this.btnInsure.node.active = this._roomData.basicInfo.hasInsurance;
        this.storeNode.active = seatNo > 0 && this._roomData.basicInfo.retainType !== RoomInfo.RetainType.RT_DISABLE;
        if (seatNo > 0) {
            autoBindEvents(this, { player: this._roomData.mine.player });
            this.btnBet.node.active = true;
            this.btnBringOut.node.active = this._roomData.basicInfo.retainType === RoomInfo.RetainType.RT_MANUAL;
            this._refreshBringOutButton();
            this.btnHalfLeave.node.active = true;
            this.btnStand.node.active = true;
            if (this.btnDissolve) this.btnDissolve.node.active = isDissolve;
            return;
        }
        this.showBBSwitch.onoff(this._roomData.setting.showBB);
        unBindEvents(this, 'player');
        this.btnBet.node.active = false;
        this.btnBringOut.node.active = false;
        this.btnHalfLeave.node.active = false;
        this.btnStand.node.active = false;
        if (this.btnDissolve) this.btnDissolve.node.active = isDissolve;
    }

    @bindEvent(TexasGameRoomDataPlayer.CHIPS_CHANGE, 'player')
    private onMineChipsChanged(): void {
        this._refreshBringOutButton();
    }

    @bindEvent(TexasGameRoomDataPlayer.AUTO_OP_CHANGE, 'player')
    private onMttAutoOpChanged(): void {
        if (this._roomData.basicInfo.isMtt) {
            this._refreshMttMenu();
        }
    }

    @bindEvent(TexasGameRoomDataMtt.STATE_CHANGED, 'mtt')
    private onMttStateChanged(): void {
        if (this._roomData.basicInfo.isMtt) {
            this._refreshMttMenu();
        }
    }

    @bindEvent(TexasGameRoomDataPlayerMine.STORECHIPS_CHANGE, 'mine')
    private onStoreChipsChanged(storeChips: number): void {
        this.storeTitleLabel.node.color = cc.Color.WHITE;
        this.storeTitleLabel.string = i18nMgr.Get('UITexas_storage') || '存储';
        this.storeChipsLabel.node.color = cc.Color.WHITE;
        this.storeChipsLabel.string = StringHelper.GetLongString(storeChips || 0);
        if (this._roomData.basicInfo.isMtt) {
            // Unity 的 MTT 菜单只在确有暂存筹码时展示存储区域。
            this.storeNode.active = this._roomData.mine.seatNo > 0 && storeChips > 0;
        }
    }

    private regiterTouchEvents() {
        this.$black.on('click', this.click_black, this);
        this.$block.on('click', this.click_black, this);
        // $block 没有 cc.Button 组件，需要用 node.on 直接注册触摸关闭
        // if (this.$block) {
        //     this.$block.on(cc.Node.EventType.TOUCH_END, this.click_black, this);
        // }
        // this.setButtonClick(this.$node_coin, this.click_coin);
        this.btnStand.node.on('click', this.click_stand_up, this);
        this.btnSetting.node.on('click', this.click_setting, this);
        this.btnRules.node.on('click', this.click_rule_tips, this);
        this.btnHalfLeave.node.on('click', this.onHalfLeaveClicked, this);
        this.btnBet.node.on('click', this.click_bringin, this);
        this.btnBringOut.node.on('click', this.onBringOutClicked, this);
        this.btnInsure.node.on('click', this.click_insurance, this);
        this.btnLeaveGame.node.on('click', this.click_leave, this);
        this.btnShowBB.node.on('click', this.click_bb, this);
        this.showBBSwitch.onSwitchCallback = v => {
            this._roomData.setting.showBB = v;
        };
        this.btnDissolve.node.on('click', this.click_dissolve, this);
    }

    //面板移入
    public fadeIn(animation: boolean = true) {
        cc.Tween.stopAllByTarget(this.$panel);
        const offsetX = 696 * (1 - this.node.scale);
        if (animation) {
            this.node.active = true;
            cc.tween(this.$panel).to(0.25, { x: -offsetX }).start();
        } else {
            this.$panel.x = -offsetX;
            this.node.active = true;
        }
        this.$black.active = true;
        this.$block.active = true;
    }

    //面板移出
    public fadeOut(animation: boolean = true) {
        cc.Tween.stopAllByTarget(this.$panel);
        if (animation) {
            cc.tween(this.$panel)
                .to(0.25, { x: -696 * this.node.scale })
                .call(() => {
                    this.node.active = false;
                })
                .start();
        } else {
            this.$panel.x = -696 * this.node.scale;
            this.node.active = false;
        }
        this.$black.active = false;
        this.$block.active = false;
    }
    /////////////////////////////////////////////
    //黑色挡板点击
    click_black() {
        this.fadeOut(true);
    }
    /******左侧菜单按钮点击******/
    //站起
    click_stand_up() {
        this.click_black();
        if (this._roomData.mine.seatNo == 0) {
            viewManager.showToast(i18nMgr.Get('Good_luck'));
            return;
        }
        // 鱿鱼模式下的站起需要额外确认逻辑
        const mine = this._roomData.mine.player;
        if (this._roomData.basicInfo.hasSquid && this._roomData.basicInfo.squidStatusEnabled && mine.squidIn) {
            if (this._roomData.basicInfo.squidMode === SquidMode.NORMAL) {
                if (mine.isKeepSeat) {
                    TexasTableEvent.CancelKeepSeat(this._roomData.mine);
                } else {
                    TexasTableEvent.Standup(this._roomData.mine);
                }
                return;
            }
            if (this._roomData.basicInfo.squidMode === SquidMode.XZ) {
                if (mine.squidCount <= 0) {
                    viewManager.openDialog('ConfirmOrNotice', {
                        title: i18nMgr.Get('UIGuild_TipsTitle'),
                        content: i18nMgr.Get('UISquid_Tips3'),
                        commit: i18nMgr.Get('adaptation10012'),
                        cancel: i18nMgr.Get('adaptation10013'),
                        commit_click: () => {
                            if (mine.isKeepSeat) {
                                TexasTableEvent.CancelKeepSeat(this._roomData.mine);
                            } else {
                                TexasTableEvent.Standup(this._roomData.mine);
                            }
                        }
                    });
                } else {
                    viewManager.openDialog('ConfirmOrNotice', {
                        title: '',
                        content: i18nMgr.Get('UIDelayLeaveTips'),
                        commit: i18nMgr.Get('UILeave'),
                        cancel: i18nMgr.Get('UIPause_sdXLZk7S'),
                        commit_click: () => {
                            if (mine.isKeepSeat) {
                                TexasTableEvent.CancelKeepSeat(this._roomData.mine);
                            } else {
                                TexasTableEvent.Standup(this._roomData.mine);
                            }
                        }
                    });
                }
                return;
            }
        }
        TexasTableEvent.Standup(this._roomData.mine);
    }

    click_insurance() {
        this.click_black();
        h5MessageManager.sendToH5('showPanel', 1, {
            panelType: 'gameRule',
            props: {
                ruleType: 2,
                gameInfo: {
                    insurance_mode: this._roomData.basicInfo.insuranceMode || 0
                }
            }
        });
        // UIComponent.open(UIDefine.UIInsurance, { type: 1, roomData: { room_id: GameCache.Instance.room_id, match_id: GameCache.Instance.match_id } });
    }

    private click_setting() {
        this.click_black();
        viewManager.openDialog('PersonalSettings', {
            roomID: this._roomData.roomID,
            matchID: this._roomData.matchID
        });
    }

    click_rule_tips() {
        this.click_black();
        h5MessageManager.sendToH5('showPanel', 1, {
            panelType: 'gameRule',
            props: {
                ruleType: 1,
                gameInfo: {
                    game_type: this._roomData.basicInfo.gameType,
                    poker_type: this._roomData.basicInfo.pokerType,
                    room_critical_hit: this._roomData.basicInfo.hasCriticalHit
                }
            }
        });
        // UIComponent.open(UIDefine.UITexasRule, null, {
        //     parentUI: this._roomData.basicInfo.uirc.Common_Con
        // });
    }

    //设置自动上桌筹码
    click_auto_table() {
        this.click_black();
        // if (null == this.MenuButtons_Dic.Button_SetAutoOnTable || !this.MenuButtons_Dic.Button_SetAutoOnTable.node.getComponent(cc.Button).interactable) {
        //     return;
        // }
        // if (GameUtil.GetFriendsOrClubTable() == 3) {
        //     WWW.Instance.CommonAPI({
        //         web_class: WebUserRoomBringin,
        //         api_id: GameCache.Instance.room_id,
        //     }).then(
        //         (res: any) => {
        //             UIComponent.Instance.ShowUI(PrefabUI.UIAutoBringIn, {
        //                 bigBlind: GameCache.Instance.CurGame.bigBlind,
        //                 smallBlind: GameCache.Instance.CurGame.smallBlind,
        //                 currentMinRate:
        //                     GameCache.Instance.CurGame.currentMinRate,
        //                 currentMaxRate:
        //                     GameCache.Instance.CurGame.currentMaxRate,
        //                 tableChips: GameCache.Instance.CurGame.mainPlayer.chips,
        //                 totalCoin: GC.data.user.info.gold,
        //                 storeChips:
        //                     GameCache.Instance.CurGame.mainPlayer
        //                         .cacheStoreChips,
        //                 isFromSetting: true,
        //                 wallets: [res.data],
        //             });
        //         },
        //         (res: any) => {},
        //     );
        // } else {
        //     UIComponent.Instance.ShowUI(PrefabUI.UIAutoBringIn, {
        //         bigBlind: GameCache.Instance.CurGame.bigBlind,
        //         smallBlind: GameCache.Instance.CurGame.smallBlind,
        //         currentMinRate: GameCache.Instance.CurGame.currentMinRate,
        //         currentMaxRate: GameCache.Instance.CurGame.currentMaxRate,
        //         totalCoin: GC.data.user.info.gold,
        //         tableChips: GameCache.Instance.CurGame.mainPlayer.chips,
        //         storeChips:
        //             GameCache.Instance.CurGame.mainPlayer.cacheStoreChips,
        //         isFromSetting: true,
        //     });
        // }
    }

    //手动带入
    click_bringin() {
        // if (null == this.MenuButtons_Dic.Button_AddChips || !this.MenuButtons_Dic.Button_AddChips.node.getComponent(cc.Button).interactable) {
        //     return;
        // }
        this.click_black();
        TexasTableEvent.BringIn(this._roomData.mine);
    }

    private onBringOutClicked(): void {
        if (!this.btnBringOut.interactable) return;
        this.click_black();
        viewManager.openDialog('BringOut', {
            RoomPlayer: this._roomData.mine
        });
    }

    private _refreshBringOutButton(): void {
        const minimumOnTable = this._roomData.basicInfo.retainMinRate * this._roomData.basicInfo.sbante.sb * 2;
        const enabled = this._roomData.mine.seatNo > 0 && this._roomData.mine.player.chip > minimumOnTable;
        this.btnBringOut.interactable = enabled;
        this.btnBringOutLabel.node.color = enabled ? cc.Color.WHITE : cc.Color.GRAY;
    }

    private onHalfLeaveClicked(): void {
        if (this._roomData.basicInfo.isMtt) {
            this.click_trust();
        } else {
            this.click_leave_table();
        }
    }

    private click_trust(): void {
        this.click_black();
        // 可点击状态已经由参赛、开赛和服务端托管状态共同控制，这里只发送托管请求。
        TexasTableEvent.MttSetAutoOp(this._roomData, true);
    }

    //留座离桌
    click_leave_table() {
        // this.post(EventName.updateFriendChessView)
        // this._roomData.basicInfo.uirc.HideMenu();
        // this._roomData.basicInfo.SendReserveSeatAction(true);
    }

    click_leave() {
        TexasTableEvent.LeaveRoom(this._roomData.mine);
        this.click_black();
    }

    /** 解散牌桌 */
    click_dissolve() {
        this.click_black();
        // UIComponent.open<UIDialogParam>(UIDefine.UIDialogComponent, {
        //     type: UIDialogComponent.DialogType.CommitCancel,
        //     title: CPErrorCode.LanguageDescription(10007),
        //     content: i18nMgr.Get('UITexasRoomManagerOpTips2'),
        //     contentCommit: i18nMgr.Get('UI_Recharge_confirm'),
        //     contentCancel: CPErrorCode.LanguageDescription(10013),
        //     actionCommit: () => {
        //         WWW.Instance.CommonAPI({
        //             web_class: WebRoomCenterRoomDisbAnd,
        //             body: WebRoomCenterRoomDisbAnd.Request({
        //                 room_id: GameCache.Instance.room_id
        //             })
        //         }).then((res: any) => {
        //             if (res?.code === 0) {
        //                 viewManager.showToast(i18nMgr.Get('UITexasRoomManagerOpTips3'));
        //             } else {
        //                 viewManager.showToast(res?.message || CPErrorCode.ServerErrorDescription(res?.code));
        //             }
        //         });
        //     }
        // });
    }

    click_bb() {
        this.showBBSwitch.onoff(!this.showBBSwitch.isOn, true);
    }

    private _applyRoomTypeMenu(): void {
        const isMtt = this._roomData.basicInfo.isMtt;
        this.btnSetting.node.active = true;
        this.btnRules.node.active = !isMtt;
        this.btnInsure.node.active = !isMtt && this._roomData.basicInfo.hasInsurance;
        this.btnShowBB.node.active = true;
        this.btnLeaveGame.node.active = true;
        if (this.btnDissolve) {
            this.btnDissolve.node.active = false;
        }
        // 复用“留座离桌”的按钮和图标，MTT 下只替换为托管语义。
        this._halfLeaveI18nLabel.i18NString = isMtt ? 'UITexas_TrustGame' : 'UITexas_LeaveTheTable';
        this._halfLeaveTextLabel.node.color = cc.Color.WHITE;
        this.btnHalfLeave.interactable = true;
        this.showBBSwitch.onoff(this._roomData.setting.showBB);
    }

    private _refreshMttMenu(): void {
        const player = this._roomData.mine.player;
        const seated = !!player?.seated;
        const canTrust = seated && this._roomData.mtt.gameStarted && !player.isAuto;
        this.storeNode.active = seated && this._roomData.mine.storeChips > 0;
        this.btnBet.node.active = false;
        this.btnBringOut.node.active = false;
        this.btnStand.node.active = false;
        this.btnHalfLeave.node.active = seated && !player.isAuto;
        this.btnHalfLeave.interactable = canTrust;
        this._halfLeaveTextLabel.node.color = canTrust ? cc.Color.WHITE : cc.Color.GRAY;
    }
}
