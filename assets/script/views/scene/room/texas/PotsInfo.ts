import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../../core/decorator/DataBind';
import roomDataManager from '../../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataPotInfo from '../../../../data/room/texas/TexasGameRoomDataPotInfo';
import TexasGameRoomDataSetting from '../../../../data/room/texas/TexasGameRoomDataSetting';
import { StringHelper } from '../../../../helper/StringHelper';
import { i18nMgr } from '../../../../i18n/i18nMgr';
import { SidePot } from '../../../../protobuf/holdem/define_pb';
import UIViewUtil from '../../../util/UIViewUtil';

const { ccclass, property, menu } = cc._decorator;

const LN = '[PotsInfo]';

@ccclass
@menu('CrazyPoker/Room/Texas/PotsInfo')
export default class PotsInfo extends cc.Component {
    @property(cc.Label)
    private allPotsLabel: cc.Label = null;
    @property(cc.Node)
    private mainPot: cc.Node = null;
    @property(cc.Node)
    private sidePot: cc.Node = null;
    private _allPotsNodes: cc.Node[] = [];
    private _potInfo: TexasGameRoomDataPotInfo;
    private _setting: TexasGameRoomDataSetting;
    private _last_pots_count: number = 0;
    private _sidePotsLayouts: cc.Layout = null;
    private _sidePotsPosition: cc.Vec3[] = [];

    public initData(roomID: number, matchID: number) {
        const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
        //this._roomBaseInfo = roomData.basicInfo;
        this._potInfo = roomData.potInfo;
        this._setting = roomData.setting;
        if (this.node.activeInHierarchy) {
            this._bindEventsAndRefresh();
        }
    }

    public onLoad() {
        this.allPotsLabel.node.active = false;
        this.mainPot.active = false;
        this._allPotsNodes.push(this.mainPot);
        for (let i = 0; i < 8; i++) {
            let pot = cc.instantiate(this.sidePot);
            pot.active = true;
            pot.parent = this.sidePot.parent;
            this._allPotsNodes.push(pot);
        }
        this._sidePotsLayouts = this.sidePot.parent.getComponent(cc.Layout);
    }

    start() {}

    public onEnable(): void {
        if (!this._potInfo) return;
        this._bindEventsAndRefresh();
    }

    public onDisable(): void {
        unBindEventsAll(this);
    }

    private _bindEventsAndRefresh() {
        autoBindEvents(this, { pot: this._potInfo, setting: this._setting });
    }

    @bindEvent(TexasGameRoomDataPotInfo.ALLPOTS_CHANGE, 'pot')
    private onUpdateAllPots(allpots: number) {
        this.allPotsLabel.string = `${i18nMgr.Get('adaptation20005')} : ${this._setting.showNumberWithShowBB(allpots)}`;
        this.allPotsLabel.node.active = true;
    }

    @bindEvent(TexasGameRoomDataSetting.SHOW_BB, { dataSource: 'setting', initPriority: 99 })
    private onUpdateShowBB(b: number) {
        this.allPotsLabel.string = `${i18nMgr.Get('adaptation20005')} : ${this._setting.showNumberWithShowBB(this._potInfo.allPot)}`;
        let pots = this._potInfo.potList;
        let l = pots.length;
        for (let i = 0; i < 9; i++) {
            const sidePot = this._allPotsNodes[i];
            if (i >= l) {
                sidePot.active = false;
                continue;
            }
            const pot = pots[i];
            sidePot.active = true;
            const lbl = this._allPotsNodes[i].getComponentInChildren(cc.Label);
            lbl.string = this._setting.showNumberWithShowBB(pot.amount);
        }
    }

    @bindEvent(TexasGameRoomDataPotInfo.POTLIST_CHANGE, 'pot')
    private onUpdatePotList(pots: SidePot.AsObject[]) {
        if (!pots) return;
        const l = pots.length;
        this._sidePotsLayouts.updateLayout();
        if (this._sidePotsPosition.length == 0) {
            this._allPotsNodes.forEach(v => {
                this._sidePotsPosition.push(v.position);
            });
        }
        this._sidePotsLayouts.enabled = false;
        const tweens: cc.Tween[] = [];
        for (let i = 0; i < 9; i++) {
            const sidePot = this._allPotsNodes[i];
            if (i >= l) {
                sidePot.active = false;
                continue;
            }
            const pot = pots[i];
            sidePot.active = true;
            const lbl = this._allPotsNodes[i].getComponentInChildren(cc.Label);
            lbl.string = this._setting.showNumberWithShowBB(pot.amount);
            //判断进行位移
            if (i > 0 && i >= this._last_pots_count) {
                sidePot.setPosition(this._sidePotsPosition[1]);
                tweens.push(cc.tween(sidePot).to(0.3, { position: this._sidePotsPosition[i] }));
            }
        }
        UIViewUtil.parellTweens(tweens, () => {
            this._sidePotsLayouts.enabled = true;
        });
        this._last_pots_count = pots.length;
    }
    // private static readonly _sidePotsPosition: cc.Vec3[] = [
    //     cc.v3(0, -812),
    //     cc.v3(-283, -960),
    //     cc.v3(0, -960),
    //     cc.v3(283, -960),
    //     cc.v3(-283, -1025),
    //     cc.v3(0, -1025),
    //     cc.v3(283, -1025),
    //     cc.v3(-143, -1090),
    //     cc.v3(143, -1090)
    // ];
}
