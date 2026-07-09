import RoomData from '../RoomData';
import texasGamePersonalSettings from './TexasGamePersonalSettings';
import TexasGameRoomDataBasic from './TexasGameRoomDataBasic';
import TexasGameRoomDataChat from './TexasGameRoomDataChat';
import TexasGameRoomDataPlayerMine from './TexasGameRoomDataPlayerMine';
import TexasGameRoomDataPotInfo from './TexasGameRoomDataPotInfo';
import TexasGameRoomDataPublicCards from './TexasGameRoomDataPublicCards';
import TexasGameRoomDataReplay from './TexasGameRoomDataReplay';
import TexasGameRoomDataReport from './TexasGameRoomDataReport';
import TexasGameRoomDataRoundState from './TexasGameRoomDataRoundState';
import TexasGameRoomDataSeatsStateManager from './TexasGameRoomDataSeatsStateManager';

export default class TexasGameRoomData extends RoomData {
    public closed: boolean;
    // 基础信息
    public readonly basicInfo = new TexasGameRoomDataBasic(this);
    // 个性设置（全局单例，所有牌桌共享）
    public readonly setting = texasGamePersonalSettings;
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
    // 牌桌战绩
    public readonly report = new TexasGameRoomDataReport(this);
    // 牌谱回放
    public readonly replay = new TexasGameRoomDataReplay(this);
    // 牌桌聊天
    public readonly chat = new TexasGameRoomDataChat(this);
}
