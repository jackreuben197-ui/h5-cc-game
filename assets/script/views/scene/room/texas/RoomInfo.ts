import { autoBindEvents, bindEvent } from '../../../../core/decorator/DataBind';
import { traceClass } from '../../../../core/decorator/LogTrace';
import roomDataManager from '../../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataBasic from '../../../../data/room/texas/TexasGameRoomDataBasic';
import { StringHelper } from '../../../../helper/StringHelper';
import { i18nMgr } from '../../../../i18n/i18nMgr';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('CrazyPoker/Room/Texas/RoomInfo')
@traceClass()
export default class RoomInfo extends cc.Component {
    @property(cc.Label)
    private roomInfoLabel: cc.Label = null;
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
        if (!this._roomBaseInfo) return;
        this._bindEventsAndRefresh();
    }

    public onDisable(): void {
        if (this._roomBaseInfo) {
            this._roomBaseInfo.targetOff(this);
            this._roomBaseInfo = null;
        }
    }

    private _bindEventsAndRefresh() {
        // this._roomBaseInfo.on(TexasGameRoomDataBasic.TABLE_BET_INFO_CHANGE, this.onUpdateText, this);
        // this._roomBaseInfo.on(TexasGameRoomDataBasic.TABLE_HANDINFO_CHANGE, this.onUpdateText, this);
        autoBindEvents(this, {
            basic: this._roomBaseInfo
        });
    }

    @bindEvent(TexasGameRoomDataBasic.TABLE_BET_INFO_CHANGE, 'basic')
    @bindEvent(TexasGameRoomDataBasic.TABLE_HANDINFO_CHANGE, 'basic')
    private onUpdateText() {
        let info: string = ``;
        if (this._roomBaseInfo.invitationCode != '') {
            info += `${this._roomBaseInfo.invitationCode}\n`;
        }
        info += `${this._roomBaseInfo.roomName}`;
        info += `\n${this._getRoomType()}`;
        info += `\n${this._roomID}-${this._roomBaseInfo.handNum}`;
        let straddleStr: string = '';
        // if (this.isBombPot) {
        //     info += `\n${CPErrorCode.LanguageDescription(20006)}${StringHelper.GetLongString(this.smallBlind * 2)} ${(straddleStr = this.CurStraddle ? 'straddle' : '')}`;
        // } else if (this.groupBet > 0) {
        //     info += `\n${CPErrorCode.LanguageDescription(20006)}${StringHelper.GetLongString(this.smallBlind)}/${StringHelper.GetLongString(this.bigBlind)}(${StringHelper.GetLongString(this.groupBet)}) ${(straddleStr = this.CurStraddle ? 'straddle' : '')}`;
        // } else {
        info += `\n${i18nMgr.Get('adaptation20006')}${StringHelper.GetLongString(this._roomBaseInfo.sbante.sb)}/${StringHelper.GetLongString(this._roomBaseInfo.sbante.sb * 2)}`;
        //}
        // //带出，最小带入倍数 RT_MANUAL手动的
        // if (this.CurlimitOutChip == RoomInfo.RetainType.RT_MANUAL) {
        //     info += `\n${CPErrorCode.LanguageDescription(20087)}:${(this._roomBaseInfo.carry_small * this.CurrentMinRate) / 100}`;
        // }
        let insuranceStr = '';
        // if (this.isGPSRestrictions && this.isIpRestrictions) {
        //     // "GPS  IP限制";
        //     info += `\n${(insuranceStr = this._roomBaseInfo.insurance ? CPErrorCode.LanguageDescription(10021) + ' ' : '')}GPS  IP${CPErrorCode.LanguageDescription(20008)}`;
        // } else if (this.isGPSRestrictions && !this.isIpRestrictions) {
        //     //"GPS限制";
        //     info += `\n${(insuranceStr = this._roomBaseInfo.insurance ? CPErrorCode.LanguageDescription(10021) + ' ' : '')}GPS${CPErrorCode.LanguageDescription(20008)}`;
        // } else if (!this.isGPSRestrictions && this.isIpRestrictions) {
        //     // "IP限制;
        //     info += `\n${(insuranceStr = this._roomBaseInfo.insurance ? CPErrorCode.LanguageDescription(10021) + ' ' : '')}IP${CPErrorCode.LanguageDescription(20008)}`;
        // } else if (this._roomBaseInfo.insurance) {
        //     info += `\n${CPErrorCode.LanguageDescription(10021)}`;
        // }
        if (this._roomBaseInfo.delaySeeCard) {
            info += `\n${i18nMgr.Get('adaptation20088')}`;
        }
        // info += this.mushroomFeature.BuildRoomDesc();
        // info += this.squidFeature.BuildRoomDesc();
        // info += this.BuildCriticalHitRoomDesc();
        // if (this.callTime == 1) {
        //     info += `\nCallTime:${i18nMgr.Get('UIClub_GainNum')}${this.callTimeWinline}BB ${this.callTimeLimitCount}${i18nMgr.Get('UIMine_RecordDetailForNormal_ss')}`;
        // }
        info += '\n\n';
        this.roomInfoLabel.string = info;
    }

    private _getRoomType(): string {
        let gameTypeStr: string = i18nMgr.Get('GameType_' + this._roomBaseInfo.gameType);
        let pokerTypeStr: string = i18nMgr.Get('PokerType_' + this._roomBaseInfo.pokerType);
        let betTypeStr: string = i18nMgr.Get('BetType_' + this._roomBaseInfo.betType);
        return gameTypeStr + '-' + pokerTypeStr + '-' + betTypeStr;
    }
}
