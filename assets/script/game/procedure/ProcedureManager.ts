/*
 * @Author: xfj
 * @Date: 2022-09-23 15:02:45
 * @description:
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2022-10-22 13:54:19
 * @FilePath: /pokerqueen/assets/script/manager/ProcedureManager.ts
 */
/**
 * 全局流程管理器
 */
import { traceClass } from '../../core/decorator/LogTrace';
import ProcedureBase from '../procedure/ProcedureBase';
import ProcedureEnterRoom, { ProcedureEnterRoomParam } from '../procedure/ProcedureEnterRoom';
import ProcedureIdle from '../procedure/ProcedureIdle';
import ProcedureInit from '../procedure/ProcedureInit';
import ProcedureReturn, { ProcedureReturnNavigateParam } from '../procedure/ProcedureReturn';
import ProcedureDefine from './ProcedureDefine';

type ProcedureParamLimit = {
    [ProcedureDefine.EnterRoom]: ProcedureEnterRoomParam;
    [ProcedureDefine.Init]: void;
    [ProcedureDefine.Return]: ProcedureReturnNavigateParam | void;
    [ProcedureDefine.Idle]: void;
};

@traceClass()
export default class ProcedureManager {
    private static procedureDic: Map<ProcedureDefine, ProcedureBase> = new Map();
    public static prevProcedure: ProcedureBase = null;
    public static currProcedure: ProcedureBase = null;
    private static _isSwitching = false;

    static Init() {
        this.procedureDic.set(ProcedureDefine.Idle, new ProcedureIdle(ProcedureDefine.Idle));
        this.procedureDic.set(ProcedureDefine.Return, new ProcedureReturn(ProcedureDefine.Return));
        this.procedureDic.set(ProcedureDefine.Init, new ProcedureInit(ProcedureDefine.Init));
        this.procedureDic.set(ProcedureDefine.EnterRoom, new ProcedureEnterRoom(ProcedureDefine.EnterRoom));
        ProcedureManager.StartProcedure(ProcedureDefine.Init);
    }

    //开始某个流程
    static async StartProcedure<T extends ProcedureDefine>(
        procedureIndex: T,
        ...args: ProcedureParamLimit[T] extends void ? [param?: never] : [param: ProcedureParamLimit[T]]
    ): Promise<void> {
        let procedure = this.procedureDic.get(procedureIndex);
        if (!procedure) {
            this.tracelog.error('未定义流程:', procedureIndex);
            return;
        }
        const param = args[0];
        ProcedureManager.currProcedure = procedure;
        let prevProcedure = ProcedureManager.prevProcedure;
        // this.tracelog.debug(DEBUG_LOG: 被调用了", new Error().stack);
        if (prevProcedure) {
            if (prevProcedure.id == procedure.id) return;
            if (this._isSwitching) {
                this.tracelog.warn('流程切换中,忽略此次切换流程');
                return;
            }
            this._isSwitching = true;
            //保护性流程切换
            try {
                // 这里需要等待(完善流程)
                this.tracelog.debug(prevProcedure.Name, '开始 Leave');
                await Promise.resolve(prevProcedure.Leave());
            } catch (e) {
                console.error('[Procedure]', `${prevProcedure.Name} leave error, continue switch`, e);
            } finally {
                this._isSwitching = false; // 无论成功失败，最后解锁
            }
        }
        this.tracelog.debug('[上个流程:', prevProcedure && prevProcedure.Name, '切换到==>当前流程:', ProcedureDefine[procedure.id]);
        ProcedureManager.prevProcedure = procedure;
        // 这里可以不等待
        procedure.Enter(param);
    }

    public static RestartEnterRoom(param: ProcedureEnterRoomParam): void {
        // MTT 换桌或重购时复用当前 EnterRoom 流程，不经过大厅。
        const procedure = this.procedureDic.get(ProcedureDefine.EnterRoom);
        if (!(procedure instanceof ProcedureEnterRoom)) {
            this.tracelog.error('EnterRoom 流程未初始化');
            return;
        }
        ProcedureManager.currProcedure = procedure;
        ProcedureManager.prevProcedure = procedure;
        procedure.restart(param);
    }

    public static RefreshEnterRoomID(matchID: number, roomID: number): void {
        const procedure = this.procedureDic.get(ProcedureDefine.EnterRoom);
        if (!(procedure instanceof ProcedureEnterRoom)) {
            this.tracelog.error('刷新 MTT roomID 时 EnterRoom 流程未初始化', matchID, roomID);
            return;
        }
        // 真实 roomID 写回流程参数，保证重连定位当前可见牌桌。
        const param = procedure.param as ProcedureEnterRoomParam;
        if (param?.matchID == matchID) {
            param.roomID = roomID;
        } else {
            this.tracelog.error('刷新 MTT roomID 时 matchID 不匹配', matchID, param?.matchID, roomID);
        }
    }
    // //设置当前流程
    // static SetCurrProcedure(procedureIndex: number) {
    //     let procedure = this.procedureDic[procedureIndex];
    //     ProcedureManager.currProcedure = procedure;
    // }
}
