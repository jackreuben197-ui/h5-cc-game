import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataPlayerMine from '../../../data/room/texas/TexasGameRoomDataPlayerMine';
import { StringHelper } from '../../../helper/StringHelper';
import { i18nMgr } from '../../../i18n/i18nMgr';
import { APIOrgTribeRoomPermissions, WebConfigGlobalConfig } from '../../../net/https/WebRequest';
import { WWW } from '../../../net/https/WebRequestBase';
import UIComponentBaseDialog from '../../base/UIComponentDialogBase';
import viewManager from '../../UIViewManager';

export type UIGameplaySecuritySettingParam = {
    isFromBringIn?: boolean;
    roomID: number;
    matchID: number;
    bringInAct?: () => void;
    roomPermissions?: Record<string, number>;
    noAnimation?: boolean;
};

const { property, ccclass } = cc._decorator;

@ccclass
export default class UIGameplaySecuritySetting extends UIComponentBaseDialog<UIGameplaySecuritySettingParam> {
    @property(cc.Node)
    private Button_Commit: cc.Node = null;
    @property(cc.Node)
    private Button_Cancel: cc.Node = null;
    @property(cc.Node)
    private contentMidTitle: cc.Node = null;
    @property(cc.Node)
    private itemAndTipsTemplate: cc.Node = null;
    @property(cc.Node)
    private itemNormalTemplate: cc.Node = null;
    @property(cc.Node)
    private tipsMask: cc.Node = null;
    @property(cc.Node)
    private warningTips: cc.Node = null;
    @property(cc.Node)
    private callTimeTips: cc.Node = null;
    @property(cc.Label)
    private callTimeInfo: cc.Label = null;
    private contentRoot: cc.Node = null;
    private itemNormalCache: cc.Node[] = [];
    private itemAndTipsCache: cc.Node[] = [];
    private normalIndex = 0;
    private andTipsIndex = 0;
    private isFromBringIn = false;
    private _roomData: TexasGameRoomData = null!;
    private _mine: TexasGameRoomDataPlayerMine = null!;
    private bringInAct: (() => void) | null = null;
    private roomPermissions: Record<string, number> = {};

    /** 初始化节点引用 */
    protected onLoad(): void {
        // super.lateLoad();
        // this.Button_Commit = this.getChildNodeOrComponent('Button_Commit');
        // this.Button_Cancel = this.getChildNodeOrComponent('Button_Cancel');
        // this.contentMidTitle = this.getChildNodeOrComponent('contentMidTitle');
        // this.itemAndTipsTemplate = this.getChildNodeOrComponent('itemAndTips');
        // this.itemNormalTemplate = this.getChildNodeOrComponent('itemNormal');
        // this.tipsMask = this.getChildNodeOrComponent('tipsMask');
        // this.warningTips = this.getChildNodeOrComponent('Tip');
        // this.callTimeTips = this.getChildNodeOrComponent('calltimeTips');
        // const callTimeInfoNode = this.getChildNodeOrComponent('calltimeInfo');
        //this.callTimeInfo = callTimeInfoNode?.getComponent(cc.Label) || callTimeInfoNode?.getComponent(cc.RichText) || null;
        this.contentRoot = this.itemNormalTemplate.parent;
        if (this.itemNormalTemplate) this.itemNormalTemplate.active = false;
        if (this.itemAndTipsTemplate) this.itemAndTipsTemplate.active = false;
        if (this.tipsMask) this.tipsMask.active = false;
        this.regiterTouchEvents();
    }

    /** 注册点击事件 */
    protected regiterTouchEvents(): void {
        this.Button_Commit.on('click', this.OnClickCommit, this);
        this.Button_Cancel.on('click', this.OnClickCancel, this);
        this.tipsMask.on('click', this.OnClickTipsMask, this);
    }

    /** 展示入口 */
    public initialize(param: UIGameplaySecuritySettingParam): void {
        this._roomData = roomDataManager.getRoomData(param.roomID, param.matchID);
        this.isFromBringIn = !!param?.isFromBringIn;
        this.bringInAct = param?.bringInAct || null;
        this.roomPermissions = this.ParsePermissions(param?.roomPermissions);
        this.ResolveRoomPermissionsAndRefresh();
    }

    protected override onFrameResize(
        visibleSizeWidth: number,
        visibleSizeHeight: number,
        frameSizeWidth: number,
        frameSizeHeight: number,
        suggestScale: number,
        saveAreaTop: number
    ): void {
        const maxHeight = 1800;
        if (visibleSizeHeight < maxHeight) {
            const scale = visibleSizeHeight / maxHeight;
            this.node.setScale(scale, scale);
        }
    }

    /** Unity 对齐：俱乐部/联盟桌走 club permission，其它走全局权限 */
    private async ResolveRoomPermissionsAndRefresh(): Promise<void> {
        const clubId = this._roomData.basicInfo.clubID;
        const tribeId = this._roomData.basicInfo.tribeID;
        if (clubId !== 0 || tribeId > 1) {
            try {
                const resp: any = await WWW.Instance.CommonAPI({
                    web_class: APIOrgTribeRoomPermissions,
                    body: {
                        club_id: clubId,
                        tribe_id: tribeId
                    },
                    juhua: false
                });
                const roomPermissions = this.ParsePermissions(resp?.data?.room_permissions);
                if (Object.keys(roomPermissions).length > 0) {
                    this.roomPermissions = roomPermissions;
                }
            } catch (err) {
                cc.warn('[UIGameplaySecuritySetting] request club room permissions failed', err);
                this.roomPermissions = this.GetGlobalRoomPermissions();
            }
        } else {
            this.roomPermissions = this.GetGlobalRoomPermissions();
        }
        this.RefreshUI();
    }

    /** Unity GetRoomPermissions(false) 对齐：只取全局 room_permissions */
    private GetGlobalRoomPermissions(): Record<string, number> {
        const cfg: any = WebConfigGlobalConfig?.Response?.data || null;
        if (!cfg) return {};
        return this.ParsePermissions(cfg.room_permissions);
    }

    private ParsePermissions(raw: any): Record<string, number> {
        if (!raw) return {};
        let obj: any = raw;
        if (typeof raw === 'string') {
            try {
                obj = JSON.parse(raw);
            } catch (err) {
                cc.warn('[UIGameplaySecuritySetting] parse room permissions failed', err);
                return {};
            }
        }
        if (!obj || typeof obj !== 'object' || Array.isArray(obj)) {
            return {};
        }
        const ret: Record<string, number> = {};
        Object.keys(obj).forEach(k => {
            ret[k] = Number(obj[k] || 0);
        });
        return ret;
    }

    /** 刷新安全设置内容 */
    private RefreshUI(): void {
        const callTimeWinline = this._roomData.basicInfo.callTimeWinline;
        const callTimeLimitCount = this._mine?.callTimeCount ?? 0;
        if (this.callTimeTips) {
            this.callTimeTips.active = this._roomData.basicInfo.hasCallTime;
        }
        if (this.callTimeInfo) {
            this.callTimeInfo.string = StringHelper.Format(i18nMgr.Get('UICreateCallTimeTips'), [callTimeWinline, callTimeLimitCount, callTimeWinline]);
        }
        if (this.tipsMask) {
            this.tipsMask.active = false;
        }
        this.normalIndex = 0;
        this.andTipsIndex = 0;
        this.itemNormalCache.forEach(item => item && (item.active = false));
        this.itemAndTipsCache.forEach(item => {
            if (!item) return;
            item.active = false;
            const tipsNode = cc.find('tips', item);
            if (tipsNode) tipsNode.active = false;
        });
        if (this.contentMidTitle) {
            this.contentMidTitle.active = false;
        }
        if (Number(this.roomPermissions?.room_random_seat || 0) === 1) {
            this.FillDataByLanguageOpen('UICreateTable_randSeat', this._roomData.basicInfo.randomSeated, 'UICreateTable_randSeatTips');
        }
        const isDelaySeeCard = this._roomData.basicInfo.delaySeeCard;
        const isLimitIP = this._roomData.basicInfo.limitIP;
        const isLimitGPS = this._roomData.basicInfo.limitGPS;
        const isAntiCheatOpen = this._roomData.basicInfo.antiCheatType > 1;
        const isSafeRoom = this._roomData.basicInfo.seatedMessage;
        this.FillDataByLanguageOpen('adaptation20088', isDelaySeeCard);
        this.FillDataByLanguageOpen('UIClub_RoomCreat_noh7zoAE', isLimitIP);
        this.FillDataByLanguageOpen('UIClub_RoomCreat_OMKEvaor', isLimitGPS);
        this.FillDataByLanguageOpen('UISecuritySetting_limitVideo', isAntiCheatOpen);
        if (this.contentMidTitle) {
            this.contentMidTitle.active = true;
            this.MoveToLast(this.contentMidTitle);
        }
        this.FillDataByOpen('Safe', isSafeRoom);
        if (this.warningTips) {
            this.warningTips.active = !(this._roomData.basicInfo.randomSeated && isDelaySeeCard && isLimitIP && isLimitGPS && isAntiCheatOpen && isSafeRoom);
        }
        this.RefreshContentLayout();
    }

    /** 填充开/关状态项 */
    private FillDataByOpen(titleKey: string, open: boolean, tipsKey = ''): void {
        this.FillData(
            i18nMgr.Get(titleKey),
            i18nMgr.Get(open ? '6digit_password_opened' : 'UIMine_AccountNotOpen'),
            open ? '#7ED27E' : '#FF6666',
            i18nMgr.Get(tipsKey)
        );
    }

    /** 填充多语言开/关状态项 */
    private FillDataByLanguageOpen(titleKey: string, open: boolean, tipsKey = ''): void {
        this.FillData(
            i18nMgr.Get(titleKey),
            i18nMgr.Get(open ? '6digit_password_opened' : 'UIMine_AccountNotOpen'),
            open ? '#7ED27E' : '#FF6666',
            i18nMgr.Get(tipsKey)
        );
    }

    /** 填充普通项与提示项 */
    private FillData(title: string, state: string, stateColor: string, tips = ''): void {
        if (!tips) {
            const item = this.GetNormalItem(this.normalIndex++);
            if (!item) return;
            this.SetTextByPath(item, 'title', title);
            this.SetStateByPath(item, 'state', state, stateColor);
            this.MoveToLast(item);
            item.active = true;
            return;
        }
        const item = this.GetAndTipsItem(this.andTipsIndex++);
        if (!item) return;
        this.SetTextByPath(item, 'titleContent/title', title);
        this.SetStateByPath(item, 'state', state, stateColor);
        this.SetTextByPath(item, 'tips/tip_bg/Text', tips);
        const tipsNode = cc.find('tips', item);
        if (tipsNode) tipsNode.active = false;
        const btn = cc.find('titleContent/Button', item);
        this._onClickTips = () => {
            if (tipsNode) tipsNode.active = true;
            if (this.tipsMask) this.tipsMask.active = true;
        };
        if (btn) {
            btn.targetOff(this);
            btn.on('click', this._onClickTips, this);
        }
        item.targetOff(this);
        item.on('click', this._onClickTips, this);
        this.MoveToLast(item);
        item.active = true;
    }

    private _onClickTips: () => void;

    /** 节点移动到父节点末位 */
    private MoveToLast(node: cc.Node | null): void {
        if (!node || !node.parent) return;
        node.setSiblingIndex(node.parent.childrenCount - 1);
    }

    /** 刷新内容布局 */
    private RefreshContentLayout(): void {
        if (!this.contentRoot) return;
        const layout = this.contentRoot.getComponent(cc.Layout);
        if (!layout) return;
        layout.updateLayout();
    }

    /** 获取/创建普通项 */
    private GetNormalItem(index: number): cc.Node | null {
        if (!this.itemNormalTemplate) return null;
        if (index < this.itemNormalCache.length) return this.itemNormalCache[index];
        const node = cc.instantiate(this.itemNormalTemplate);
        node.parent = this.itemNormalTemplate.parent;
        node.active = false;
        this.itemNormalCache.push(node);
        return node;
    }

    /** 获取/创建提示项 */
    private GetAndTipsItem(index: number): cc.Node | null {
        if (!this.itemAndTipsTemplate) return null;
        if (index < this.itemAndTipsCache.length) return this.itemAndTipsCache[index];
        const node = cc.instantiate(this.itemAndTipsTemplate);
        node.parent = this.itemAndTipsTemplate.parent;
        node.active = false;
        this.itemAndTipsCache.push(node);
        return node;
    }

    /** 设置文本 */
    private SetTextByPath(root: cc.Node, path: string, text: string): void {
        const node = cc.find(path, root);
        if (!node) return;
        const label = node.getComponent(cc.Label);
        if (label) {
            label.string = text || '';
            return;
        }
        const rich = node.getComponent(cc.RichText);
        if (rich) {
            rich.string = text || '';
        }
    }

    /** 设置状态文本和颜色 */
    private SetStateByPath(root: cc.Node, path: string, text: string, color: string): void {
        const node = cc.find(path, root);
        if (!node) return;
        const label = node.getComponent(cc.Label);
        if (label) {
            label.string = text || '';
            label.node.color = cc.color().fromHEX(color);
            return;
        }
        const rich = node.getComponent(cc.RichText);
        if (rich) {
            rich.string = text || '';
            rich.node.color = cc.color().fromHEX(color);
        }
    }

    public override close(): void {
        super.close();
        this.bringInAct();
    }

    /** 取消：关闭并继续带入 */
    private OnClickCancel(): void {
        this.close();
    }

    /** 确认：进入牌桌设置弹窗 */
    private OnClickCommit(): void {
        super.close();
        viewManager.openDialog('TexasTableSetting', {
            isFromBringIn: this.isFromBringIn,
            bringInAct: this.bringInAct || undefined,
            roomPermissions: this.roomPermissions,
            noAnimation: true,
            roomID: this._roomData.roomID,
            matchID: this._roomData.matchID
        });
        // UIComponent.open(UIDefine.UIGameplayTableSetting, {
        //     isFromBringIn: this.isFromBringIn,
        //     bringInAct: this.bringInAct || undefined,
        //     roomPermissions: this.roomPermissions,
        //     noAnimation: true
        // });
    }

    /** 关闭提示蒙层 */
    private OnClickTipsMask(): void {
        for (let i = 0; i < this.itemAndTipsCache.length; i++) {
            const node = this.itemAndTipsCache[i];
            if (!node || !node.activeInHierarchy) continue;
            const tipsNode = cc.find('tips', node);
            if (tipsNode && tipsNode.active) {
                tipsNode.active = false;
                if (this.tipsMask) this.tipsMask.active = false;
                return;
            }
        }
        if (this.tipsMask) {
            this.tipsMask.active = false;
        }
    }
}
