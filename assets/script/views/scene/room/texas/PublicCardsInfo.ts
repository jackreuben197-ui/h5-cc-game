import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../../core/decorator/DataBind';
import { traceMethod } from '../../../../core/decorator/LogTrace';
import roomDataManager from '../../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataPublicCards from '../../../../data/room/texas/TexasGameRoomDataPublicCards';
import { AnimateDisplayTypePublicCards } from '../../../../game/constant/AnimateDisplayType';
import CardView from '../../../widget/CardView';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu('CrazyPoker/Room/Texas/PublicCardsInfo')
export default class PublicCardsInfo extends cc.Component {
    private _publicCards: CardView[] = [];
    private _secPublicCards: CardView[] = [];
    private _publicCardsData: TexasGameRoomDataPublicCards;

    public initData(roomID: number, matchID: number) {
        const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
        this._publicCardsData = roomData.publicCards;
        if (this.node.activeInHierarchy) {
            this._bindEventsAndRefresh();
        }
    }

    public onLoad() {
        // 如果绑定点击写这里
        for (let i = 0; i < 5; i++) {
            this._publicCards.push(this.node.children[i].getComponent(CardView));
        }
        for (let i = 5; i < 10; i++) {
            this._secPublicCards.push(this.node.children[i].getComponent(CardView));
        }
    }

    public onEnable(): void {
        if (!this._publicCardsData) return;
        this._bindEventsAndRefresh();
    }

    public onDisable(): void {
        unBindEventsAll(this);
    }

    private _bindEventsAndRefresh() {
        autoBindEvents(this, { publicCards: this._publicCardsData });
    }

    @bindEvent(TexasGameRoomDataPublicCards.ALL_PUBLICCARDS_RESET, { dataSource: 'publicCards', initIgnore: true })
    public onUpdateResetPublicCards() {
        this._publicCards.forEach(v => {
            v.node.active = false;
            v.highlight(false);
        });
        this._secPublicCards.forEach(v => {
            v.node.active = false;
            v.highlight(false);
        });
    }

    @bindEvent(TexasGameRoomDataPublicCards.PUBLICCARDS_CHANGE, 'publicCards')
    @traceMethod()
    private onUpdatePublicCards(prev: number[], plus: number[], pat: AnimateDisplayTypePublicCards) {
        const prevCardsLen = prev.length;
        this._publicCards.slice(prevCardsLen + plus.length).forEach(v => (v.node.active = false));
        if (pat == AnimateDisplayTypePublicCards.Static) {
            // 直接显示
            plus.forEach((v, index) => {
                this._publicCards[prevCardsLen + index].node.active = true;
                this._publicCards[prevCardsLen + index].cardNum = v;
            });
            return;
        }
        //要做复杂动画
        let startPos = this._publicCards[0].node.position;
        let moveDuration = 0.6;
        if (prevCardsLen > 0) {
            moveDuration = 0;
        }
        plus.forEach((v, index) => {
            const node = this._publicCards[index + prevCardsLen];
            node.node.active = true;
            if (prevCardsLen == 0) {
                const endPos = node.node.position;
                node.node.setPosition(startPos);
                node.cardNum = 0;
                cc.tween(node.node)
                    .to(moveDuration, { position: endPos }, { easing: 'cubicOut' })
                    .call(() => {
                        node.animateFlipToFront(v, 0.6);
                    })
                    .start();
                return;
            }
            node.animateFlipToFront(v, 0.6);
        });
    }

    @bindEvent(TexasGameRoomDataPublicCards.SECOND_PUBLICCARDS_CHANGE, 'publicCards')
    private onUpdateSecPublicCards(prev: number[], plus: number[], pat: AnimateDisplayTypePublicCards) {
        const prevCardsLen = prev.length;
        this._secPublicCards.slice(prevCardsLen + plus.length).forEach(v => (v.node.active = false));
        if (pat == AnimateDisplayTypePublicCards.Static) {
            // 直接显示
            plus.forEach((v, index) => {
                this._secPublicCards[prevCardsLen + index].node.active = true;
                this._secPublicCards[prevCardsLen + index].cardNum = v;
            });
            return;
        }
        //要做复杂动画
        let startPos = this._secPublicCards[0].node.position;
        let moveDuration = 0.6;
        if (prevCardsLen > 0) {
            moveDuration = 0;
        }
        plus.forEach((v, index) => {
            const node = this._secPublicCards[index + prevCardsLen];
            node.node.active = true;
            if (prevCardsLen == 0) {
                const endPos = node.node.position;
                node.node.setPosition(startPos);
                node.cardNum = 0;
                cc.tween(node.node)
                    .to(moveDuration, { position: endPos }, { easing: 'cubicOut' })
                    .call(() => {
                        node.animateFlipToFront(v, 0.6);
                    })
                    .start();
                return;
            }
            node.animateFlipToFront(v, 0.6);
        });
    }

    @bindEvent(TexasGameRoomDataPublicCards.PUBLICCARDS_HIGHLIGHT, { dataSource: 'publicCards', initIgnore: true })
    private onHighlightPublicCards(cardsNum: number[]) {
        const mp: Set<number> = new Set();
        cardsNum.forEach(v => mp.add(v));
        this._publicCards.forEach(cd => {
            if (mp.has(cd.cardNum)) {
                cd.highlight(true);
            } else {
                cd.highlight(false);
            }
        });
    }

    @bindEvent(TexasGameRoomDataPublicCards.SECOND_PUBLICCARDS_HIGHLIGHT, { dataSource: 'publicCards', initIgnore: true })
    private onHighlightSecondPublicCards(cardsNum: number[]) {
        const mp: Set<number> = new Set();
        cardsNum.forEach(v => mp.add(v));
        this._publicCards.forEach(cd => {
            if (mp.has(cd.cardNum)) {
                cd.highlight(true);
            } else {
                cd.highlight(false);
            }
        });
    }
}
