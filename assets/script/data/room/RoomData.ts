export default class RoomData {
    // roomID 房间ID(MTT时候会再设置)
    private _roomID: number;
    public get roomID() {
        return this._roomID;
    }
    public set roomID(r: number) {
        this._roomID = r;
    }
    // matchID 比赛ID
    public readonly matchID: number;

    constructor(roomID: number, matchID: number) {
        this.roomID = roomID;
        this.matchID = matchID;
    }

    public clearData(): void {}
}
