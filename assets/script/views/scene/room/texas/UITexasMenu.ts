import { traceClass } from "../../../../core/decorator/LogTrace";
import TexasGameRoomData from "../../../../data/room/texas/TexasGameRoomData";
import { SquidMode } from "../../../../game/constant/Squid";
import h5MessageManager from "../../../../H5MsgMgr";
import { i18nMgr } from "../../../../i18n/i18nMgr";
import UIComponentBase from "../../../base/UIComponentBase";
import viewManager from "../../../UIViewManager";
import TexasTableEvent from "./events/TexasTableEvent";

const { ccclass, property } = cc._decorator;

@ccclass
@traceClass({level:'debug'})
export default class UITexasMenu extends cc.Component {
    //文字透明度
    Text_Light_Alpha = 178;
    Text_Dark_Alpha = 70;
    transSubMenu: cc.Node = null;
    imageMenuMask: cc.Node = null;
    textTotalBean: cc.Label = null;
    //Menu_Buttons: cc.Node = null;
    @property(cc.Button)
    public btnSetting: cc.Button = null;
    @property(cc.Button)
    public btnRules: cc.Button = null;
    @property(cc.Button)
    public btnInsure: cc.Button = null;
    @property(cc.Button)
    public btnBet: cc.Button = null;
    @property(cc.Button)
    public btnHalfLeave: cc.Button = null;
    @property(cc.Button)
    public btnShowBB: cc.Button = null;
    @property(cc.Button)
    public btnStand: cc.Button = null;
    @property(cc.Button)
    public btnLeaveGame: cc.Button = null;
    @property(cc.Button)
    public btnDissolve: cc.Button = null;
    // BB 开关图片
    @property(cc.SpriteFrame)
    public sfUnchecked: cc.SpriteFrame = null;
    @property(cc.SpriteFrame)
    public sfChecked: cc.SpriteFrame = null;
    // BB 开关图片节点
    @property(cc.Node)
    public checkNode: cc.Node = null;
    //按钮模板节点
    //Menu_Button: cc.Node = null;
    outTipNode: cc.Node = null;
    outGold: cc.Label = null;
    gold_click: cc.Node = null;
    ////////////////////////////////////
    //面板
    $panel: cc.Node = null;
    //黑色挡板
    $black: cc.Node = null;
    $block: cc.Node = null;
    //容器
    $layout: cc.Node = null;
    //选项
    $option_0: cc.Node = null;
    $option_bb: cc.Node = null;
    //金币节点
    $node_coin: cc.Node = null;
    //仓库存储节点
    $node_storage: cc.Node = null;
    tips_show: boolean = false;
    IMenuButton_Type: {
        node: cc.Node;
        text: string;
        i18n_string: string;
        hideLine?: boolean;
        onClick?: Function;
    };

    private _roomData: TexasGameRoomData = null!;

    protected onLoad(): void {
        this.regiterTouchEvents();
    }

    initData(roomData: TexasGameRoomData) {
        this._fadeOut(false);
        this._updateDisplay();
        //this.centerMenuContent();
        this._fadeIn();
        //刷新bb
        //this.refreshBB();
    }

    private _updateDisplay() {
        this.btnInsure.node.active = this._roomData.basicInfo.hasInsurance;
        //@TODO
        const isDissolve = false; //gc._isRoomManager && gc._isHasDisbandRoomPrivileges;
        if (this._roomData.mine.seatNo > 0) {
            this.btnBet.node.active = true;
            this.btnHalfLeave.node.active = true;
            this.btnStand.node.active = true;
            if (this.btnDissolve) this.btnDissolve.node.active = isDissolve;
            return;
        }
        this.btnBet.node.active = false;
        this.btnHalfLeave.node.active = false;
        this.btnStand.node.active = false;
        if (this.btnDissolve) this.btnDissolve.node.active = isDissolve;
    }

    regiterTouchEvents() {
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
        this.btnHalfLeave.node.on('click', this.click_leave_table, this);
        this.btnBet.node.on('click', this.click_bringin, this);
        this.btnInsure.node.on('click', this.click_insurance, this);
        this.btnLeaveGame.node.on('click', this.click_leave, this);
        this.btnShowBB.node.on('click', this.click_bb, this);
        this.btnDissolve.node.on('click', this.click_dissolve, this);
    }

    //面板移入
    private _fadeIn(animation: boolean = true) {
        if (animation) {
            cc.tween(this.$panel).to(0.25, { x: 0 }).start();
        } else {
            this.$panel.x = 0;
        }
        this.$black.active = true;
        this.$block.active = true;
    }

    //面板移出
    private _fadeOut(animation: boolean = true) {
        let view_width = 1242;
        this.$panel.width = view_width;
        if (animation) {
            cc.tween(this.$panel).to(0.25, { x: -view_width }).start();
        } else {
            this.$panel.x = -view_width;
        }
        this.$black.active = false;
        this.$block.active = false;
    }

    /////////////////////////////////////////////
    //黑色挡板点击
    click_black() {
        this.onClose(true);
    }

    onClose(param?: any) {
        this._fadeOut(param);
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
        const mine = this._roomData.seatsStateManager.getSeatPlayer(this._roomData.mine.seatNo);

        if (this._roomData.basicInfo.hasSquid 
            && this._roomData.basicInfo.squidStatusEnabled && mine.squidIn) {
            if (this._roomData.basicInfo.squidMode === SquidMode.NORMAL) {
                TexasTableEvent.Standup(this._roomData.mine);
                return;
            }
            if (this._roomData.basicInfo.squidMode === SquidMode.XZ) {
                if (mine.squidCount <= 0) {
                    viewManager.openDialog('ConfirmOrNotice', {
                        title: i18nMgr.Get('UIGuild_TipsTitle'),
                        content: i18nMgr.Get('UISquid_Tips3'),
                        commit: i18nMgr.Get('adaptation10012'),
                        cancel: i18nMgr.Get('adaptation10013'),
                        commit_click: () => TexasTableEvent.Standup(this._roomData.mine)
                    });
                } else {
                    viewManager.openDialog('ConfirmOrNotice', {
                        title: '',
                        content: i18nMgr.Get('UIDelayLeaveTips'),
                        commit: i18nMgr.Get('UILeave'),
                        cancel: i18nMgr.Get('UIPause_sdXLZk7S'),
                        commit_click: () => TexasTableEvent.Standup(this._roomData.mine)
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

    click_setting() {
        this.click_black();
        UIComponent.open(UIDefine.UITexasSettingComponent, null, {
            parentUI: this._roomData.basicInfo.uirc.Common_Con
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
                    poker_type:  this._roomData.basicInfo.pokerType,
                    room_critical_hit: this._roomData.basicInfo.hasCriticalHit,
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

    //手动带出
    click_bringout() {
        // if (null == this.MenuButtons_Dic.Button_TakeOut || !this.MenuButtons_Dic.Button_TakeOut.node.getComponent(cc.Button).interactable) {
        //     return;
        // }
        this.click_black();
        // 弹代入框CurretainMinRate
        // UIComponent.Instance.ShowUI<OutClipsData>(PrefabUI.UIBringOut, {
        //     currentMinRate: this._roomData.basicInfo.currentMinRate,
        //     tableChips: this._roomData.basicInfo.mainPlayer.chips
        // });
    }

    click_trust() {
        // if (!this.getButtonInteractable(this.MenuButtons_Dic.Button_Trust.node)) {
        //     return;
        // }
        this.click_black();
        if (0 == this._roomData.mine.seatNo) {
            viewManager.showToast(i18nMgr.Get('Good_luck'));
            //Game.EventSystem.Run(EventIdType.GameErrorReconnect);
            return;
        }
        if (this._roomData.basicInfo.mainPlayer.IsAutoOp) return;
        this._roomData.basicInfo.SendTrustAction(true);
    }

    //留座离桌
    click_leave_table() {
        // this.post(EventName.updateFriendChessView)
        this._roomData.basicInfo.uirc.HideMenu();
        this._roomData.basicInfo.SendReserveSeatAction(true);
    }

    click_leave() {
        TexasTableEvent.LeaveRoom(this._roomData.mine);
    }

    /** 解散牌桌 */
    click_dissolve() {
        this.click_black();
        UIComponent.open<UIDialogParam>(UIDefine.UIDialogComponent, {
            type: UIDialogComponent.DialogType.CommitCancel,
            title: CPErrorCode.LanguageDescription(10007),
            content: i18nMgr.Get('UITexasRoomManagerOpTips2'),
            contentCommit: i18nMgr.Get('UI_Recharge_confirm'),
            contentCancel: CPErrorCode.LanguageDescription(10013),
            actionCommit: () => {
                WWW.Instance.CommonAPI({
                    web_class: WebRoomCenterRoomDisbAnd,
                    body: WebRoomCenterRoomDisbAnd.Request({
                        room_id: GameCache.Instance.room_id
                    })
                }).then((res: any) => {
                    if (res?.code === 0) {
                        viewManager.showToast(i18nMgr.Get('UITexasRoomManagerOpTips3'));
                    } else {
                        viewManager.showToast(res?.message || CPErrorCode.ServerErrorDescription(res?.code));
                    }
                });
            }
        });
    }

    click_bb() {
        GameCache.Instance.bb_on = !GameCache.Instance.bb_on;
        this.refreshBB_switch(GameCache.Instance.bb_on);
        this._roomData.basicInfo.UpdateAllBB();
    }

    click_bb_showtips() {
        this.tips_show = !this.tips_show;
        this.setChildVisible(this.$option_bb, 'tips', this.tips_show);
    }

    click_bb_hidetips() {
        this.tips_show = false;
        this.setChildVisible(this.$option_bb, 'tips', false);
    }

    refreshBB_switch(boo: boolean) {
        this.setChildVisible(this.$option_bb, 'switch/on', boo);
        this.setChildVisible(this.$option_bb, 'switch/off', !boo);
        if (this.checkNode) {
            let sprite = this.checkNode.getComponent(cc.Sprite);
            if (sprite) {
                sprite.spriteFrame = boo ? this.sfChecked : this.sfUnchecked;
            }
        }
    }
}
