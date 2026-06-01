import { GameType } from '../../game/constant/LogicTypeConf';
import MahjongGameRoomDataBasic from './mahjong/MahjongGameRoomDataBasic';
import TexasGameRoomDataPlayer from './texas/TexasGameRoomDataPlayer';

// 基本信息约束
export interface RoomPlayerGC {
    [GameType.HOLDEM]: TexasGameRoomDataPlayer;
    [GameType.MAHJONG]: MahjongGameRoomDataBasic;
}
