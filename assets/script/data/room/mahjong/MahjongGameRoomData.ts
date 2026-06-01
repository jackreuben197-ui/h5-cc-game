import RoomData from '../RoomData';
import MahjongGameRoomDataBasic from './MahjongGameRoomDataBasic';

export default class MahjongGameRoomData extends RoomData {
    // 基础信息
    public readonly basicInfo = new MahjongGameRoomDataBasic();
}
