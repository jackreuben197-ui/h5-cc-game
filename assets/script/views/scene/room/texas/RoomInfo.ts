import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../../core/decorator/DataBind';
import { traceClass } from '../../../../core/decorator/LogTrace';
import roomDataManager from '../../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataBasic from '../../../../data/room/texas/TexasGameRoomDataBasic';
import { StringHelper } from '../../../../helper/StringHelper';
import { CPErrorCode } from '../../../../i18n/CPErrorCode';
import { i18nMgr } from '../../../../i18n/i18nMgr';
import { RoomInfo as RoomInfoPb } from '../../../../protobuf/holdem/define_pb';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('Scene/Room/Texas/RoomInfo')
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
        this._bindEventsAndRefresh();
    }

    public onDisable(): void {
        unBindEventsAll(this);
    }

    private _bindEventsAndRefresh() {
        if (!this._roomBaseInfo) return;
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
}
