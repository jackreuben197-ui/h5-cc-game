import { bindData, observable } from '../../../core/decorator/DataBind';
import LocalStorage from '../../LocalStorage';
import StorageKey from '../../StorageKey';

@bindData()
export class TexasGamePersonalSettings extends cc.EventTarget {
    public static readonly SHOW_BB = 'SHOW_BB';
    public static readonly DESK_TYPE_CHANGE = 'DESK_TYPE_CHANGE';
    public static readonly POKER_TYPE_CHANGE = 'POKER_TYPE_CHANGE';
    public static readonly SOUND_ON_CHANGE = 'SOUND_ON_CHANGE';
    public static readonly BUTTON_LAYOUT_CHANGE = 'BUTTON_LAYOUT_CHANGE';
    public static readonly POOL_DISPLAY_CHANGE = 'POOL_DISPLAY_CHANGE';
    public static readonly QUICK_ACTION_CHANGE = 'QUICK_ACTION_CHANGE';
    @observable(TexasGamePersonalSettings.SHOW_BB)
    public showBB: boolean = false;
    @observable(TexasGamePersonalSettings.DESK_TYPE_CHANGE)
    public deskType: number = 0;
    @observable(TexasGamePersonalSettings.POKER_TYPE_CHANGE)
    public pokerType: number = 0;
    @observable(TexasGamePersonalSettings.SOUND_ON_CHANGE)
    public soundOn: boolean = true;
    @observable(TexasGamePersonalSettings.BUTTON_LAYOUT_CHANGE)
    public buttonLayout: number = 0;
    @observable(TexasGamePersonalSettings.POOL_DISPLAY_CHANGE)
    public poolDisplay: number = 0;
    @observable(TexasGamePersonalSettings.QUICK_ACTION_CHANGE)
    public quickActions: string[] = ['0', '1/2', '2/3', '1x', '0'];

    constructor() {
        super();
        this.deskType = +LocalStorage.getItem(StorageKey.SettingDeskType, 0);
        this.pokerType = +LocalStorage.getItem(StorageKey.SettingPokerType, 0);
        this.soundOn = LocalStorage.getItem(StorageKey.SOUND_IS_OPEN, '1') !== '0';
    }
}

const texasGamePersonalSettings = new TexasGamePersonalSettings();

export default texasGamePersonalSettings;
