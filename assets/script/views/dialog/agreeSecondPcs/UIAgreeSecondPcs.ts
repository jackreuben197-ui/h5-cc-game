import { Code } from '@silenthill/agreement-web';
import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../core/decorator/DataBind';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataSecondPcs from '../../../data/room/texas/TexasGameRoomDataSecondPcs';
import TimeHelper from '../../../helper/TimeHelper';
import { CPErrorCode } from '../../../i18n/CPErrorCode';
import { i18nMgr } from '../../../i18n/i18nMgr';
import ProtocolAgency from '../../../net/websocket/ProtocolAgency';
import UIComponentBaseDialog from '../../base/UIComponentDialogBase';
import viewManager from '../../UIViewManager';
import RemoteSprite from '../../widget/RemoteSprite';

export interface UIAgreeSecondPcsParam {
    roomID: number;
    matchID: number;
}

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('Dialog/UIAgreeSecondPcs')
export default class UIAgreeSecondPcs extends UIComponentBaseDialog<UIAgreeSecondPcsParam> {
    private static readonly COLOR_OFF = cc.Color.fromHEX(new cc.Color(), '#363C65');
    private static readonly COLOR_ON = cc.Color.fromHEX(new cc.Color(), '#5FFF65');
    @property({ type: cc.Label, displayName: '标题文本' })
    private titleLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: '提示文本' })
    private tipsLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: '倒计时文本' })
    private countDownLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: '拒绝按钮文本' })
    private rejectLabel: cc.Label = null;
    @property({ type: cc.Label, displayName: '同意按钮文本' })
    private agreeLabel: cc.Label = null;
    @property({ type: cc.Button, displayName: '拒绝按钮' })
    private rejectButton: cc.Button = null;
    @property({ type: cc.Button, displayName: '同意按钮' })
    private agreeButton: cc.Button = null;
    @property({ type: cc.Label, displayName: '同意人数文本' })
    private agreeCountLabel: cc.Label = null;
    @property({ type: [cc.Node], displayName: '玩家头像节点' })
    private headNodes: cc.Node[] = [];
    @property({ type: [cc.Sprite], displayName: '玩家头像背景' })
    private headBackgrounds: cc.Sprite[] = [];
    @property({ type: [RemoteSprite], displayName: '玩家头像图片' })
    private headAvatars: RemoteSprite[] = [];
    private _roomData: TexasGameRoomData = null;
    private _participantSeatIds: number[] = [];

    protected onLoad(): void {
        this.rejectButton.node.on('click', this.onRejectClicked, this);
        this.agreeButton.node.on('click', this.onAgreeClicked, this);
    }

    public initialize(param: UIAgreeSecondPcsParam): void {
        this._roomData = roomDataManager.getRoomData<TexasGameRoomData>(param.roomID, param.matchID);
        this._participantSeatIds = this._roomData.secondPcs.participantSeatIds.slice();
        this.titleLabel.string = i18nMgr.Get('UIAgreeSecondPcs_title');
        this.tipsLabel.string = i18nMgr.Get('UIAgreeSecondPcs_agree');
        this.rejectLabel.string = i18nMgr.Get('adaptation10334');
        this.agreeLabel.string = i18nMgr.Get('adaptation20085');
        this.rejectButton.interactable = true;
        this.agreeButton.interactable = true;
        this._refreshPlayers();
        this._refreshAgreeCount();
        autoBindEvents(this, { secondPcs: this._roomData.secondPcs });
        this._refreshCountDown();
    }

    protected onDisable(): void {
        unBindEventsAll(this);
    }

    protected update(): void {
        if (!this._roomData) return;
        this._refreshCountDown();
        if (this._roomData.secondPcs.deadline <= Date.now() / 1000) {
            this._roomData.secondPcs.finish();
        }
    }

    @bindEvent(TexasGameRoomDataSecondPcs.VOTE_CHANGED, { dataSource: 'secondPcs', initIgnore: true })
    private onVoteChanged(seatId: number, result: boolean): void {
        const index = this._participantSeatIds.indexOf(seatId);
        if (index >= 0) {
            this.headBackgrounds[index].node.color = result ? UIAgreeSecondPcs.COLOR_ON : UIAgreeSecondPcs.COLOR_OFF;
        }
        this._refreshAgreeCount();
    }

    @bindEvent(TexasGameRoomDataSecondPcs.REQUEST_RESULT, { dataSource: 'secondPcs', initIgnore: true })
    private onRequestResult(status: number): void {
        if (status == 0) return;
        this.rejectButton.interactable = true;
        this.agreeButton.interactable = true;
        viewManager.showToast(CPErrorCode.ServerErrorDescription(status));
    }

    private onRejectClicked(): void {
        this._submit(false);
    }

    private onAgreeClicked(): void {
        this._submit(true);
    }

    private _submit(agree: boolean): void {
        this.rejectButton.interactable = false;
        this.agreeButton.interactable = false;
        ProtocolAgency.Send({
            code: Code.MSG_D_AGREE_SECOND_PCS_ACTIVE,
            roomID: this._roomData.roomID,
            matchID: this._roomData.matchID,
            body: {
                room: {
                    roomId: this._roomData.roomID,
                    matchId: this._roomData.matchID
                },
                agree
            }
        });
    }

    private _refreshPlayers(): void {
        for (let i = 0; i < this.headNodes.length; i++) {
            const visible = i < this._participantSeatIds.length;
            this.headNodes[i].active = visible;
            this.headBackgrounds[i].node.color = UIAgreeSecondPcs.COLOR_OFF;
            if (visible) {
                const player = this._roomData.seatsStateManager.getSeatPlayer(this._participantSeatIds[i]);
                this.headAvatars[i].url = player.avatar;
            }
        }
    }

    private _refreshAgreeCount(): void {
        let agreeCount = 0;
        this._participantSeatIds.forEach(seatId => {
            if (this._roomData.secondPcs.votes.get(seatId) === true) agreeCount++;
        });
        this.agreeCountLabel.string = `${agreeCount}/${this._participantSeatIds.length} ${i18nMgr.Get('UIAgreeSecondPcs_AgreeDtail')}`;
    }

    private _refreshCountDown(): void {
        const leftTime = Math.max(0, Math.ceil(this._roomData.secondPcs.deadline - Date.now() / 1000));
        this.countDownLabel.string = TimeHelper.ShowRemainingSemicolonPure(leftTime);
    }
}
