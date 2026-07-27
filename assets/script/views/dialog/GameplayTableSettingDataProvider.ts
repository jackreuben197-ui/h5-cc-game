import TexasGameRoomData from '../../data/room/texas/TexasGameRoomData';
import { APIOrgTribeRoomPermissions, WebConfigGlobalConfig } from '../../net/https/WebRequest';
import { WWW } from '../../net/https/WebRequestBase';

export type GameplayTableSettingData = {
    roomPermissions: Record<string, number>;
    tribeId: number;
};

class GameplayTableSettingDataProvider {
    private _cache: WeakMap<TexasGameRoomData, Promise<GameplayTableSettingData>> = new WeakMap();

    public getData(roomData: TexasGameRoomData, roomPermissions?: Record<string, number>): Promise<GameplayTableSettingData> {
        const cached = this._cache.get(roomData);
        const parsedPermissions = this.parsePermissions(roomPermissions);
        if (cached) {
            if (Object.keys(parsedPermissions).length === 0) return cached;
            const data = cached.then(current => ({
                roomPermissions: parsedPermissions,
                tribeId: current.tribeId
            }));
            this._cache.set(roomData, data);
            return data;
        }
        if (Object.keys(parsedPermissions).length > 0) {
            const data = Promise.resolve({
                roomPermissions: parsedPermissions,
                tribeId: roomData.basicInfo.tribeID
            });
            this._cache.set(roomData, data);
            return data;
        }
        const loading = this._loadData(roomData);
        this._cache.set(roomData, loading);
        return loading;
    }

    public parsePermissions(raw: any): Record<string, number> {
        if (!raw) return {};
        let obj: any = raw;
        if (typeof raw === 'string') {
            try {
                obj = JSON.parse(raw);
            } catch (err) {
                cc.warn('[GameplayTableSettingDataProvider] parse room permissions failed', err);
                return {};
            }
        }
        if (!obj || typeof obj !== 'object' || Array.isArray(obj)) return {};
        const ret: Record<string, number> = {};
        Object.keys(obj).forEach(key => {
            ret[key] = Number(obj[key] || 0);
        });
        return ret;
    }

    private async _loadData(roomData: TexasGameRoomData): Promise<GameplayTableSettingData> {
        const clubId = roomData.basicInfo.clubID;
        const tribeId = roomData.basicInfo.tribeID;
        if (clubId !== 0 || tribeId > 1) {
            try {
                const response: any = await WWW.Instance.CommonAPI({
                    web_class: APIOrgTribeRoomPermissions,
                    body: {
                        club_id: clubId,
                        tribe_id: tribeId
                    },
                    juhua: false
                });
                const responseTribeId = Number(response?.data?.tribe_id ?? (response?.data?.room_permissions as any)?.tribe_id ?? 0);
                return {
                    roomPermissions: this.parsePermissions(response?.data?.room_permissions),
                    tribeId: tribeId > 0 ? tribeId : responseTribeId
                };
            } catch (err) {
                cc.warn('[GameplayTableSettingDataProvider] request club room permissions failed', err);
            }
        }
        return {
            roomPermissions: await this._getGlobalRoomPermissions(),
            tribeId: tribeId
        };
    }

    private async _getGlobalRoomPermissions(): Promise<Record<string, number>> {
        let config: any = WebConfigGlobalConfig?.Response?.data || null;
        if (!config) {
            try {
                const response: any = await WWW.Instance.CommonAPI({
                    web_class: WebConfigGlobalConfig,
                    body: {},
                    juhua: false,
                    useCache: true
                });
                config = response?.data || null;
            } catch (err) {
                cc.warn('[GameplayTableSettingDataProvider] request global room permissions failed', err);
            }
        }
        return this.parsePermissions(config?.room_permissions);
    }
}

const gameplayTableSettingDataProvider = new GameplayTableSettingDataProvider();

export default gameplayTableSettingDataProvider;
