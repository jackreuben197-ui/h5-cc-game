/**
 * @module DeskResourcesConstant
 * @description 牌桌资源常量
 */

export default class DeskResourcesConstant {
    /**
     * 单花色
     */
    public static readonly CARD_TYPE_AB_NAMES: string[] = ['ordinarycard.unity3d', 'fourcolorcard.unity3d', 'portraitcard.unity3d'];
    /**
     * 双花色
     */
    public static readonly DOUBLE_CARD_TYPE_AB_NAMES: string[] = ['texasstandarddoublecard.unity3d', 'texascolorfuldoublecard.unity3d'];
    /**
     * 单花色obj
     */
    public static readonly CARD_TYPE_OBJ_NAMES: string[] = ['OrdinaryCard', 'FourColorCard', 'PortraitCard'];
    /**
     * 双花色obj
     */
    public static readonly DOUBLE_CARD_TYPE_OBJ_NAMES: string[] = ['TexasStandardDoubleCard', 'TexasColorfulDoubleCard'];
    public static readonly HISTORY_CARD_TYPE_AB_NAMES: string[] = ['historycard.unity3d', 'historysecondcard.unity3d'];
    public static readonly HISTORY_CARD_TYPE_OBJ_NAMES: string[] = ['HistoryCard', 'HistorySecondCard'];
}
