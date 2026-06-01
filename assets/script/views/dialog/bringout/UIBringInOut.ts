import { traceClass } from '../../../core/decorator/LogTrace';
import { RoomPlayerGC } from '../../../data/room/RoomDataGenericConstraints';
import UIComponentBase from '../../base/UIComponentBase';

const { ccclass, menu, property } = cc._decorator;

// 1. 原来的基础定义保持不变
export interface UIBringOutParamBase<T extends keyof RoomPlayerGC> {
    OpenType: string;
    GameType: T;
    RoomBasicInfo: RoomPlayerGC[T];
}
// 2. 核心魔法：通过映射，把所有玩法穷举并联合起来
// 展开后等价于：UIBringOutParamBase<'Texas'> | UIBringOutParamBase<'Omaha'> | ...
export type UIBringOutParam = {
    [K in keyof RoomPlayerGC]: UIBringOutParamBase<K>;
}[keyof RoomPlayerGC];

/**
 * 核心玩法：带入筹码界面
 */
@ccclass
@menu('CrazyPoker/Texas/Dialog/UIBringOut')
@traceClass()
export default class UIBringOut extends UIComponentBase<UIBringOutParam> {
    public initialize(param: UIBringOutParam): void {
        throw new Error('Method not implemented.');
    }
}
