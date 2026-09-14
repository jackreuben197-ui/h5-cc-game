import TexasGameRoomDataBasic from '../../data/room/texas/TexasGameRoomDataBasic';
import globalConfigStore from '../../data/system/GlobalConfigStore';
import { CurrencyType } from '../constant/CurrencyType';
import { RoomOriginType } from '../constant/RoomOriginType';

type AudienceRoomConfigKey = 'audience_friend_room' | 'audience_scoreboard_club_room' | 'audience_tribe_room';

type ViewPlayerCardsConfig = Partial<Record<AudienceRoomConfigKey, boolean>>;

export function isAudienceViewPlayerCardsEnabled(basicInfo: TexasGameRoomDataBasic): boolean {
    const configKey = getAudienceRoomConfigKey(basicInfo);
    if (!configKey) return true;
    const config = parseViewPlayerCardsConfig(globalConfigStore.get('view_player_cards_config'));
    return config?.[configKey] === true;
}

function getAudienceRoomConfigKey(basicInfo: TexasGameRoomDataBasic): AudienceRoomConfigKey | null {
    if (basicInfo.tribeID > 0) return 'audience_tribe_room';
    if (basicInfo.originType === RoomOriginType.FRIEND) return 'audience_friend_room';
    if (basicInfo.originType === RoomOriginType.CLUB && basicInfo.goldType === CurrencyType.SCORE_BOARD) {
        return 'audience_scoreboard_club_room';
    }
    return null;
}

function parseViewPlayerCardsConfig(raw: unknown): ViewPlayerCardsConfig | null {
    if (typeof raw === 'string') {
        try {
            raw = JSON.parse(raw);
        } catch {
            return null;
        }
    }
    if (!raw || typeof raw !== 'object' || Array.isArray(raw)) return null;
    return raw as ViewPlayerCardsConfig;
}
