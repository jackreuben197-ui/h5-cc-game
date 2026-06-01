const { ccclass, property } = cc._decorator;

@ccclass
export default class i18nComponent extends cc.Component {
    @property([cc.TextAsset])
    textAssets: cc.TextAsset[] = [];
}
