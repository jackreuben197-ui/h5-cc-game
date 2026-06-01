/**
 * 主要用于资源加载
 */
export enum AssetCollectionType {
    Common,
    //新素材
    SpriteFrameCard,
    //声音
    AudioSourceSound
}

const { ccclass, property, executionOrder, menu } = cc._decorator;

@ccclass
@executionOrder(-1) // 优先级 < 0 ,节点提前执行这个组件
@menu('Loader/AssetLoader')
export default class AssetLoader extends cc.Component {
    @property({ type: cc.Enum(AssetCollectionType) })
    collection: AssetCollectionType = AssetCollectionType.Common;
}
