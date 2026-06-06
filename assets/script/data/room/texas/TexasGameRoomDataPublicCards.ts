import { pureEvent } from '../../../core/decorator/DataBind';
import { AnimateDisplayTypePublicCards } from '../../../game/constant/AnimateDisplayType';

export default class TexasGameRoomDataPublicCards extends cc.EventTarget {
    public static readonly PUBLICCARDS_CHANGE = 'PUBLICCARDS_CHANGE';
    public static readonly ALL_PUBLICCARDS_RESET = 'ALL_PUBLICCARDS_RESET';
    public static readonly SECOND_PUBLICCARDS_CHANGE = 'SECOND_PUBLICCARDS_CHANGE';
    public static readonly PUBLICCARDS_HIGHLIGHT = 'PUBLICCARDS_HIGHLIGHT';
    public static readonly SECOND_PUBLICCARDS_HIGHLIGHT = 'SECOND_PUBLICCARDS_HIGHLIGHT';
    private _publicCards: number[] = [];
    public get publicCards() {
        return this._publicCards;
    }
    public set publicCards(cards: number[]) {
        this._publicCards = cards;
    }

    public addPublicCards(cards: number[], pat: AnimateDisplayTypePublicCards) {
        if (cards.length == 0) return;
        const old = this._publicCards;
        let newarray = [];
        newarray.push(...old);
        newarray.push(...cards);
        this._publicCards = newarray;
        this.publicCardsChange(old, cards, pat);
    }

    @pureEvent(TexasGameRoomDataPublicCards.PUBLICCARDS_CHANGE, {
        initParams() {
            return [[], this._publicCards, AnimateDisplayTypePublicCards.Static];
        }
    })
    private publicCardsChange(old: number[], add: number[], pat: AnimateDisplayTypePublicCards) {}

    @pureEvent(TexasGameRoomDataPublicCards.ALL_PUBLICCARDS_RESET)
    public resetAllPublicCard() {
        this._publicCards = [];
    }

    private _secondPublicCards: number[] = [];
    public get secondPublicCards() {
        return this._secondPublicCards;
    }
    public set secondPublicCards(cards: number[]) {
        this._secondPublicCards = cards;
    }

    public addSecondPublicCards(cards: number[], pat: AnimateDisplayTypePublicCards) {
        const old = this._secondPublicCards;
        let newarray = [];
        newarray.push(...old);
        newarray.push(...cards);
        this._secondPublicCards = newarray;
        this.secPublicCardsChange(old, cards, pat);
    }

    @pureEvent(TexasGameRoomDataPublicCards.SECOND_PUBLICCARDS_CHANGE, {
        initParams() {
            return [[], this._secondPublicCards, AnimateDisplayTypePublicCards.Static];
        }
    })
    private secPublicCardsChange(old: number[], add: number[], pat: AnimateDisplayTypePublicCards) {}

    @pureEvent(TexasGameRoomDataPublicCards.PUBLICCARDS_HIGHLIGHT, { initParams: [[]] })
    public higlightPublicards(cards: number[]) {}

    @pureEvent(TexasGameRoomDataPublicCards.SECOND_PUBLICCARDS_HIGHLIGHT, { initParams: [[]] })
    public higlightSecondPublicCards(cards: number[]) {}

    public handClear() {
        this.resetAllPublicCard();
    }
}
