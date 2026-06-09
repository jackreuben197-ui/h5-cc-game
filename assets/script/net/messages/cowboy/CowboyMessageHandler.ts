import { Code } from '@silenthill/agreement-web';
import { CBBringIn } from './CBBringIn';
import { CBCancelPlay } from './CBCancelPlay';
import { CBChat } from './CBChat';
import { CBChatOthers } from './CBChatOthers';
import { CBEncryptCards } from './CBEncryptCards';
import { CBEnterRoom } from './CBEnterRoom';
import { CBGamePlayEnd } from './CBGamePlayEnd';
import { CBGamePlayInfo } from './CBGamePlayInfo';
import { CBGameResult } from './CBGameResult';
import { CBGameStart } from './CBGameStart';
import { CBLastGames } from './CBLastGames';
import { CBLeave } from './CBLeave';
import { CBLeaveNotification } from './CBLeaveNotification';
import { CBOnline } from './CBOnline';
import { CBPlay } from './CBPlay';
import { CBRoomClose } from './CBRoomClose';
import { CBStandupNotification } from './CBStandupNotification';
import { CBSyncEnter } from './CBSyncEnter';
import { CBTop } from './CBTop';
import { CBWaymap } from './CBWaymap';
import { CBWaymapSpec } from './CBWaymapSpec';
import { CBWaymapUpdate } from './CBWaymapUpdate';

export default class CowboyMessageHandler {
    public static handle(code: number, data: any, roomID: number, matchID: number) {
        switch (code) {
            case Code.MSG_D_CB_ENTER_ROOM:
                CBEnterRoom(data, roomID, matchID);
                break; // CBEnterRoom 2001
            case Code.MSG_D_CB_PLAY:
                CBPlay(data, roomID, matchID);
                break; // CBPlay 2002
            case Code.MSG_D_CB_CANCEL_PLAY:
                CBCancelPlay(data, roomID, matchID);
                break; // CBCancelPlay 2003
            case Code.MSG_D_CB_LEAVE:
                CBLeave(data, roomID, matchID);
                break; // CBLeave 2004
            case Code.MSG_D_CB_CHAT:
                CBChat(data, roomID, matchID);
                break; // CBChat 2005
            case Code.MSG_D_CB_TOP:
                CBTop(data, roomID, matchID);
                break; // CBTop 2006
            case Code.MSG_D_CB_WAYMAP:
                CBWaymap(data, roomID, matchID);
                break; // CBWaymap 2007
            case Code.MSG_D_CB_LAST_GAMES:
                CBLastGames(data, roomID, matchID);
                break; // CBLastGames 2008
            case Code.MSG_D_CB_BRING_IN:
                CBBringIn(data, roomID, matchID);
                break; // CBBringIn 2009
            case Code.MSG_D_CB_WAYMAP_SPEC:
                CBWaymapSpec(data, roomID, matchID);
                break; // CBWaymapSpec 2010
            case Code.MSG_D_CB_ONLINE:
                CBOnline(data, roomID, matchID);
                break; // CBOnline 2011
            case Code.MSG_D_CB_SYNC_ENTER:
                CBSyncEnter(data, roomID, matchID);
                break; // CBSyncEnter 2012
            case Code.MSG_S_CB_GAME_START:
                CBGameStart(data, roomID, matchID);
                break; // CBGameStart 2100
            case Code.MSG_S_CB_GAME_PLAY_INFO:
                CBGamePlayInfo(data, roomID, matchID);
                break; // CBGamePlayInfo 2101
            case Code.MSG_S_CB_GAME_PLAY_END:
                CBGamePlayEnd(data, roomID, matchID);
                break; // CBGamePlayEnd 2102
            case Code.MSG_S_CB_GAME_RESULT:
                CBGameResult(data, roomID, matchID);
                break; // CBGameResult 2103
            case Code.MSG_S_CB_WAYMAP_UPDATE:
                CBWaymapUpdate(data, roomID, matchID);
                break; // CBWaymapUpdate 2104
            case Code.MSG_S_CB_ROOM_CLOSE:
                CBRoomClose(data, roomID, matchID);
                break; // CBRoomClose 2105
            case Code.MSG_S_CB_CHAT_OTHERS:
                CBChatOthers(data, roomID, matchID);
                break; // CBChatOthers 2106
            case Code.MSG_S_CB_LEAVE_NOTIFICATION:
                CBLeaveNotification(data, roomID, matchID);
                break; // CBLeaveNotification 2107
            case Code.MSG_S_CB_STANDUP_NOTIFICATION:
                CBStandupNotification(data, roomID, matchID);
                break; // CBStandupNotification 2108
            case Code.MSG_S_CB_ENCRYPT_CARDS:
                CBEncryptCards(data, roomID, matchID);
                break; // CBEncryptCards 2109
        }
    }
}
