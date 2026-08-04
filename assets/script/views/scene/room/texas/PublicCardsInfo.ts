import { autoBindEvents, bindEvent, unBindEventsAll } from '../../../../core/decorator/DataBind';
import { traceClass, traceMethod } from '../../../../core/decorator/LogTrace';
import soundManager, { SoundEffectKey } from '../../../../core/SoundManager';
import roomDataManager from '../../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataPublicCards from '../../../../data/room/texas/TexasGameRoomDataPublicCards';
import { AnimateDisplayTypePublicCards } from '../../../../game/constant/AnimateDisplayType';
import CardView from '../../../widget/CardView';

const { ccclass, property, menu } = cc._decorator;

@ccclass
@traceClass()
@menu('Scene/Room/Texas/PublicCardsInfo')
export default class PublicCardsInfo extends cc.Component {
    private _publicCards: CardView[] = [];
    private _secPublicCards: CardView[] = [];
    private _publicCardPositions: cc.Vec3[] = [];
    private _secPublicCardPositions: cc.Vec3[] = [];
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
            const card = this.node.children[i].getComponent(CardView);
            this._publicCards.push(card);
            this._publicCardPositions.push(cc.v3(card.node.position.x, card.node.position.y, card.node.position.z));
        }
        for (let i = 5; i < 10; i++) {
            const card = this.node.children[i].getComponent(CardView);
            this._secPublicCards.push(card);
            this._secPublicCardPositions.push(cc.v3(card.node.position.x, card.node.position.y, card.node.position.z));
        }
        cc.game.on(cc.game.EVENT_SHOW, this.onGameShow, this);
    }

    public onEnable(): void {
        if (!this._publicCardsData) return;
        this._bindEventsAndRefresh();
    }

    public onDisable(): void {
        unBindEventsAll(this);
    }

    public onDestroy(): void {
        cc.game.off(cc.game.EVENT_SHOW, this.onGameShow, this);
    }

    private _bindEventsAndRefresh() {
        autoBindEvents(this, { publicCards: this._publicCardsData });
    }

    @bindEvent(TexasGameRoomDataPublicCards.ALL_PUBLICCARDS_RESET, { dataSource: 'publicCards', initIgnore: true })
    public onUpdateResetPublicCards() {
        this._syncPublicCards();
        this._publicCards.forEach(v => v.reset());
        this._secPublicCards.forEach(v => v.reset());
    }

    private onGameShow(): void {
        this._syncPublicCards();
    }

    private _syncPublicCards(): void {
        if (!this._publicCardsData) return;
        cc.Tween.stopAllByTarget(this.node);
        this._syncCardViews(this._publicCards, this._publicCardPositions, this._publicCardsData.publicCards);
        this._syncCardViews(this._secPublicCards, this._secPublicCardPositions, this._publicCardsData.secondPublicCards);
    }

    private _syncCardViews(views: CardView[], positions: cc.Vec3[], cards: number[]): void {
        views.forEach((view, index) => {
            cc.Tween.stopAllByTarget(view.node);
            view.node.setPosition(positions[index]);
            view.node.setScale(1, 1);
            view.node.angle = 0;
            view.node.active = index < cards.length;
            if (index < cards.length) {
                view.storeCardNum = cards[index];
                view.cardNum = cards[index];
            }
        });
    }

    @bindEvent(TexasGameRoomDataPublicCards.PUBLICCARDS_CHANGE, 'publicCards')
    @traceMethod()
    private onUpdatePublicCards(prev: number[], plus: number[], pat: AnimateDisplayTypePublicCards) {
        const prevCardsLen = prev.length;
        this._publicCards.slice(prevCardsLen + plus.length).forEach(v => v.reset());
        if (pat == AnimateDisplayTypePublicCards.Static) {
            // 直接显示
            plus.forEach((v, index) => {
                this._publicCards[prevCardsLen + index].node.active = true;
                this._publicCards[prevCardsLen + index].cardNum = v;
                this._publicCards[prevCardsLen + index].storeCardNum = v;
            });
            return;
        }
        //要做复杂动画
        let startPos = this._publicCards[0].node.position;
        let moveDuration = 0.6;
        if (prevCardsLen > 0) {
            moveDuration = 0;
        }
        if (AnimateDisplayTypePublicCards.Deal == pat) {
            cc.tween(this.node)
                .delay(moveDuration / 4)
                .call(() => {
                    soundManager.playEffect(SoundEffectKey.DealCards);
                })
                .start();
        }
        plus.forEach((v, index) => {
            const node = this._publicCards[index + prevCardsLen];
            node.storeCardNum = v;
            node.node.active = true;
            if (prevCardsLen == 0) {
                const endPos = node.node.position;
                node.node.setPosition(startPos);
                node.cardNum = 0;
                cc.tween(node.node)
                    .to(moveDuration, { position: endPos }, { easing: 'cubicOut' })
                    .call(() => {
                        node.animateFlipToFront(node.storeCardNum, 0.6, () => {
                            if (node.delayHighlight) {
                                node.delayHighlight = false;
                                node.highlight(true);
                            }
                        });
                    })
                    .start();
                return;
            }
            node.animateFlipToFront(node.storeCardNum, 0.6);
        });
    }

    @bindEvent(TexasGameRoomDataPublicCards.SECOND_PUBLICCARDS_CHANGE, 'publicCards')
    private onUpdateSecPublicCards(prev: number[], plus: number[], pat: AnimateDisplayTypePublicCards) {
        const prevCardsLen = prev.length;
        this._secPublicCards.slice(prevCardsLen + plus.length).forEach(v => v.reset());
        if (pat == AnimateDisplayTypePublicCards.Static) {
            // 直接显示
            plus.forEach((v, index) => {
                this._secPublicCards[prevCardsLen + index].node.active = true;
                this._secPublicCards[prevCardsLen + index].cardNum = v;
                this._secPublicCards[prevCardsLen + index].storeCardNum = v;
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
            node.storeCardNum = v;
            if (prevCardsLen == 0) {
                const endPos = node.node.position;
                node.node.setPosition(startPos);
                node.cardNum = 0;
                cc.tween(node.node)
                    .to(moveDuration, { position: endPos }, { easing: 'cubicOut' })
                    .call(() => {
                        node.animateFlipToFront(node.storeCardNum, 0.6);
                    })
                    .start();
                return;
            }
            node.animateFlipToFront(node.storeCardNum, 0.6);
        });
    }

    @bindEvent(TexasGameRoomDataPublicCards.PUBLICCARDS_HIGHLIGHT, { dataSource: 'publicCards', initIgnore: true })
    private onHighlightPublicCards(cardsNum: number[]) {
        const mp: Set<number> = new Set(cardsNum);
        this._publicCards.forEach(cd => {
            if (mp.has(cd.storeCardNum)) {
                if (cd.cardNum == cd.storeCardNum) {
                    cd.highlight(true);
                } else {
                    //延迟高亮
                    cd.delayHighlight = true;
                }
            } else {
                cd.highlight(false);
            }
        });
    }

    @bindEvent(TexasGameRoomDataPublicCards.PUBLICCARDS_POPUP, { dataSource: 'publicCards', initIgnore: true })
    private onPopupCards(cardsNum: number[]) {
        const mp: Set<number> = new Set(cardsNum);
        this._publicCards.forEach(cd => {
            if (mp.has(cd.storeCardNum)) {
                cd.popUp(new cc.Vec2(0, 20));
            } else {
                cd.gray(true);
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
