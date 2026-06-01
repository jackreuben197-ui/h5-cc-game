/**
 * 闲置流程
 */
import ProcedureBase from './ProcedureBase';

const { ccclass, property } = cc._decorator;

@ccclass
export default class ProcedureIdle extends ProcedureBase {
    Name: string = 'ProcedureIdle';

    Leave() {
        super.Leave();
    }
}
