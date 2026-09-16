import TexasGameRoomDataBasic from '../../data/room/texas/TexasGameRoomDataBasic';
import globalConfigStore from '../../data/system/GlobalConfigStore';
import { CurrencyType } from '../constant/CurrencyType';
import { RoomOriginType } from '../constant/RoomOriginType';

type AudienceRoomConfigKey = 'audience_friend_room' | 'audience_scoreboard_club_room' | 'audience_tribe_room';
type WatchCardConfigName = 'view_player_cards_config' | 'view_public_cards_config';

type WatchCardPermissionConfig = Partial<Record<AudienceRoomConfigKey, unknown>>;

enum WatchCardPermission {
    DISABLED = 0,
    SEATED_PLAYER = 1,
    SEATED_PLAYER_AND_AUDIENCE = 2
}

export function canWatchPlayerCards(basicInfo: TexasGameRoomDataBasic, isSeated: boolean): boolean {
    return canWatchCards('view_player_cards_config', basicInfo, isSeated);
}

export function canWatchPublicCards(basicInfo: TexasGameRoomDataBasic, isSeated: boolean): boolean {
    return canWatchCards('view_public_cards_config', basicInfo, isSeated);
}

function canWatchCards(configName: WatchCardConfigName, basicInfo: TexasGameRoomDataBasic, isSeated: boolean): boolean {
    const configKey = getAudienceRoomConfigKey(basicInfo);
    const config = parseWatchCardPermissionConfig(globalConfigStore.get(configName));
    const rawPermission = config?.[configKey];

    let permission: number = WatchCardPermission.DISABLED;

    if (rawPermission === undefined || rawPermission === null) {
        permission = WatchCardPermission.DISABLED;
    } else if (typeof rawPermission === 'boolean') {
        permission = rawPermission ? WatchCardPermission.SEATED_PLAYER_AND_AUDIENCE : WatchCardPermission.DISABLED;
    } else if (typeof rawPermission === 'string') {
        if (rawPermission === 'true') permission = WatchCardPermission.SEATED_PLAYER_AND_AUDIENCE;
        else if (rawPermission === 'false') permission = WatchCardPermission.DISABLED;
        else permission = Number(rawPermission);
    } else if (typeof rawPermission === 'number') {
        permission = rawPermission;
    }

    if (permission === WatchCardPermission.SEATED_PLAYER_AND_AUDIENCE) {
        return true;
    }
    if (permission === WatchCardPermission.SEATED_PLAYER) {
        return isSeated;
    }
    return false;
}

function getAudienceRoomConfigKey(basicInfo: TexasGameRoomDataBasic): AudienceRoomConfigKey {
    if (!basicInfo) return 'audience_tribe_room';
    if (basicInfo.originType === RoomOriginType.FRIEND) return 'audience_friend_room';
    if (basicInfo.originType === RoomOriginType.CLUB && basicInfo.goldType === CurrencyType.SCORE_BOARD) {
        return 'audience_scoreboard_club_room';
    }
    return 'audience_tribe_room';
}

function parseWatchCardPermissionConfig(raw: unknown): WatchCardPermissionConfig | null {
    if (typeof raw === 'string') {
        try {
            raw = JSON.parse(raw);
        } catch {
            return null;
        }
    }
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    return raw as WatchCardPermissionConfig;
}
