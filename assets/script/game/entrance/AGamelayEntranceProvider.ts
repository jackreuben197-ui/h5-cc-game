import AGameplayEntrance from './AGameplayEntrance';
import TexasGameplayEntrance from './TexasGameplayEntrance';
import MttTexasGameplayEntrance from './MttTexasGameplayEntrance';
import GameplayUtil from '../util/GameplayUtil';
import { GameType } from '../constant/LogicTypeConf';
import { traceClass } from '../../core/decorator/LogTrace';

@traceClass()
export class AGameplayEntranceProvider {
    /**
     * 统一入口：根据房间类型创建对应的玩法实例
     */
    public static createEntrance(roomType: number, matchId: number, roomId: number, observer: boolean = false): AGameplayEntrance {
        let { gameType, pokerType, betType, isMTT } = GameplayUtil.RoomTypeExtract(roomType);
        if (!isMTT) {
            switch (gameType) {
                case GameType.HOLDEM:
                case GameType.OMAHA4:
                case GameType.OMAHA5:
                case GameType.OMAHA6:
                    return new TexasGameplayEntrance(roomType, matchId, roomId);
            }
            this.tracelog.error('unsupported roomtype', roomType, 'gameType', gameType);
            return;
        }
        // TODO: MTT玩法入口
        switch (gameType) {
            case GameType.HOLDEM:
            case GameType.OMAHA4:
            case GameType.OMAHA5:
            case GameType.OMAHA6:
                return new MttTexasGameplayEntrance(roomType, matchId, roomId, observer);
        }
        this.tracelog.error('unsupported MTT roomtype', roomType, 'gameType', gameType);
        return;
    }
}
