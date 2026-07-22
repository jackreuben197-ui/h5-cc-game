/**
 * 主要用于资源加载
 */
export enum AssetCollectionType {
    Common,
    //牌类型0
    SpriteFrameCard0,
    //牌类型1
    SpriteFrameCard1,
    //牌类型1
    SpriteFrameTableSmall,
    //声音
    AudioSourceSound,
    SpriteFrameCard2
}

export type PokerCardType =
    | AssetCollectionType.SpriteFrameCard0
    | AssetCollectionType.SpriteFrameCard1
    | AssetCollectionType.SpriteFrameCard2;

const { ccclass, property, executionOrder, menu } = cc._decorator;

@ccclass
@executionOrder(-1) // 优先级 < 0 ,节点提前执行这个组件
@menu('Loader/AssetLoader')
export default class AssetLoader extends cc.Component {
    @property({ type: cc.Enum(AssetCollectionType) })
    collection: AssetCollectionType = AssetCollectionType.Common;
}
