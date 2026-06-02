import CowboyMessageHandler from './cowboy/CowboyMessageHandler';
import FantasyMessageHandler from './fantasy/FantasyMessageHandler';
import GuandanMessageHandler from './guandan/GuandanMessageHandler';
import MahjongMessageHandler from './mahjong/MahjongMessageHandler';
import OtherMessageHandler from './other/OtherMessageHandler';
import TexasMessageHandler from './texas/TexasMessageHandler';

export default class MessageHandler {
    public static handle(code: number, data: any, roomID: number, matchID: number) {
        if (code >= 4001 && code < 5000) return GuandanMessageHandler.handle(code, data, roomID, matchID);
        if (code >= 3001 && code < 4000) return MahjongMessageHandler.handle(code, data, roomID, matchID);
        if (code >= 2001 && code < 3000) return CowboyMessageHandler.handle(code, data, roomID, matchID);
        if (code >= 1201 && code < 1400) return FantasyMessageHandler.handle(code, data, roomID, matchID);
        if (code >= 1001 && code < 1200) return TexasMessageHandler.handle(code, data, roomID, matchID);
        if (code < 1000) return OtherMessageHandler.handle(code, data, roomID, matchID);
    }
}
