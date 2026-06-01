import { AnimateDisplayTypeCards, AnimateDisplayTypePublicCards } from '../../../game/constant/AnimateDisplayType';

export default class TexasGameRoomDataPublicCards extends cc.EventTarget {
    private _publicCards: number[] = [];
    public get publicCards() {
        return this._publicCards;
    }
    public static PUBLICCARDS_CHANGE = 'PUBLICCARDS_CHANGE';

    public addPublicCards(cards: number[], pat: AnimateDisplayTypePublicCards) {
        if (cards.length == 0) return;
        const old = this._publicCards;
        let newarray = [];
        newarray.push(...old);
        newarray.push(...cards);
        this._publicCards = newarray;
        this.emit(TexasGameRoomDataPublicCards.PUBLICCARDS_CHANGE, old, cards, pat);
    }

    public static ALL_PUBLICCARDS_RESET = 'ALL_PUBLICCARDS_RESET';

    public resetAllPublicCard() {
        this._publicCards = [];
        this.emit(TexasGameRoomDataPublicCards.ALL_PUBLICCARDS_RESET, []);
    }

    private _secondPublicCards: number[] = [];
    public get secondPublicCards() {
        return this._secondPublicCards;
    }
    public static SECOND_PUBLICCARDS_CHANGE = 'SECOND_PUBLICCARDS_CHANGE';

    public addSecondPublicCards(cards: number[], pat: AnimateDisplayTypePublicCards) {
        const old = this._secondPublicCards;
        let newarray = [];
        newarray.push(...old);
        newarray.push(...cards);
        this._secondPublicCards = newarray;
        this.emit(TexasGameRoomDataPublicCards.SECOND_PUBLICCARDS_CHANGE, old, cards, pat);
    }

    public static PUBLICCARDS_HIGHLIGHT = 'PUBLICCARDS_HIGHLIGHT';

    public higlightPublicards(cards: number[]) {
        this.emit(TexasGameRoomDataPublicCards.PUBLICCARDS_HIGHLIGHT, cards);
    }

    public static SECOND_PUBLICCARDS_HIGHLIGHT = 'SECOND_PUBLICCARDS_HIGHLIGHT';

    public higlightSecondPublicCards(cards: number[]) {
        this.emit(TexasGameRoomDataPublicCards.SECOND_PUBLICCARDS_HIGHLIGHT, cards);
    }

    public handClear() {
        this.resetAllPublicCard();
    }
}
