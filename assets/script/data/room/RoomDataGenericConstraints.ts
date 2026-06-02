import { GameType } from '../../game/constant/LogicTypeConf';
import MahjongGameRoomDataBasic from './mahjong/MahjongGameRoomDataBasic';
import TexasGameRoomDataPlayerMine from './texas/TexasGameRoomDataPlayerMine';

// 基本信息约束
export interface RoomPlayerGC {
    [GameType.HOLDEM]: TexasGameRoomDataPlayerMine;
    [GameType.MAHJONG]: MahjongGameRoomDataBasic;
}
