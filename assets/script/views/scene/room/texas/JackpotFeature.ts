import { ServerMessageJackpotAward } from '@silenthill/agreement-web';
import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../../core/decorator/DataBind';
import { createLogger } from '../../../../core/decorator/LogTrace';
import roomDataManager from '../../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataBasic from '../../../../data/room/texas/TexasGameRoomDataBasic';
import h5MessageManager from '../../../../H5MsgMgr';
import { WebOrgJackpotTemplateInfo, WebStatsJackpotAwardLogs, WWW } from '../../../../net/https/WebRequest';

const { ccclass, property, menu } = cc._decorator;

const _log = createLogger('JackpotFeature');

interface JackpotPanelAwardLogs {
    request_key: string;
    items: unknown[];
    top_cards_type_data: unknown;
}

interface JackpotPanelCacheData {
    template: unknown;
    awardLogs: JackpotPanelAwardLogs | null;
}

/**
 * 牌桌内 Jackpot 展示与交互（对应 pokerqueen TexasGameJackpot）：
 * - 奖池金额显示与滚动动画（1129 JackpotGoldChange）
 * - 自己坐下后的开场动画
 * - 点击按钮 → H5 showPanel(jackpotRecord)，附带预加载的模版/获奖记录
 * - 1130 JackpotAward 中奖广播 → H5 showPanel(jackpotAward)
 */
@ccclass
@menu('Scene/Room/Texas/JackpotFeature')
export default class JackpotFeature extends cc.Component {
    private static readonly JACKPOT_AWARD_LIMIT: number = 15;
    private static readonly panelCache: Map<number, JackpotPanelCacheData> = new Map();
    @property({ type: cc.Node, displayName: 'Jackpot按钮 Button_Jackpot' })
    private jackpotButton: cc.Node = null;
    @property({ type: cc.Label, displayName: 'Jackpot奖池金额 Button_Jackpot/Label_Gold' })
    private goldLabel: cc.Label = null;
    @property({ type: cc.Node, displayName: 'Jackpot开场动画 JackpotAnimRoot' })
    private animRoot: cc.Node = null;
    private _basicInfo: TexasGameRoomDataBasic = null;
    private _roomID: number = 0;
    private _rollData: { value: number } | null = null;
    private _startAnimRollTarget: number = 0; // 开场动画结束后金额滚动的目标值（元）

    protected onLoad(): void {
        if (this.jackpotButton) this.jackpotButton.on('click', this.onClickJackpot, this);
    }

    /** 进桌初始化：刷新显示并预加载 H5 面板数据 */
    public initData(roomID: number, matchID: number): void {
        const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
        this._basicInfo = roomData.basicInfo;
        this._roomID = roomID;
        this._resetVisual();
        if (this.node.activeInHierarchy) {
            this._bindEvents();
        }
        this._refreshUI();
        JackpotFeature.panelCache.delete(roomID);
        void this._preloadPanelData();
    }

    protected onEnable(): void {
        if (!this._basicInfo) return;
        this._bindEvents();
        this._refreshUI();
    }

    protected onDisable(): void {
        unBindEventsAll(this);
        this._resetVisual();
    }

    private _bindEvents(): void {
        autoBindEvents(this, { basic: this._basicInfo });
    }

    /** 1129 奖池变化：滚动到最新金额（displayPool 单位分，来自事件参数） */
    @bindEvent(TexasGameRoomDataBasic.JACKPOT_CHANGE, { dataSource: 'basic', initIgnore: true })
    private onJackpotPoolChange(hasJackpot: boolean, displayPool: number): void {
        if (!hasJackpot) {
            this._hideUI();
            return;
        }
        const from = this._getCurrentDisplayGold();
        this._showUI(false);
        this._rollGold(from, JackpotFeature._toDisplayValue(displayPool), 3);
    }

    /** 自己坐下后的开场动画，结束后金额从 0 滚动到事件带来的当前值 */
    @bindEvent(TexasGameRoomDataBasic.JACKPOT_START_ANIM, { dataSource: 'basic', initIgnore: true })
    private onJackpotStartAnim(hasJackpot: boolean, displayPool: number): void {
        if (!hasJackpot) {
            this._hideUI();
            return;
        }
        this._startAnimRollTarget = JackpotFeature._toDisplayValue(displayPool);
        const animRoot = this.animRoot;
        const anim = animRoot?.getComponent(cc.Animation);
        if (!animRoot || !anim) {
            this._showUI();
            return;
        }
        const clipName = this._resolveStartClip(anim);
        if (!clipName) {
            animRoot.active = false;
            this._showUI();
            return;
        }
        if (this.jackpotButton) {
            this.jackpotButton.active = false;
        }
        animRoot.active = true;
        anim.stop();
        anim.off('finished', this._onStartAnimFinished, this);
        anim.on('finished', this._onStartAnimFinished, this);
        anim.play(clipName);
    }

    /** 1130 中奖广播 → H5 弹获奖面板 */
    @bindEvent(TexasGameRoomDataBasic.JACKPOT_AWARD, { dataSource: 'basic', initIgnore: true })
    private onJackpotAward(awardUsersList: ServerMessageJackpotAward.AsObject['awardUsersList']): void {
        if (!awardUsersList?.length) return;
        h5MessageManager.sendToH5('showPanel', 1, {
            panelType: 'jackpotAward',
            title: '',
            props: { awardUsersList }
        });
    }

    /** 点击 Jackpot 按钮 → H5 弹出奖池记录面板 */
    private onClickJackpot(): void {
        const basicInfo = this._basicInfo;
        if (!basicInfo?.hasJackpot) return;
        const panelCache = JackpotFeature.panelCache.get(this._roomID) || null;
        h5MessageManager.sendToH5('showPanel', 1, {
            panelType: 'jackpotRecord',
            title: '',
            props: {
                jackpot_id: Number(basicInfo.jackpotID || 0),
                game_type: Number(basicInfo.gameType || 0),
                poker_type: Number(basicInfo.pokerType || 0),
                limit_bet_type: Number(basicInfo.betType || 0),
                bombpot: basicInfo.bombpotStatusEnabled ? 1 : 0,
                small_blind: Number(basicInfo.sbante?.sb || 0),
                jackpot_gold: Number(basicInfo.jackpotPool || 0),
                jackpot_parent_gold: Number(basicInfo.jackpotDisplayPool || 0),
                initial_template: panelCache?.template || null,
                initial_records: panelCache?.awardLogs?.items || [],
                initial_top_record: panelCache?.awardLogs?.top_cards_type_data || null,
                initial_record_request_key: panelCache?.awardLogs?.request_key || ''
            }
        });
    }

    /** 停滚动、停动画、隐藏 UI（换房/隐藏时） */
    private _resetVisual(): void {
        this._stopGoldRoll();
        this._hideUI();
        const animRoot = this.animRoot;
        const anim = animRoot?.getComponent(cc.Animation);
        anim?.off('finished', this._onStartAnimFinished, this);
        anim?.stop();
        if (animRoot) {
            animRoot.active = false;
        }
    }

    private _onStartAnimFinished(): void {
        const animRoot = this.animRoot;
        if (animRoot && cc.isValid(animRoot)) {
            animRoot.active = false;
        }
        this._showUI(false);
        this._rollGold(0, this._startAnimRollTarget, 3);
    }

    private _refreshUI(): void {
        if (!this._basicInfo?.hasJackpot) {
            this._hideUI();
            return;
        }
        this._showUI();
    }

    private async _preloadPanelData(): Promise<void> {
        const basicInfo = this._basicInfo;
        const jackpotId = Number(basicInfo.jackpotID || 0);
        const roomId = this._roomID;
        if (jackpotId <= 0 || roomId <= 0) {
            return;
        }
        const requestKey = this._getAwardRequestKey();
        try {
            const [templateRes, awardRes] = await Promise.all([
                WWW.Instance.CommonAPI<any>({
                    web_class: WebOrgJackpotTemplateInfo,
                    body: { jackpot_id: jackpotId },
                    juhua: false
                }),
                WWW.Instance.CommonAPI<any>({
                    web_class: WebStatsJackpotAwardLogs,
                    body: {
                        jackpot_id: jackpotId,
                        game_type: [Number(basicInfo.gameType || 0)],
                        poker_type: [Number(basicInfo.pokerType || 0)],
                        limit_bet_type: [Number(basicInfo.betType || 0)],
                        bombpot: [basicInfo.bombpotStatusEnabled ? 1 : 0],
                        start_time: 0,
                        end_time: 0,
                        limit: JackpotFeature.JACKPOT_AWARD_LIMIT,
                        offset: 0
                    },
                    juhua: false
                })
            ]);
            // 请求期间换房/换模版则丢弃
            if (Number(basicInfo.jackpotID || 0) !== jackpotId) {
                return;
            }
            JackpotFeature.panelCache.set(roomId, {
                template: Number(templateRes?.code || 0) === 0 ? templateRes?.data?.item || null : null,
                awardLogs:
                    Number(awardRes?.code || 0) === 0
                        ? {
                              request_key: requestKey,
                              items: Array.isArray(awardRes?.data?.items) ? awardRes.data.items : [],
                              top_cards_type_data: awardRes?.data?.top_cards_type_data || null
                          }
                        : null
            });
        } catch (error) {
            _log.warn('preloadPanelData failed', error);
        }
    }

    private _getAwardRequestKey(): string {
        const basicInfo = this._basicInfo;
        return [Number(basicInfo.gameType || 0), Number(basicInfo.pokerType || 0), Number(basicInfo.betType || 0), basicInfo.bombpotStatusEnabled ? 1 : 0].join(
            '_'
        );
    }

    private _showUI(syncLabel: boolean = true): void {
        if (this.jackpotButton) {
            this.jackpotButton.active = true;
        }
        if (this.animRoot) {
            this.animRoot.active = false;
        }
        if (syncLabel) {
            this._setGoldLabel(`${JackpotFeature._toDisplayValue(this._basicInfo?.jackpotDisplayPool || 0)}`);
        }
    }

    private _hideUI(): void {
        if (this.jackpotButton) {
            this.jackpotButton.active = false;
        }
        this._setGoldLabel('');
    }

    private _setGoldLabel(value: string): void {
        const label = this.goldLabel;
        if (!label || !label.node || !label.node.isValid) {
            return;
        }
        label.string = value;
    }

    /** 奖池展示值：分 → 元取整 */
    private static _toDisplayValue(pool: number): number {
        return Math.floor(Number(pool || 0) / 100);
    }

    private _getCurrentDisplayGold(): number {
        const label = this.goldLabel;
        if (!label) {
            return 0;
        }
        const value = Number((label.string || '0').replace(/,/g, ''));
        return Number.isFinite(value) ? Math.floor(value) : 0;
    }

    private _rollGold(from: number, to: number, duration: number): void {
        this._stopGoldRoll();
        if (from === to || duration <= 0) {
            this._setGoldLabel(`${to}`);
            return;
        }
        this._rollData = { value: from };
        const rollData = this._rollData;
        cc.tween(rollData)
            .to(
                duration,
                { value: to },
                {
                    progress: (start: number, end: number, current: number, ratio: number) => {
                        const val = start + (end - start) * ratio;
                        this._setGoldLabel(`${Math.floor(val)}`);
                        return val;
                    }
                }
            )
            .call(() => {
                this._setGoldLabel(`${to}`);
                if (this._rollData === rollData) {
                    this._rollData = null;
                }
            })
            .start();
    }

    private _stopGoldRoll(): void {
        if (this._rollData) {
            cc.Tween.stopAllByTarget(this._rollData);
            this._rollData = null;
        }
    }

    private _resolveStartClip(anim: cc.Animation): string {
        const clips = anim.getClips?.() || [];
        if (!anim.defaultClip && clips.length > 0) {
            anim.defaultClip = clips[0];
        }
        const preferred = ['jackpot_start', 'jackpot', 'start'];
        for (let i = 0; i < preferred.length; i++) {
            const clipName = preferred[i];
            if (clips.find(c => c && c.name === clipName)) {
                return clipName;
            }
        }
        return anim.defaultClip?.name || '';
    }
}
