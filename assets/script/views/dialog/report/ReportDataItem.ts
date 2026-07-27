import {
    TexasReportInsuranceRecord,
    TexasReportJackpotRecord,
    TexasReportPlayerInfo,
    TexasReportSquidRecord
} from '../../../data/room/texas/TexasGameRoomDataReport';
import { StringHelper } from '../../../helper/StringHelper';
import TimeHelper from '../../../helper/TimeHelper';
import { i18nMgr } from '../../../i18n/i18nMgr';
import TexasReportPresentation, { TexasReportMode } from './TexasReportPresentation';

const { ccclass, property, menu } = cc._decorator;

export type ReportPlayerRowOptions = {
    mode: TexasReportMode;
    atTable: boolean;
    currentUserID: number;
    onClick: (player: TexasReportPlayerInfo) => void;
};

// 一行里放了多套样式，这个组件负责切样式和填内容。
@ccclass
@menu('Dialog/Report/ReportDataItem')
export default class ReportDataItem extends cc.Component {
    @property({ type: cc.Node, displayName: '普通战况行 item_info1' })
    private battleNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '玩法战况行 item_info3' })
    private modeBattleNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '鱿鱼记录行 room_scrollview_sqiud' })
    private squidNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '蘑菇记录行 room_scrollview_mushRoom' })
    private mushroomNode: cc.Node = null;
    @property({ type: cc.Node, displayName: 'Jackpot 记录行 room_scrollview_jackpot' })
    private jackpotNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '保险记录行 room_scrollview_insurance' })
    private insuranceNode: cc.Node = null;
    @property({ displayName: '第一条分隔线 X 偏移', tooltip: '正数往右，负数往左' })
    private firstDividerOffsetX: number = 24;
    @property({ displayName: '最后一条分隔线 X 偏移', tooltip: '正数往右，负数往左' })
    private lastDividerOffsetX: number = -24;
    private _player: TexasReportPlayerInfo = null;
    private _onPlayerClick: (player: TexasReportPlayerInfo) => void = null;
    private _activeRowNode: cc.Node = null;

    protected onLoad(): void {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onPlayerClicked, this);
    }

    protected onDestroy(): void {
        this.node.off(cc.Node.EventType.TOUCH_END, this.onPlayerClicked, this);
    }

    public showPlayer(player: TexasReportPlayerInfo, options: ReportPlayerRowOptions): void {
        this._player = player;
        this._onPlayerClick = options.onClick;
        const target = options.mode === 'none' ? this.battleNode : this.modeBattleNode;
        this._showOnly(target);
        this._setLabel(target, 'Text_Name', StringHelper.LengthNick(player.name || ''));
        this._setLabel(target, 'Text_Num', `${player.handNum || 0}`);
        const totalColumn = target.getChildByName('Text_All_Col');
        this._setLabel(totalColumn, 'Text_All', StringHelper.GetLongString(player.bringInTotal));
        const storeChipsNode = totalColumn?.getChildByName('Text_All1');
        if (storeChipsNode) {
            storeChipsNode.active = !!player.storeChips;
            this._setNodeText(storeChipsNode, StringHelper.GetLongString(player.storeChips || 0));
        }
        this._setSignedText(target.getChildByName('Text_Count'), TexasReportPresentation.getPlayerScore(player));
        this._setNodeText(target.getChildByName('Text_Pool'), `(${((player.poolRate || 0) / 10).toFixed(1)}%)`);
        this._setOwn(target, this._isOwnUser(player.userRid, options.currentUserID));
        if (options.mode !== 'none') {
            this._setLabel(target, 'Text_Deposit', StringHelper.GetLongString(player.deposit || 0));
            this._showBattleMode(target, player, options.mode);
        }
        this._setPlayerRowColor(target, options.atTable && player.isOnline);
    }

    public showJackpot(record: TexasReportJackpotRecord, currentUserID: number): void {
        this._clearPlayerClick();
        this._showOnly(this.jackpotNode);
        this._setLabel(this.jackpotNode, 'Text_Name', StringHelper.LengthNick(record.name || '', 20));
        this._setLabel(this.jackpotNode, 'Text_Num', StringHelper.GetLongString(record.contributeTotal || 0));
        this._setSignedText(this.jackpotNode.getChildByName('Text_All'), record.awardTotal || 0);
        this._setNodeText(this.jackpotNode.getChildByName('Text_Card'), this._getJackpotCardDescription(record));
        this._setOwn(this.jackpotNode, this._isOwnUser(record.userRid, currentUserID));
    }

    public showInsurance(record: TexasReportInsuranceRecord, currentUserID: number): void {
        this._clearPlayerClick();
        this._showOnly(this.insuranceNode);
        this._setLabel(this.insuranceNode, 'Text_Name', StringHelper.LengthNick(record.name || '', 20));
        this._setLabel(this.insuranceNode, 'Text_Num', record.createTime > 0 ? this._formatInsuranceTime(record.createTime) : '--');
        this._setLabel(this.insuranceNode, 'Text_All', StringHelper.GetLongString(record.insurBet || 0));
        this._setSignedText(this.insuranceNode.getChildByName('Text_Card'), -(record.insurWin || 0));
        this._setOwn(this.insuranceNode, this._isOwnUser(record.userRid, currentUserID));
    }

    public showModeRecord(record: TexasReportSquidRecord, mode: TexasReportMode, currentUserID: number, currentUserNames: string[]): void {
        this._clearPlayerClick();
        const target = mode === 'squid' ? this.squidNode : mode === 'mush' ? this.mushroomNode : null;
        this._showOnly(target);
        if (!target) return;
        this._setLabel(target, 'Text_Name', StringHelper.LengthNick(record.name || '', 20));
        if (mode === 'squid') {
            this._setNodeText(target.getChildByName('Text_Squid'), `${record.in_num || 0}`);
            const amount = (record.in_amount || 0) !== 0 ? record.in_amount || 0 : -Math.abs(record.out_amount || 0);
            this._setSignedText(target.getChildByName('SelfGo'), amount);
        } else {
            this._setLabel(target, 'out_mush', `${record.out_num || 0}`);
            this._setLabel(target, 'in_mush', (record.in_num || 0) !== 0 ? `${record.in_num}` : '-');
            this._setSignedText(target.getChildByName('in_coin'), (record.in_amount || 0) !== 0 ? record.in_amount || 0 : null, '-');
            this._setSignedText(target.getChildByName('out_coin'), record.out_amount || 0);
        }
        this._setOwn(target, this._isOwnUser(record.user_random_id, currentUserID) || this._isOwnName(record.name, currentUserNames));
    }

    // 分隔线位置跟着当前这套行节点算，后面在 Cocos 里挪列也不用再手改坐标。
    public getColumnDividerXs(): number[] {
        if (!this._activeRowNode) return [];
        const columns = this._activeRowNode.children
            .filter(node => node.active && node.name !== 'own')
            .filter(node => !!node.getComponent(cc.Label) || !!node.getComponent(cc.RichText) || !!node.getComponent(cc.Layout))
            .sort((a, b) => a.x - b.x);
        const dividers: number[] = [];
        for (let i = 1; i < columns.length; i++) {
            dividers.push((columns[i - 1].x + columns[i].x) / 2);
        }
        // 两边单独留一点呼吸空间，中间列还是继续跟着内容自适应。
        if (dividers.length > 0) dividers[0] += this.firstDividerOffsetX;
        if (dividers.length > 1) dividers[dividers.length - 1] += this.lastDividerOffsetX;
        return dividers;
    }

    private onPlayerClicked(): void {
        if (this._player && this._onPlayerClick) this._onPlayerClick(this._player);
    }

    // 每次只亮当前要用的那套行样式。
    private _showOnly(target: cc.Node): void {
        this._activeRowNode = target;
        [this.battleNode, this.modeBattleNode, this.squidNode, this.mushroomNode, this.jackpotNode, this.insuranceNode].forEach(node => {
            node.active = node === target;
        });
    }

    private _clearPlayerClick(): void {
        this._player = null;
        this._onPlayerClick = null;
    }

    private _showBattleMode(parent: cc.Node, player: TexasReportPlayerInfo, mode: TexasReportMode): void {
        const mushroom = parent.getChildByName('mush');
        const squid = parent.getChildByName('Text_Squid');
        if (mushroom) mushroom.active = mode === 'mush';
        if (squid) squid.active = mode === 'squid';
        if (mode === 'mush' && mushroom) {
            const mushroomAmount = player.mushroomAmount || 0;
            this._setLabel(mushroom, 'mushNum', mushroomAmount > 0 ? `+${StringHelper.FormatToString('{0:N0}', player.mushroomCount || 0)}` : '-');
            const mushroomChips = mushroom.getChildByName('mushChips');
            if (mushroomChips) {
                mushroomChips.active = mushroomAmount > 0;
                this._setNodeText(mushroomChips, `(+${StringHelper.GetLongString(mushroomAmount)})`);
            }
        }
        if (mode === 'squid' && squid) {
            const net = (player.squidInTotal || 0) - (player.squidOutTotal || 0) - (player.squidPunishTotal || 0);
            this._setSignedText(squid, net);
        }
    }

    private _setLabel(parent: cc.Node, childName: string, text: string): void {
        this._setNodeText(parent?.getChildByName(childName), text);
    }

    private _setNodeText(node: cc.Node, text: string): void {
        if (!node) return;
        const richText = node.getComponent(cc.RichText);
        const label = node.getComponent(cc.Label);
        if (richText) richText.string = text;
        if (label) label.string = text;
    }

    private _setOwn(parent: cc.Node, isOwn: boolean): void {
        const own = parent?.getChildByName('own');
        if (own) own.active = isOwn;
    }

    private _isOwnUser(userID: number, currentUserID: number): boolean {
        const mine = Number(currentUserID || 0);
        return mine > 0 && Number(userID || 0) === mine;
    }

    private _isOwnName(name: string, currentUserNames: string[]): boolean {
        if (!name) return false;
        return (currentUserNames || []).some(currentName => !!currentName && currentName === name);
    }

    private _setPlayerRowColor(parent: cc.Node, atTable: boolean): void {
        const color = new cc.Color().fromHEX(atTable ? '#FFFFFF' : '#F9F9F9');
        parent.opacity = 255;
        this._walkNodes(parent, node => {
            if (!node.getComponent(cc.Label) && !node.getComponent(cc.RichText)) return;
            node.color = color;
            // #F9F9F9 和白色太接近，离桌行再降一点透明度才看得出层级。
            node.opacity = atTable ? 255 : 153;
        });
    }

    private _walkNodes(parent: cc.Node, visit: (node: cc.Node) => void): void {
        parent.children.forEach(node => {
            visit(node);
            this._walkNodes(node, visit);
        });
    }

    private _setSignedText(node: cc.Node, value: number | null, emptyText: string = ''): void {
        if (!node) return;
        if (value == null) {
            this._setNodeText(node, emptyText);
            return;
        }
        const text = StringHelper.GetSignedLongString(value);
        // 正负数颜色沿用旧版视觉规则。
        const color = value > 0 ? '#B0FFAE' : value < 0 ? '#FF7C7C' : '#FFFFFF';
        const richText = node.getComponent(cc.RichText);
        if (richText) {
            richText.string = `<color=${color}>${text}</color>`;
            return;
        }
        const label = node.getComponent(cc.Label);
        if (label) {
            label.string = text;
            label.node.color = new cc.Color().fromHEX(color);
        }
    }

    private _getJackpotCardDescription(record: TexasReportJackpotRecord): string {
        const descriptions: string[] = [];
        if ((record.royalFlushCount || 0) > 0) descriptions.push(i18nMgr.Get('UIJackPotInfo_huangjia'));
        if ((record.straightFlushCount || 0) > 0) descriptions.push(i18nMgr.Get('UIJackPotInfo_tonghuashun'));
        if ((record.fourOfaKindCount || 0) > 0) descriptions.push(i18nMgr.Get('UIJackPotInfo_shitiao'));
        return descriptions.join('\n');
    }

    private _formatInsuranceTime(timestamp: number): string {
        return TimeHelper.TimeToString(timestamp * 1000, 'MM/dd HH:mm');
    }
}
