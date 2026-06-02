import RoomData from '../RoomData';
import TexasGameRoomDataBasic from './TexasGameRoomDataBasic';
import TexasGameRoomDataPlayerMine from './TexasGameRoomDataPlayerMine';
import TexasGameRoomDataPotInfo from './TexasGameRoomDataPotInfo';
import TexasGameRoomDataPublicCards from './TexasGameRoomDataPublicCards';
import TexasGameRoomDataRoundState from './TexasGameRoomDataRoundState';
import TexasGameRoomDataSeatsStateManager from './TexasGameRoomDataSeatsStateManager';

export default class TexasGameRoomData extends RoomData {
    // 基础信息
    public readonly basicInfo = new TexasGameRoomDataBasic(this);
    // 底池信息
    public readonly potInfo = new TexasGameRoomDataPotInfo();
    // 公共牌信息
    public readonly publicCards = new TexasGameRoomDataPublicCards();
    // 回合信息
    public readonly roundState = new TexasGameRoomDataRoundState();
    // 座位信息
    public readonly seatsStateManager = new TexasGameRoomDataSeatsStateManager(this);
    // 自己信息
    public readonly mine = new TexasGameRoomDataPlayerMine(this);
}
