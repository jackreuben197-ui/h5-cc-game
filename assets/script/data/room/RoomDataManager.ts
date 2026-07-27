import { createLogger, traceClass } from '../../core/decorator/LogTrace';
import RoomData from './RoomData';

const _plog = createLogger('RoomDataManager');

@traceClass()
class RoomDataManager {
    private _roomCache: Map<string, RoomData> = new Map();
    private _roomLeaving: Map<string, boolean> = new Map();

    constructor() {}

    public existRoomData(roomID: number, matchID: number): boolean {
        const key = roomID + '-' + matchID;
        return this._roomCache.has(key);
    }

    public isInternalLeaving(roomID: number, matchID: number): boolean {
        const key = roomID + '-' + matchID;
        return this._roomLeaving.has(key);
    }

    public startInternalLeaveLock(roomID: number, matchID: number) {
        const key = roomID + '-' + matchID;
        this._roomLeaving.set(key, true);
    }

    public clearInternalLeave(roomID: number, matchID: number) {
        const key = roomID + '-' + matchID;
        this._roomLeaving.delete(key);
    }

    // 获取或创建对应房间的数据实例
    public getRoomData<T extends RoomData>(roomID: number, matchID: number): T {
        const key = roomID + '-' + matchID;
        if (!this._roomCache.has(key)) {
            this.tracelog.warn('no room data', roomID, matchID);
            return null;
        }
        return this._roomCache.get(key) as T;
    }

    public setRoomData<T extends RoomData>(roomID: number, matchID: number, data: T) {
        const key = roomID + '-' + matchID;
        this._roomCache.set(key, data);
    }

    public findRoomDataByMatchID<T extends RoomData>(matchID: number): T | null {
        // 全局 MTT 推送没有固定 roomID，按比赛 ID 定位当前牌桌。
        let result: T | null = null;
        let matchedCount = 0;
        this._roomCache.forEach(data => {
            if (data.matchID == matchID) {
                matchedCount++;
                result = data as T;
            }
        });
        if (matchedCount > 1) {
            _plog.error('同一 matchID 存在多个 RoomData', matchID, matchedCount);
        }
        return result;
    }

    public moveRoomData(oldRoomID: number, newRoomID: number, matchID: number): RoomData | null {
        // 换桌时只迁移缓存键，复用同一份 RoomData 保持 UI 订阅不变。
        const data = this.getRoomData(oldRoomID, matchID);
        if (!data) {
            _plog.error('迁移 RoomData 失败，旧房间不存在', oldRoomID, newRoomID, matchID);
            return null;
        }
        this.deleteRoomData(oldRoomID, matchID);
        data.roomID = newRoomID;
        this.setRoomData(newRoomID, matchID, data);
        return data;
    }

    // 清理房间数据
    public deleteRoomData(roomID: number, matchID: number) {
        const key = roomID + '-' + matchID;
        this._roomCache.delete(key);
    }

    public clearAllRoomData(): void {
        // 返回大厅时统一释放房间数据和离桌锁。
        this._roomCache.clear();
        this._roomLeaving.clear();
    }
}

//核心：直接 new 出实例，并作为默认导出
const roomDataManager = new RoomDataManager();

export default roomDataManager;
