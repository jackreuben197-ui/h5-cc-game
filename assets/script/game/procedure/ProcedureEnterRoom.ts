import TexasGameRoomData from '../../data/room/texas/TexasGameRoomData';
import { AGameplayEntranceProvider } from '../entrance/AGamelayEntranceProvider';
import AGameplayEntrance from '../entrance/AGameplayEntrance';
import guestSitdownFlow from '../GuestSitdownFlow';
import ProcedureBase from './ProcedureBase';
import ProcedureDefine from './ProcedureDefine';
import ProcedureManager from './ProcedureManager';

export interface ProcedureEnterRoomParam {
    roomType: number;
    roomID: number;
    matchID: number;
    observer?: boolean;
    clubID?: number;
}

export default class ProcedureEnterRoom extends ProcedureBase {
    public override Name: string = 'ProcedureEnterRoom';
    /**
     * 德州玩法入口实例
     */
    private _entrance: AGameplayEntrance = null;
    private _enterSequence: number = 0;

    protected override lateEnter(param: ProcedureEnterRoomParam): void {
        super.lateEnter(param);
        this._beginEnter(param);
    }

    public restart(param: ProcedureEnterRoomParam): void {
        // MTT 重购和换桌可直接重启进桌步骤，不重复切换场景流程。
        this.param = param;
        this._beginEnter(param);
    }

    public onRoomReady(roomData: TexasGameRoomData): void {
        guestSitdownFlow.resumeAfterRoomEntered(roomData);
    }

    private _beginEnter(param: ProcedureEnterRoomParam): void {
        const entrance = AGameplayEntranceProvider.createEntrance(param.roomType, param.matchID, param.roomID, param.observer ?? false);
        if (!entrance) {
            console.error('[ProcedureEnterRoom]', '无法为房间类型创建玩法入口', param);
            ProcedureManager.StartProcedure(ProcedureDefine.Return);
            return;
        }
        entrance.entryClubID = Number(param.clubID || 0);
        const sequence = ++this._enterSequence;
        entrance.roomIdChanged = (_oldRoomId, newRoomId) => {
            // 旧的异步进桌任务完成后不得覆盖新流程的 roomID。
            if (sequence != this._enterSequence) return;
            const currentParam = this.param as ProcedureEnterRoomParam;
            if (currentParam?.matchID == entrance.matchId) {
                currentParam.roomID = newRoomId;
            }
        };
        this._entrance = entrance;
        this._onComplete(sequence);
    }

    Leave() {
        this._enterSequence++;
        super.Leave();
    }

    private _onComplete(sequence: number) {
        this._entrance
            .enterForegroundAsync()
            .then(result => {
                if (sequence != this._enterSequence) return;
                if (!result) {
                    console.warn('[ProcedureEnterRoom]', 'enterForegroundAsync false');
                    this._entrance = null;
                    ProcedureManager.StartProcedure(ProcedureDefine.Return);
                }
            })
            .catch(e => {
                if (sequence != this._enterSequence) return;
                console.error('[ProcedureEnterRoom]', 'err', e);
                this._entrance = null;
                ProcedureManager.StartProcedure(ProcedureDefine.Return);
            });
    }
}
