import { bindData, observable, pureEvent } from '../../../core/decorator/DataBind';

export interface SecondPcsVoteData {
    seatId: number;
    result: boolean;
}

@bindData()
export default class TexasGameRoomDataSecondPcs extends cc.EventTarget {
    public static readonly ACTIVE_CHANGED = 'ACTIVE_CHANGED';
    public static readonly VOTE_CHANGED = 'VOTE_CHANGED';
    public static readonly REQUEST_RESULT = 'REQUEST_RESULT';
    public participantSeatIds: number[] = [];
    public deadline: number = 0;
    public votes: Map<number, boolean> = new Map();
    @observable(TexasGameRoomDataSecondPcs.ACTIVE_CHANGED)
    public active: boolean = false;

    public start(participantSeatIds: number[], deadline: number): void {
        this.participantSeatIds = participantSeatIds;
        this.deadline = deadline;
        this.votes.clear();
        this.active = true;
    }

    @pureEvent(TexasGameRoomDataSecondPcs.VOTE_CHANGED)
    public vote(seatId: number, result: boolean): SecondPcsVoteData {
        this.votes.set(seatId, result);
        return { seatId, result };
    }

    @pureEvent(TexasGameRoomDataSecondPcs.REQUEST_RESULT)
    public requestResult(status: number): number {
        return status;
    }

    public finish(): void {
        this.active = false;
        this.participantSeatIds = [];
        this.deadline = 0;
        this.votes.clear();
    }
}
