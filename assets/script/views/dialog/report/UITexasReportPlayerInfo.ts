import { traceClass } from '../../../core/decorator/LogTrace';
import { StringHelper } from '../../../helper/StringHelper';
import { WebStatsOtherUserStats, WWW } from '../../../net/https/WebRequest';
import UIComponentBaseDialog from '../../base/UIComponentDialogBase';
import RemoteSprite from '../../widget/RemoteSprite';

const { ccclass, menu } = cc._decorator;

export type UITexasReportPlayerInfoParam = {
    userRid: number;
    nickName?: string;
    avatar?: string;
};

/**
 * 战绩玩家详情子对话框（对应 pokerqueen UITexasReportPlayerInfo）。
 *
 * 设计：
 *  - 仍是 dialog 形态：由 UITexasReport 点击玩家行触发 viewManager.openDialog('TexasReportPlayerInfo', {...})。
 *  - 数据：调 WebStatsOtherUserStats —— 拿生涯 vpip/prf/胜率/场均盈亏，写到底部固定 6 个 Label。
 *  - 头像：用 RemoteSprite 自动 url 加载（替代旧的 WebImageHelper）。
 *  - 名字直接用 param 里上层带过来的 nickName/avatar，避免再请求一次用户信息接口（h5-cc-game 没有 LobbyControl）。
 */
@ccclass
@menu('Dialog/Report/UITexasReportPlayerInfo')
@traceClass({ level: 'debug' })
export default class UITexasReportPlayerInfo extends UIComponentBaseDialog<UITexasReportPlayerInfoParam> {
    private _userRid: number = 0;
    private _statsToken: number = 0;
    private _isClosing: boolean = false;
    private _lblId: cc.Label = null;
    private _lblName: cc.Label = null;
    private _lblGold: cc.Label = null;
    private _imgHead: cc.Node = null;
    private _panelBottom: cc.Node = null;
    private _btnClose: cc.Node = null;
    private _panelClick: cc.Node = null;

    protected onLoad(): void {
        const find = (p: string) => cc.find(p, this.node);
        this._lblId = find('lbl_id')?.getComponent(cc.Label) || null;
        this._lblName = find('lbl_name')?.getComponent(cc.Label) || null;
        this._lblGold = find('lbl_gold')?.getComponent(cc.Label) || null;
        this._imgHead = find('img_head');
        this._panelBottom = find('panel_bottom');
        this._btnClose = find('btn_close');
        this._panelClick = find('panel_click');
        const close = () => this.close();
        if (this._btnClose) this._btnClose.on(cc.Node.EventType.TOUCH_END, close, this);
        if (this._panelClick) this._panelClick.on(cc.Node.EventType.TOUCH_END, close, this);
    }

    public initialize(param: UITexasReportPlayerInfoParam): void {
        this._userRid = Number(param.userRid) || 0;
        this._isClosing = false;
        if (this._lblId) this._lblId.string = `ID:${this._userRid}`;
        if (this._lblName && param.nickName) this._lblName.string = StringHelper.LengthNick(param.nickName);
        this._applyAvatar(param.avatar || '');
        this._resetBottomLabels();
        const token = ++this._statsToken;
        WWW.Instance
            .CommonAPI({
                web_class: WebStatsOtherUserStats,
                api_id: this._userRid
            } as any)
            .then(
                (resp: any) => {
                    if (this._isClosing || !cc.isValid(this.node) || token !== this._statsToken) return;
                    if (Number(resp?.code || 0) === 0) this._refreshStats(resp);
                },
                () => {}
            );
    }

    public close(): void {
        this._isClosing = true;
        this._statsToken += 1;
        super.close();
    }

    private _applyAvatar(url: string): void {
        if (!this._imgHead || !url) return;
        const remote = this._imgHead.getComponent(RemoteSprite) || this._imgHead.addComponent(RemoteSprite);
        remote.url = url;
    }

    private _resetBottomLabels(): void {
        if (!this._panelBottom) return;
        this._panelBottom.children.forEach(c => {
            const lbl = c.getComponent(cc.Label);
            if (lbl) lbl.string = '';
        });
    }

    /**
     * 按 pokerqueen 原版顺序填 6 个 Label：
     *   [0] total_game_cnt  [1] vpip%  [2] prf%  [3] total_hand  [4] wins%  [5] 场均盈亏（/100）
     */
    private _refreshStats(resp: any): void {
        const roomData = resp?.data?.data?.room_data?.[0] || resp?.data?.room_data?.[0];
        if (!roomData || !this._panelBottom) return;
        const ordered: string[] = [
            `${roomData.total_game_cnt || 0}`,
            `${roomData.vpip || 0}%`,
            `${roomData.prf || 0}%`,
            `${roomData.total_hand || 0}`,
            `${roomData.wins || 0}%`,
            `${((roomData.aveage_earn_hundred || 0) / 100).toString()}`
        ];
        this._panelBottom.children.forEach((c, idx) => {
            const lbl = c.getComponent(cc.Label);
            if (lbl && ordered[idx] != null) lbl.string = ordered[idx];
        });
    }
}
