import { bindData, IObservableBindings, observable } from '../../../core/decorator/DataBind';
import { traceClass } from '../../../core/decorator/LogTrace';
import soundManager from '../../../core/SoundManager';
import { AnimateDisplayBackground } from '../../../game/constant/AnimateDisplayType';
import { AssetCollectionType, PokerCardType } from '../../../views/loader/AssetLoader';
import LocalStorage from '../../LocalStorage';
import StorageKey from '../../StorageKey';

export interface ShortCut {
    name: string;
    percent: number;
}

export enum shortCutMode {
    Button3 = 1,
    Button5 = 2
}

const TexasGameDfaultShortCutsList: ShortCut[] = [
    {
        name: '1/5',
        percent: 0.2
    },
    {
        name: '1/4',
        percent: 0.25
    },
    {
        name: '1/3',
        percent: 0.333
    },
    {
        name: '1/2',
        percent: 0.5
    },
    {
        name: '2/3',
        percent: 0.66
    },
    {
        name: '3/4',
        percent: 0.75
    },
    {
        name: '1.0',
        percent: 1
    },
    {
        name: '1.2',
        percent: 1.2
    },
    {
        name: '1.5',
        percent: 1.5
    },
    {
        name: '2',
        percent: 2
    }
] as const;

type DataSettingBindings = {
    deskType: [AnimateDisplayBackground];
};

export interface TexasGamePersonalSettings extends IObservableBindings<TexasGamePersonalSettings, DataSettingBindings> {}

@bindData()
@traceClass({ level: 'debug' })
export class TexasGamePersonalSettings extends cc.EventTarget {
    public static readonly SHOW_BB = 'SHOW_BB';
    public static readonly DESK_TYPE_CHANGE = 'DESK_TYPE_CHANGE';
    public static readonly POKER_CARD_TYPE_CHANGE = 'POKER_CARD_TYPE_CHANGE';
    public static readonly SOUND_ON_CHANGE = 'SOUND_ON_CHANGE';
    public static readonly SHORTCUT_MODE_CHANGE = 'SHORTCUT_MODE_CHANGE';
    public static readonly SHORTCUTS_CHANGGE = 'SHORTCUTS_CHANGGE';

    public setShowBBToStorage(b: boolean) {
        if (this.showBB == b) return;
        LocalStorage.setItem(StorageKey.SHOW_BB, b);
        this.showBB = b;
    }

    @observable(TexasGamePersonalSettings.SHOW_BB)
    public showBB: boolean = false;

    public setDeskTypeToStorage(b: number) {
        if (this.deskType == b) return;
        LocalStorage.setItem(StorageKey.TEXAS_DESKTYPE, b);
        this.setDeskType(b, AnimateDisplayBackground.Go);
    }

    @observable(TexasGamePersonalSettings.DESK_TYPE_CHANGE)
    public deskType: number = 0;

    public setPokerCardTypeToStorage(b: PokerCardType) {
        if (this.pokerCardType == b) return;
        LocalStorage.setItem(StorageKey.TEXAS_POKERCARDTYPE, b);
        this.pokerCardType = b;
    }

    @observable(TexasGamePersonalSettings.POKER_CARD_TYPE_CHANGE)
    public pokerCardType: PokerCardType = AssetCollectionType.SpriteFrameCard0;

    public setSoundOnToStorage(b: boolean) {
        if (b == this.soundOn) return;
        LocalStorage.setItem(StorageKey.SOUND_IS_OPEN, b);
        soundManager.isOn = b;
        this.soundOn = b;
    }

    @observable(TexasGamePersonalSettings.SOUND_ON_CHANGE)
    public soundOn: boolean = true;
    @observable(TexasGamePersonalSettings.SHORTCUTS_CHANGGE)
    public shortCuts: ShortCut[] = [];
    private _shortCutMode: shortCutMode = shortCutMode.Button3;
    public get shortCutMode() {
        return this._shortCutMode;
    }
    public set shortCutMode(s: shortCutMode) {
        let shortCuts: ShortCut[] = [];
        if (s == shortCutMode.Button3) {
            this.shortCut3ActionsIndex.forEach(v => shortCuts.push(TexasGameDfaultShortCutsList[v]));
        } else {
            this.shortCut5ActionsIndex.forEach(v => shortCuts.push(TexasGameDfaultShortCutsList[v]));
        }
        this._shortCutMode = s;
        this.shortCuts = shortCuts;
    }
    private _shortCut3ActionsIndex: number[] = [];
    public get shortCut3ActionsIndex() {
        return this._shortCut3ActionsIndex;
    }
    public set shortCut3ActionsIndex(nu: number[]) {
        LocalStorage.setItem(StorageKey.TEXAS_SHORTCUTS_3, nu);
        let shortCuts: ShortCut[] = [];
        this._shortCut3ActionsIndex = nu;
        this._shortCut3ActionsIndex.forEach(v => shortCuts.push(TexasGameDfaultShortCutsList[v]));
        this.shortCuts = shortCuts;
    }
    private _shortCut5ActionsIndex: number[] = [];
    public get shortCut5ActionsIndex() {
        return this._shortCut5ActionsIndex;
    }
    public set shortCut5ActionsIndex(nu: number[]) {
        LocalStorage.setItem(StorageKey.TEXAS_SHORTCUTS_5, nu);
        let shortCuts: ShortCut[] = [];
        this._shortCut5ActionsIndex = nu;
        this._shortCut5ActionsIndex.forEach(v => shortCuts.push(TexasGameDfaultShortCutsList[v]));
        this.shortCuts = shortCuts;
    }

    constructor() {
        super();
        this.init();
    }

    public getShortCut(index: number): ShortCut {
        return TexasGameDfaultShortCutsList[index];
    }

    public getAllShortCuts() {
        return TexasGameDfaultShortCutsList;
    }

    private init() {
        this._shortCut3ActionsIndex = LocalStorage.getItem(StorageKey.TEXAS_SHORTCUTS_3, [3, 6, 7]);
        this._shortCut5ActionsIndex = LocalStorage.getItem(StorageKey.TEXAS_SHORTCUTS_5, [2, 3, 4, 6, 7]);
        this.shortCutMode = LocalStorage.getItem(StorageKey.TEXAS_SHORTCUTS_MODE, shortCutMode.Button3);
        this.showBB = LocalStorage.getItem(StorageKey.SHOW_BB, false);
        //初始化DeskType
        this.deskType = +LocalStorage.getItem(StorageKey.TEXAS_DESKTYPE, 1);
        //初始化pokerCardType
        this.pokerCardType = +LocalStorage.getItem(StorageKey.TEXAS_POKERCARDTYPE, AssetCollectionType.SpriteFrameCard0);
        //初始化声音
        this.soundOn = LocalStorage.getItem(StorageKey.SOUND_IS_OPEN, true);
        soundManager.isOn = this.soundOn;
    }
}

const texasGamePersonalSettings = new TexasGamePersonalSettings();

export default texasGamePersonalSettings;
