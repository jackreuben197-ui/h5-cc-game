import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../../core/decorator/DataBind';
import { traceClass, traceMethod } from '../../../../core/decorator/LogTrace';
import TexasGameRoomDataBasic from '../../../../data/room/texas/TexasGameRoomDataBasic';
import TexasGameRoomDataPlayerMine from '../../../../data/room/texas/TexasGameRoomDataPlayerMine';
import ccviewData, { CCViewData } from '../../../../data/system/CCViewData';
import { AnimateDisplayTypePlayType } from '../../../../game/constant/AnimateDisplayType';
import { SquidMode } from '../../../../game/constant/Squid';
import { i18nMgr } from '../../../../i18n/i18nMgr';
import { UISquidEndItemShowData } from '../../../dialog/squidover/UISquidEndItem';
import viewManager from '../../../UIViewManager';
import TexasTableEvent from './events/TexasTableEvent';
import AssetManager, { BUNDLE_RESOURCES } from '../../../loader/AssetManager';
import { sampleLiveBounds, getAnimDuration } from '../../../util/SpineBoundsUtil';

const { ccclass, property, menu } = cc._decorator;

/**
 *  更多游戏类型的绑定放这里
 */
@ccclass
@traceClass()
@menu('Scene/Room/Texas/MorePlayTypeInfo')
export default class MorePlayTypeInfo extends cc.Component {
    /**
     * 鱿鱼开场动画(SquidGame)的本地 Y 坐标。
     * 对齐 pokerqueen：其开场动画落在世界 Y≈1488(牌桌正中略偏上)。
     * 本项目该节点世界Y = 本地Y + 1344，故本地 y=144 即与 pokerqueen 一致。
     * 数值越大越靠上，越小越靠下，可按需微调。
     */
    private static readonly SQUID_START_TABLE_MIDDLE_Y = 144;
    /** 暴击开场 Spine(quanji) 资源路径——取自 pokerqueen 的 CriticalHit/quanji */
    private static readonly CRITICAL_HIT_SPINE_PATH = 'rc/other/effect/criticalHit/quanji';
    /** 暴击开场动画归一化目标尺寸(较大边像素)——对齐 pokerqueen */
    private static readonly CRITICAL_HIT_TARGET_SIZE = 900;
    /** 暴击开场动画所在的牌桌正中本地 Y(与鱿鱼开场一致) */
    private static readonly CRITICAL_HIT_CENTER_Y = 144;
    private _criticalHitSpineData: sp.SkeletonData = null;
    private _criticalHitSpineNode: cc.Node = null;
    @property({ type: cc.Node, displayName: '根节点' })
    private rootNode: cc.Button = null!;
    @property({ type: cc.Button, displayName: '加入鱿鱼按钮' })
    private joinButton: cc.Button = null!;
    @property({ type: sp.Skeleton, displayName: '鱿鱼开场动画' })
    private squidStartAnimation: sp.Skeleton = null!;
    @property({ type: cc.Animation, displayName: '暴击开场动画' })
    private critialHitStartAnimation: cc.Animation = null!;
    @property({ type: cc.Node, displayName: '左边鱿鱼按钮' })
    private squidButton: cc.Node = null;
    @property({ type: cc.Button, displayName: '鱿鱼轮站起按钮' })
    private squidStandUp: cc.Button = null!;
    @property({ type: cc.Node, displayName: '剩余鱿鱼节点' })
    private remainingSquidCount: cc.Node = null!;
    @property({ type: cc.Node, displayName: '剩余鱿鱼数量节点' })
    private remainingSquidLabel: cc.Node = null!;
    @property({ type: cc.Label, displayName: '剩余鱿鱼数量' })
    private remainingSquidLabelCount: cc.Label = null!;
    @property({ type: cc.Node, displayName: 'CallTime提示区域' })
    private callTimeArea: cc.Node = null;
    @property({ type: cc.Label, displayName: 'CallTime进度描述' })
    private callTimeLabel: cc.Label = null;
    private _mine: TexasGameRoomDataPlayerMine = null!;
    private _onJoinSquidClicked: () => void;

    protected onLoad(): void {
        //自动操作面板
        this._onJoinSquidClicked = () => {
            TexasTableEvent.JoinSquid(this._mine);
        };
        this.joinButton.node.on('click', this._onJoinSquidClicked, this);
        this.squidStartAnimation.node.active = false;
        // 鱿鱼开场动画(SquidGame)放到牌桌正中：预制体本地 y=-350(偏低)，抬升到牌桌中央。
        this.squidStartAnimation.node.y = MorePlayTypeInfo.SQUID_START_TABLE_MIDDLE_Y;
        this.squidStartAnimation.setCompleteListener(() => {
            this.squidStartAnimation.node.active = false;
        });
        this.squidStandUp.node.on('click', this.onSquidStandUpClicked, this);
    }

    public initData(mine: TexasGameRoomDataPlayerMine) {
        this._mine = mine;
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
        if (suggestScale < 1) {
            this.squidButton.height = 390;
            this.joinButton.node.setPosition(0, -visibleSizeHeight / 2 + 200 * suggestScale + 440 * suggestScale);
        } else {
            this.squidButton.height = 450;
            this.joinButton.node.setPosition(0, -visibleSizeHeight / 2 + 200 * suggestScale + 520);
        }
        const squidWidget = this.squidButton.getComponent(cc.Widget);
        squidWidget.top = saveAreaTop;
        squidWidget.updateAlignment();
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
        if (!this._mine) return;
        // 统一激活绑定，注入强类型 tag 推导过滤机制
        autoBindEvents(this, { mine: this._mine, basic: this._mine.roomData.basicInfo, ccviewData: ccviewData });
    }

    //=================== 鱿鱼 ==================================
    @bindEvent(TexasGameRoomDataPlayerMine.SHOW_SQUID_IN, 'mine')
    private onShowButton(): void {
        this._refreshJoinButton();
    }

    @bindEvent(TexasGameRoomDataBasic.SQUID_ENABLED, 'basic')
    @traceMethod()
    private onSquieStatusChange(b: boolean, ant: AnimateDisplayTypePlayType = AnimateDisplayTypePlayType.Staic) {
        if (b && ant == AnimateDisplayTypePlayType.Start) {
            this.squidStartAnimation.node.active = true;
            this.squidStartAnimation.setAnimation(0, 'animation', false);
        }
    }

    @bindEvent(TexasGameRoomDataBasic.SQUID_RESULTS, { dataSource: 'basic', initIgnore: true })
    private showResults(records: UISquidEndItemShowData[]) {
        if (records.length == 0) {
            viewManager.closeDialog('SquidOver');
            return;
        }
        viewManager.openDialog('SquidOver', {
            rows: records
        });
    }

    //===================== 暴击 ==========================================

    @bindEvent(TexasGameRoomDataBasic.CRITIAL_HIT_ENABLED, 'basic')
    @traceMethod()
    private onCriticalHitStatusChange(b: boolean, ant: AnimateDisplayTypePlayType = AnimateDisplayTypePlayType.Staic) {
        if (!(b && ant == AnimateDisplayTypePlayType.Start)) {
            return;
        }
        const node = this.critialHitStartAnimation.node;
        // 改用新的 Spine 动画(quanji)：停掉旧帧动画、隐藏旧静态精灵，节点移到牌桌正中(与鱿鱼开场一致)
        this.critialHitStartAnimation.stop();
        const sprite = node.getComponent(cc.Sprite);
        if (sprite) sprite.enabled = false;
        node.setPosition(0, MorePlayTypeInfo.CRITICAL_HIT_CENTER_Y);
        node.opacity = 255;
        node.scale = 1;
        node.active = true;
        this._playCriticalHitSpine(node);
    }

    /** 在暴击节点上动态加载并播放新的暴击开场 Spine(quanji)，布局/尺寸对齐 pokerqueen */
    private _playCriticalHitSpine(parent: cc.Node): void {
        this._stopCriticalHitSpine();
        const create = (data: sp.SkeletonData) => {
            if (!cc.isValid(this.node) || !cc.isValid(parent)) {
                return;
            }
            const spineNode = new cc.Node('CriticalHitSpine');
            const skeleton = spineNode.addComponent(sp.Skeleton);
            // 首帧透明，跳过 setup pose
            spineNode.opacity = 0;
            skeleton.skeletonData = data;
            parent.addChild(spineNode);
            skeleton.setAnimation(0, 'animation', false);
            const dur = getAnimDuration(skeleton, 'animation');
            // 下一帧：按实际包围盒归一化到目标尺寸并居中(采样会推进到末尾，采样后再从头重播并绑定结束回调)
            skeleton.scheduleOnce(() => {
                if (!spineNode.isValid) {
                    return;
                }
                const bnd = sampleLiveBounds(skeleton, dur);
                if (bnd.max > 0) {
                    const scale = MorePlayTypeInfo.CRITICAL_HIT_TARGET_SIZE / bnd.max;
                    spineNode.scale = scale;
                    spineNode.x = -(bnd.offX + bnd.szX / 2) * scale;
                    spineNode.y = -(bnd.offY + bnd.szY / 2) * scale;
                }
                skeleton.setAnimation(0, 'animation', false);
                skeleton.setCompleteListener(() => {
                    this._stopCriticalHitSpine();
                    if (cc.isValid(parent)) parent.active = false;
                });
                spineNode.opacity = 255;
            }, 0);
            this._criticalHitSpineNode = spineNode;
        };

        if (this._criticalHitSpineData) {
            create(this._criticalHitSpineData);
            return;
        }
        AssetManager.getOrLoad(BUNDLE_RESOURCES, MorePlayTypeInfo.CRITICAL_HIT_SPINE_PATH, sp.SkeletonData)
            .then((data: sp.SkeletonData) => {
                if (!data) {
                    if (cc.isValid(parent)) parent.active = false;
                    return;
                }
                this._criticalHitSpineData = data;
                create(data);
            })
            .catch((e: any) => {
                cc.warn('[MorePlayTypeInfo] 加载暴击 Spine 失败', e && e.message);
                if (cc.isValid(parent)) parent.active = false;
            });
    }

    private _stopCriticalHitSpine(): void {
        if (this._criticalHitSpineNode) {
            if (this._criticalHitSpineNode.isValid) this._criticalHitSpineNode.destroy();
            this._criticalHitSpineNode = null;
        }
    }

    @bindEvent(TexasGameRoomDataBasic.SQUID_ENABLED, 'basic')
    private onSquidStatusChanged(enabled: boolean): void {
        this.remainingSquidCount.active = enabled;
        this.remainingSquidLabel.active = enabled;
        this._refreshRemainingSquidCount();
        this._refreshSquidStandUp();
        this._refreshJoinButton();
    }

    @bindEvent(TexasGameRoomDataBasic.SQUID_REMAINING_COUNT_CHANGED, { dataSource: 'basic', initIgnore: true })
    private onSquidRemainingCountChanged(): void {
        this._refreshRemainingSquidCount();
    }

    @bindEvent(TexasGameRoomDataPlayerMine.SEATNO_CHANGED, 'mine')
    private onMineSeatChanged(): void {
        this._refreshSquidStandUp();
        this._refreshJoinButton();
    }

    private onSquidStandUpClicked(): void {
        if (this._mine.seatNo == 0) {
            viewManager.showToast(i18nMgr.Get('Good_luck'));
            return;
        }
        // 鱿鱼模式下的站起需要额外确认逻辑
        const mine = this._mine.player;
        if (this._mine.roomData.basicInfo.hasSquid && this._mine.roomData.basicInfo.squidStatusEnabled && mine.squidIn) {
            if (this._mine.roomData.basicInfo.squidMode === SquidMode.NORMAL) {
                if (mine.isKeepSeat) {
                    TexasTableEvent.CancelKeepSeat(this._mine);
                } else {
                    TexasTableEvent.Standup(this._mine);
                }
                return;
            }
            if (this._mine.roomData.basicInfo.squidMode === SquidMode.XZ) {
                if (mine.squidCount <= 0) {
                    viewManager.openDialog('ConfirmOrNotice', {
                        title: i18nMgr.Get('UIGuild_TipsTitle'),
                        content: i18nMgr.Get('UISquid_Tips3'),
                        commit: i18nMgr.Get('adaptation10012'),
                        cancel: i18nMgr.Get('adaptation10013'),
                        commit_click: () => {
                            if (mine.isKeepSeat) {
                                TexasTableEvent.CancelKeepSeat(this._mine);
                            } else {
                                TexasTableEvent.Standup(this._mine);
                            }
                        }
                    });
                }
                return;
            }
        }
        TexasTableEvent.Standup(this._mine);
    }

    //===================== CallTime ==========================================

    @bindEvent(TexasGameRoomDataPlayerMine.CALL_TIME_CHANGE, 'mine')
    private onCallTimeChanged(): void {
        if (!this.callTimeArea) return;
        const basicInfo = this._mine.roomData.basicInfo;
        const show = basicInfo.hasCallTime && this._mine.callTimeStay;
        this.callTimeArea.active = show;
        if (!this.callTimeLabel) return;
        this.callTimeLabel.string = show ? `Profit ${basicInfo.callTimeWinline}BB ${this._mine.callTimeCount}/${basicInfo.callTimeLimit} hands` : '';
    }

    private _refreshSquidStandUp(): void {
        this.squidStandUp.node.active = this._mine.roomData.basicInfo.squidStatusEnabled && this._mine.seatNo > 0;
    }

    private _refreshJoinButton(): void {
        this.joinButton.node.active = this._mine.roomData.basicInfo.squidStatusEnabled && this._mine.seatNo > 0 && this._mine.showSquidInButton;
    }

    private _refreshRemainingSquidCount(): void {
        const roomData = this._mine.roomData;
        if (!roomData.basicInfo.squidStatusEnabled) return;
        let playerCount = 0;
        let markedTotal = 0;
        roomData.seatsStateManager.forEachPlayer(player => {
            if (!player.squidIn) return;
            playerCount++;
            markedTotal += player.squidCount;
        });
        let total = 0;
        if (roomData.basicInfo.squidMode === SquidMode.XZ) {
            total = roomData.basicInfo.squidTotalLimit;
            if (roomData.basicInfo.squidTail) total++;
        } else {
            total = Math.max(playerCount - 1, 0);
            if (roomData.basicInfo.squidHead) total++;
            if (roomData.basicInfo.squidTail) total++;
        }
        this.remainingSquidLabelCount.string = `${Math.max(0, total - markedTotal)}`;
    }
}
