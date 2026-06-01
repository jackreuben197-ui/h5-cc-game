import { i18nMgr } from './i18nMgr';

//@executeInEditMode()
//@requireComponent(cc.Label)
const { ccclass, property, disallowMultiple, menu } = cc._decorator;

@ccclass
@disallowMultiple
@menu('common/i18nLabel')
export class i18nLabel extends cc.Component {
    @property
    private i18n_string: string = '';

    override start() {
        i18nMgr._addOrDelLabel(this, true);
        this._resetValue();
    }

    set i18NString(value: string) {
        this.i18n_string = value;
        this.setEndValue();
    }
    // @property({ type: cc.String })
    // // get string() {
    // //     return this.i18n_string;
    // // }
    // // set string(value: string) {
    // //     this.i18n_string = value;
    // //     this.setEndValue()
    // // }
    // string: string = null;
    // @property({ type: [cc.String] })
    // get params() {
    //     return this.i18n_params;
    // }
    // set params(value: string[]) {
    //     this.i18n_params = value;
    //     this.setEndValue()
    // }
    // init(string: string, params: string[]) {
    //     this.i18n_string = string;
    //     this.setEndValue()
    // }
    private setEndValue() {
        let label: any = this.getComponent(cc.Label);
        if (cc.isValid(label)) {
            label.string = i18nMgr._getLabel(this.i18n_string);
        }
        label = this.getComponent(cc.RichText);
        if (cc.isValid(label)) {
            label.string = i18nMgr._getLabel(this.i18n_string);
        }
        label = this.getComponent(cc.EditBox);
        if (cc.isValid(label)) {
            label.placeholder = i18nMgr._getLabel(this.i18n_string);
        }
    }

    _resetValue() {
        //this.string = this.i18n_string;
        if (this.i18n_string == '') return;
        this.setEndValue();
    }

    override onDestroy() {
        i18nMgr._addOrDelLabel(this, false);
    }
}
