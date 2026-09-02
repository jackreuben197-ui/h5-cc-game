import { createLogger } from '../core/decorator/LogTrace';
import TexasGameRoomData from '../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataPlayerMine from '../data/room/texas/TexasGameRoomDataPlayerMine';
import userStore from '../data/user/UserStore';
import { i18nMgr } from '../i18n/i18nMgr';
import viewManager from '../views/UIViewManager';
import ProcedureDefine from './procedure/ProcedureDefine';
import ProcedureManager from './procedure/ProcedureManager';

const _plog = createLogger('[GuestSitdownFlow]');

type PendingPhase = 'waiting-login' | 'switching-account' | 'reentering';

type ResumeSitdown = (mine: TexasGameRoomDataPlayerMine, seatNo: number) => void | Promise<void>;

interface PendingGuestSitdown {
    roomID: number;
    matchID: number;
    seatNo: number;
    phase: PendingPhase;
    resume: ResumeSitdown;
}

class GuestSitdownFlow {
    private _pending: PendingGuestSitdown = null;
    private _resetProcedurePromise: Promise<void> = Promise.resolve();

    public begin(roomData: TexasGameRoomData, seatNo: number, resume: ResumeSitdown): void {
        if (!roomData || seatNo <= 0) return;
        this._pending = {
            roomID: roomData.roomID,
            matchID: roomData.matchID,
            seatNo,
            phase: 'waiting-login',
            resume
        };
        this._resetProcedurePromise = Promise.resolve();
        _plog.info('记录游客待入座上下文', roomData.roomID, roomData.matchID, seatNo);
    }

    public cancel(reason: string): void {
        if (!this._pending) return;
        _plog.info('取消游客待入座上下文', reason, this._pending.roomID, this._pending.seatNo);
        this._pending = null;
    }

    public matches(roomID: number, matchID: number): boolean {
        const pending = this._pending;
        return !!pending && pending.roomID === roomID && pending.matchID === matchID;
    }

    public prepareForAccountSwitch(): void {
        const pending = this._pending;
        if (!pending || pending.phase !== 'waiting-login') return;
        pending.phase = 'switching-account';
        this._resetProcedurePromise = ProcedureManager.StartProcedure(ProcedureDefine.Init, { resetSession: true });
        _plog.info('开始重建牌桌运行态', pending.roomID, pending.seatNo);
    }

    public waitForResetProcedure(): Promise<void> {
        return this._resetProcedurePromise;
    }

    public markReentering(): void {
        const pending = this._pending;
        if (pending) pending.phase = 'reentering';
    }

    public resumeAfterRoomEntered(roomData: TexasGameRoomData): void {
        const pending = this._pending;
        if (!pending || pending.phase !== 'reentering') return;
        if (pending.roomID !== roomData.roomID || pending.matchID !== roomData.matchID) return;
        if (userStore.isGuestAccount || !userStore.token || userStore.userID <= 0) {
            _plog.error('真实用户身份尚未同步，终止自动入座');
            this._pending = null;
            viewManager.showToast(i18nMgr.Get('UIClub_Done'));
            return;
        }
        if (roomData.mine.seatNo > 0) {
            _plog.info('真实用户已经在座，无需重复 Sitdown', roomData.mine.seatNo);
            this._pending = null;
            return;
        }
        const targetSeat = roomData.seatsStateManager.getSeatPlayer(pending.seatNo);
        if (!targetSeat || targetSeat.seated || targetSeat.userID > 0) {
            _plog.warn('原座位已不可用', pending.seatNo, targetSeat?.userID, targetSeat?.seated);
            this._pending = null;
            viewManager.showToast(i18nMgr.Get('adaptation10031'));
            return;
        }
        const resume = pending.resume;
        const seatNo = pending.seatNo;
        this._pending = null;
        _plog.info('真实用户原桌恢复完成，续接 Sitdown', roomData.roomID, seatNo);
        void Promise.resolve(resume(roomData.mine, seatNo)).catch(error => {
            _plog.error('续接 Sitdown 失败', error);
            viewManager.showToast(i18nMgr.Get('error999'));
        });
    }
}

const guestSitdownFlow = new GuestSitdownFlow();

export default guestSitdownFlow;
