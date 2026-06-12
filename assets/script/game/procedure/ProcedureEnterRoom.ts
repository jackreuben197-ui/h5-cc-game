import soundManager, { SoundMusicKey } from '../../core/SoundManager';
import { AGameplayEntranceProvider } from '../entrance/AGamelayEntranceProvider';
import AGameplayEntrance from '../entrance/AGameplayEntrance';
import ProcedureBase from './ProcedureBase';
import ProcedureDefine from './ProcedureDefine';
import ProcedureManager from './ProcedureManager';

export interface ProcedureEnterRoomParam {
    roomType: number;
    roomID: number;
    matchID: number;
    observer?: boolean;
}

export default class ProcedureEnterRoom extends ProcedureBase {
    Name: string = 'ProcedureEnterRoom';
    /**
     * 德州玩法入口实例
     */
    private _entrance: AGameplayEntrance = null;

    override lateEnter(param: ProcedureEnterRoomParam) {
        super.lateEnter(param);
        soundManager.playMusic(SoundMusicKey.BgmGame, true, 0.3);
        // 创建德州玩法入口
        const entrance = AGameplayEntranceProvider.createEntrance(param.roomType, param.matchID, param.roomID, param.observer ?? false);
        this._entrance = entrance;
        this._onComplete();
    }

    Leave() {
        super.Leave();
    }

    _onComplete() {
        // this.RequestRoomInfo();
        // 开始进入前台
        this._entrance
            .enterForegroundAsync()
            .then(result => {
                if (!result) {
                    console.warn('[ProcedureEnterRoom]', 'enterForegroundAsync false');
                    this._entrance = null;
                    ProcedureManager.StartProcedure(ProcedureDefine.Return);
                }
            })
            .catch(e => {
                console.error('[ProcedureEnterRoom]', 'err', e);
                this._entrance = null;
                ProcedureManager.StartProcedure(ProcedureDefine.Return);
            });
    }
}
