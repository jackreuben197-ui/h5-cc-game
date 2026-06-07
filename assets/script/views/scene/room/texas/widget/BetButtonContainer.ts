import { traceClass } from '../../../../../core/decorator/LogTrace';
import TexasGameRoomDataPlayer from '../../../../../data/room/texas/TexasGameRoomDataPlayer';
import TexasGameRoomDataSetting from '../../../../../data/room/texas/TexasGameRoomDataSetting';
import { Def } from '../../../../../protobuf/holdem/define_pb';
import TexasTableEvent from '../events/TexasTableEvent';
import BetButton from './BetButton'; // 引入按钮脚本

export interface IBetBtnData {
    label: string; // 对应 showLabel 的比例，如 '1/2'
    amount: number; // 对应 amountLabel 的底层纯数字金额，如 111100
    cb: (amount: number, ratio: string) => void; // 点击回调
}

export function caculatePotsBet(roundBet: number, minRaise: number, player: TexasGameRoomDataPlayer): IBetBtnData[] {
    if (!player || !player.mine) return;
    const pot = player.roomData.potInfo.allPot + roundBet - player.roundBet;
    const myCall = roundBet - player.roundBet;
    const myChip = player.chip;
    const btn = [1 / 3, 1 / 2, 2 / 3, 1, 1.2];
    const str = ['1/3', '1/2', '2/3', '1.0', '1.2'];
    const ret: IBetBtnData[] = [];
    btn.forEach((v, i) => {
        const amount = Math.floor(pot * v + myCall);
        //有钱，还得大于最小下注
        if (amount <= myChip && amount >= minRaise) {
            ret.push({
                label: str[i],
                amount: amount,
                cb: function (amount: number, ratio: string): void {
                    if (amount == myChip) {
                        TexasTableEvent.DoAction(player.mine, Def.Action.ALLIN, player.chip);
                        return;
                    }
                    if (roundBet == 0) {
                        TexasTableEvent.DoAction(player.mine, Def.Action.BET, amount);
                        return;
                    }
                    TexasTableEvent.DoAction(player.mine, Def.Action.RAISE, amount);
                    return;
                }
            });
        }
    });
    return ret;
}

const { ccclass, property } = cc._decorator;

@ccclass
@traceClass()
export default class BetButtonsContainer extends cc.Component {
    @property({ type: cc.Prefab, displayName: '按钮Prefab' })
    betBtnPrefab: cc.Prefab = null;
    // 核心坐标字典
    private layoutDict: { [key: number]: cc.Vec2[] } = {
        1: [cc.v2(-190, 370)],
        2: [cc.v2(-190, 370), cc.v2(190, 370)],
        3: [cc.v2(-190, 370), cc.v2(0, 395), cc.v2(190, 370)],
        4: [cc.v2(-350, 240), cc.v2(-190, 370), cc.v2(190, 370), cc.v2(350, 240)],
        5: [cc.v2(-350, 240), cc.v2(-190, 370), cc.v2(0, 395), cc.v2(190, 370), cc.v2(350, 240)]
    };
    // 动态缓存池：一开始是空的，后面随着传入数据多退少补
    private _cachedButtons: BetButton[] = [];

    onLoad() {
        // 此时不需要在 onLoad 里写任何创建或获取逻辑，真正的“懒加载”
    }

    /**
     * 【懒加载核心刷新接口】
     * @param dataArray 传入的数据数组 (长度 1~5)
     */
    public refreshAndLayout(dataArray: IBetBtnData[], setting: TexasGameRoomDataSetting) {
        if (!dataArray || !this.betBtnPrefab) return;
        let dataCount = dataArray.length;
        let cacheCount = this._cachedButtons.length;
        // 1. 核心懒加载：如果当前缓存的数量，不够本次数据需要的数量，就去现场 instantiate 补齐
        if (cacheCount < dataCount) {
            let needCreateCount = dataCount - cacheCount;
            for (let i = 0; i < needCreateCount; i++) {
                let btnNode = cc.instantiate(this.betBtnPrefab);
                btnNode.parent = this.node;
                let btnScript = btnNode.getComponent(BetButton);
                if (btnScript) {
                    this._cachedButtons.push(btnScript);
                } else {
                    this.tracelog.error('Prefab上没有挂载 BetButton 脚本！');
                }
            }
        }
        // 2. 刷新所有缓存中的按钮状态（激活需要的，隐藏多余的）
        // 此时 this._cachedButtons 的长度一定 >= dataCount
        for (let i = 0; i < this._cachedButtons.length; i++) {
            let btnScript = this._cachedButtons[i];
            if (!btnScript) continue;
            if (i < dataCount) {
                // 在需要展示的范围内：刷文字、绑回调、露面
                let data = dataArray[i];
                btnScript.initData(data.label, data.amount, setting, data.cb);
                btnScript.node.active = true;
            } else {
                // 超出当前数据范围的缓存按钮：暂时退场，等下次召唤
                btnScript.node.active = false;
            }
        }
        // 3. 严格按当前激活的有效数量，执行查表排版
        this.doDictLayout(dataCount);
    }

    /**
     * 查表排版逻辑
     */
    private doDictLayout(activeCount: number) {
        if (activeCount <= 0) return;
        const coords = this.layoutDict[activeCount];
        if (!coords) {
            this.tracelog.warn(`坐标字典里未配置数量为 ${activeCount} 的排版！`);
            return;
        }
        let coordIndex = 0;
        for (let i = 0; i < this._cachedButtons.length; i++) {
            let btnScript = this._cachedButtons[i];
            // 只给当前 active = true 的按钮洗牌位置
            if (btnScript && btnScript.node.active) {
                let targetPos = coords[coordIndex];
                if (targetPos) {
                    btnScript.node.setPosition(targetPos.x, targetPos.y);
                }
                coordIndex++;
            }
        }
    }
}
