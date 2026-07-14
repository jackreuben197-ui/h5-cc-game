import { ServerMessageUserDiamondChange } from '@silenthill/agreement-web';
import userStore from '../../../data/user/UserStore';

// UserDiamondChange 138
export function UserDiamondChange(data: ServerMessageUserDiamondChange.AsObject, roomID: number, matchID: number) {
    userStore.diamonds = data.diamonds;
}
