import { RoomInfo as RoomInfoPb } from '@silenthill/agreement-web';
import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../../core/decorator/DataBind';
import { traceClass } from '../../../../core/decorator/LogTrace';
import roomDataManager from '../../../../data/room/RoomDataManager';
import texasGamePersonalSettings, { TexasGamePersonalSettings } from '../../../../data/room/texas/TexasGamePersonalSettings';
import TexasGameRoomData from '../../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataBasic from '../../../../data/room/texas/TexasGameRoomDataBasic';
import dlTexasRoomBackground from '../../../../data/room/texas/load/DLTexasRoomBacground';
import { AnimateDisplayBackground } from '../../../../game/constant/AnimateDisplayType';
import { StringHelper } from '../../../../helper/StringHelper';
import { CPErrorCode } from '../../../../i18n/CPErrorCode';
import { i18nMgr } from '../../../../i18n/i18nMgr';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('Scene/Room/Texas/RoomInfo')
@traceClass()
export default class RoomInfo extends cc.Component {
    @property(cc.Label)
    private roomInfoLabel: cc.Label = null;
    @property(cc.Sprite)
    private bgSprite: cc.Sprite = null!;
    @property(sp.Skeleton)
    private bgAnim: sp.Skeleton = null;
    private _roomID: number;
    private _matchID: number;
    private _roomBaseInfo: TexasGameRoomDataBasic;

    public initData(roomID: number, matchID: number) {
        this._roomID = roomID;
        this._matchID = matchID;
        const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
        this._roomBaseInfo = roomData.basicInfo;
        if (this.node.activeInHierarchy) {
            this._bindEventsAndRefresh();
        }
    }

    public onLoad() {
        // 如果绑定点击写这里
    }

    public onEnable(): void {
        this._bindEventsAndRefresh();
    }

    public onDisable(): void {
        unBindEventsAll(this);
    }

    private _bindEventsAndRefresh() {
        if (!this._roomBaseInfo) return;
        autoBindEvents(this, {
            basic: this._roomBaseInfo,
            setting: texasGamePersonalSettings
        });
    }

    @bindEvent(TexasGameRoomDataBasic.TABLE_BET_INFO_CHANGE, 'basic')
    @bindEvent(TexasGameRoomDataBasic.TABLE_HANDINFO_CHANGE, 'basic')
    @bindEvent(TexasGameRoomDataBasic.SQUID_ENABLED, 'basic')
    @bindEvent(TexasGameRoomDataBasic.CRITIAL_HIT_ENABLED, 'basic')
    @bindEvent(TexasGameRoomDataBasic.SQUID_ENABLED, 'basic')
    private onUpdateText() {
        let info: string = ``;
        if (this._roomBaseInfo.invitationCode != '') {
            info += `${this._roomBaseInfo.invitationCode}\n`;
        }
        info += `${this._roomBaseInfo.roomName}`;
        info += `\n${this._getRoomType()}`;
        info += `\n${this._roomID}-${this._roomBaseInfo.handNum}`;
        let straddleStr: string = '';
        if (this._roomBaseInfo.hasBombPot) {
            // BB straddle
            info += `\n${CPErrorCode.LanguageDescription(20006)} ${StringHelper.GetLongString(this._roomBaseInfo.sbante.sb * 2)} ${this._roomBaseInfo.straddle ? 'straddle' : ''}`;
        } else {
            // SB/BB(ANTE) straddle
            info += `\n${CPErrorCode.LanguageDescription(20006)} ${StringHelper.GetLongString(this._roomBaseInfo.sbante.sb)}/${StringHelper.GetLongString(this._roomBaseInfo.sbante.sb * 2)}`;
            if (this._roomBaseInfo.sbante.ante > 0) {
                info += `(${StringHelper.GetLongString(this._roomBaseInfo.sbante.ante)})`;
            }
            info += ` ${this._roomBaseInfo.straddle ? 'straddle' : ''}`;
        }
        // //带出，最小带入倍数 RT_MANUAL手动的
        if (this._roomBaseInfo.retainType == RoomInfoPb.RetainType.RT_MANUAL) {
            info += `\n${CPErrorCode.LanguageDescription(20087)}:${(this._roomBaseInfo.sbante.sb * 2 * this._roomBaseInfo.retainMinRate) / 100}`;
        }
        let insuranceStr = '';
        if (this._roomBaseInfo.limitGPS && this._roomBaseInfo.limitIP) {
            // "GPS  IP限制";
            info += `\n${(insuranceStr = this._roomBaseInfo.hasInsurance ? CPErrorCode.LanguageDescription(10021) + ' ' : '')}GPS  IP${CPErrorCode.LanguageDescription(20008)}`;
        } else if (this._roomBaseInfo.limitGPS && !this._roomBaseInfo.limitIP) {
            //"GPS限制";
            info += `\n${(insuranceStr = this._roomBaseInfo.hasInsurance ? CPErrorCode.LanguageDescription(10021) + ' ' : '')}GPS${CPErrorCode.LanguageDescription(20008)}`;
        } else if (!this._roomBaseInfo.limitGPS && this._roomBaseInfo.limitIP) {
            // "IP限制;
            info += `\n${(insuranceStr = this._roomBaseInfo.hasInsurance ? CPErrorCode.LanguageDescription(10021) + ' ' : '')}IP${CPErrorCode.LanguageDescription(20008)}`;
        } else if (this._roomBaseInfo.hasInsurance) {
            info += `\n${CPErrorCode.LanguageDescription(10021)}`;
        }
        if (this._roomBaseInfo.delaySeeCard) {
            info += `\n${i18nMgr.Get('adaptation20088')}`;
        }
        if (this._roomBaseInfo.hasMushroom) {
            info += `\n1${i18nMgr.Get('UIMush')} = ${StringHelper.GetLongString(this._roomBaseInfo.mushroomBase)} `;
            info += `\n${i18nMgr.Get('UIMushYaJin')}: ${StringHelper.GetLongString(this._roomBaseInfo.mushroomBase * (this._roomBaseInfo.mushroomMode || 1))}`;
        }
        if (this._roomBaseInfo.hasSquid) {
            if (this._roomBaseInfo.squidStatusEnabled) {
                info += `\n${i18nMgr.Get('UISquidOpen')}:1/1`;
            } else {
                const totalRound = this._roomBaseInfo.squidWaitRounds;
                const currentRound = this._roomBaseInfo.currentConfigContinueRounds + 1;
                info += `\n${i18nMgr.Get('UISquidWaitOpen')}:${currentRound}/${totalRound}`;
            }
            info += `\n${i18nMgr.Get('UIGameTableSquidShow')}:${StringHelper.GetLongString(this._roomBaseInfo.squidBase)}`;
            info += `\n${i18nMgr.Get('UIFantasy_dairuyajin')}:${StringHelper.GetLongString(this._roomBaseInfo.deposit)}`;
            info += `\n${i18nMgr.Get('UISquidOpenPeopleNumber')}:${this._roomBaseInfo.squidPlayerCountLimit}/${this._roomBaseInfo.seatsCount}`;
        }
        if (this._roomBaseInfo.hasCriticalHit) {
            const criticalHitBB = this._roomBaseInfo.getCriticalHitAnte(this._roomBaseInfo.sbante.sb * 2);
            info += `\n${i18nMgr.Get('UIHitGamePlayTips4')}:${criticalHitBB}BB`;
            // 开启
            if (this._roomBaseInfo.criticalHitStatusEnabled) {
                info += `\n${i18nMgr.Get('UIHitGamePlayOpen')}:${this._roomBaseInfo.critialHitStatusRounds + 1}/${this._roomBaseInfo.criticalHitRounds}`;
            }
        }
        if (this._roomBaseInfo.hasCallTime) {
            info += `\nCallTime:${i18nMgr.Get('UIClub_GainNum')}${this._roomBaseInfo.callTimeWinline}BB ${this._roomBaseInfo.callTimeLimit}${i18nMgr.Get('UIMine_RecordDetailForNormal_ss')}`;
        }
        info += '\n\n';
        this.roomInfoLabel.string = info;
    }

    private _getRoomType(): string {
        let gameTypeStr: string = i18nMgr.Get('GameType_' + this._roomBaseInfo.gameType);
        let pokerTypeStr: string = i18nMgr.Get('PokerType_' + this._roomBaseInfo.pokerType);
        let betTypeStr: string = i18nMgr.Get('BetType_' + this._roomBaseInfo.betType);
        return gameTypeStr + '-' + pokerTypeStr + '-' + betTypeStr;
    }

    @bindEvent(TexasGamePersonalSettings.DESK_TYPE_CHANGE, 'setting')
    private async onUpdateBg(deskType: number, bat: AnimateDisplayBackground = AnimateDisplayBackground.Static) {
        const bgData = await dlTexasRoomBackground.getBackground(deskType);
        this._fitDeskCover(bgData.SpriteFrame);
        if (bgData.Animataion && bat == AnimateDisplayBackground.Go) {
            this._playDeskSpine(bgData.Animataion);
        }
    }

    /**
     * 根据 deskType 播放对应的桌布 Spine 动画
     * 非动画桌布类型会清理已有节点
     */
    private _playDeskSpine(data: sp.SkeletonData): void {
        this.bgAnim.skeletonData = data;
        this.bgAnim.setAnimation(0, 'animation', true);
    }

    /**
     * 桌布 Cover 适配：保持贴图原始比例铺满 1242×2688，居中裁切多余部分
     *
     * 原理：
     * 1. 关闭 Widget（避免它强制拉伸节点尺寸导致 Sprite 拉伸变形）
     * 2. 将节点尺寸设为贴图原始尺寸（Sprite 按 1:1 渲染，不变形）
     * 3. 计算 cover 缩放 = max(目标宽/贴图宽, 目标高/贴图高)
     * 4. 设置 scale，节点居中（锚点 0.5,0.5），溢出部分被屏幕裁切
     */
    private _fitDeskCover(sp: cc.SpriteFrame): void {
        const sprite = this.bgSprite;
        sprite.spriteFrame = sp;
        const node = sprite.node;
        const sf = sprite.spriteFrame;
        // 贴图原始尺寸
        const texW = sf.getOriginalSize().width;
        const texH = sf.getOriginalSize().height;
        // 目标尺寸（设计分辨率）
        const targetW = 1242;
        const targetH = 2688;
        // 宽高比一致则无需 cover 处理
        if (Math.abs(texW / texH - targetW / targetH) < 0.01) {
            const widget = node.getComponent(cc.Widget);
            if (widget) widget.enabled = true;
            node.setScale(1, 1);
            return;
        }
        // 关闭 Widget，避免它强制设置节点尺寸导致拉伸
        const widget = node.getComponent(cc.Widget);
        if (widget) widget.enabled = false;
        // 节点尺寸设为贴图原始尺寸，Sprite 按 1:1 渲染不变形
        node.setContentSize(texW, texH);
        // Cover 缩放：取较大值，保证宽和高都 >= 目标
        const scale = Math.max(targetW / texW, targetH / texH);
        node.setScale(scale, scale);
    }
}
