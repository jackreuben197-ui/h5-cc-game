// import UIBringIn from './dialog/bringin/UIBringIn';
import UIAgreeSecondPcs from './dialog/agreeSecondPcs/UIAgreeSecondPcs';
import UIBringIn from './dialog/bringin/UIBringIn';
import UIBringOut from './dialog/bringout/UIBringInOut';
import UIChatDlg from './dialog/chat/UIChatDlg';
import UIConfirmDialog from './dialog/confirm/UIConfirmDialog';
import UIEmojiDlg from './dialog/emoji/UIEmojiDlg';
import UITexasHistory from './dialog/history/UITexasHistory';
import UIInsuranceNewPanel from './dialog/insurance/UIInsuranceNewPanel';
import UIGuideDialog from './dialog/mushroomandcriticalhit/UIGuideDialog';
import UIPersonalSettings from './dialog/personalsettings/UIPersonalSettings';
import UIPlayerInfo from './dialog/playerinfo/UIPlayerInfo';
import UIReport from './dialog/playerinfo/UIReport';
import UIRechargeDiamond from './dialog/rechargediamond/UIRechargeDiamond';
import UITexasReport from './dialog/report/UITexasReport';
import UITexasReportPlayerInfo from './dialog/report/UITexasReportPlayerInfo';
import UIGameplaySecuritySetting from './dialog/security/UIGameplaySecuritySetting';
import UIDialogSquid from './dialog/squid/UIDialogSquid';
import UISquidEnd from './dialog/squidover/UISquidEnd';
import UIGameplayTableSetting from './dialog/texassettings/UIGameplayTableSetting';
import { BUNDLE_RESOURCES } from './loader/AssetManager';
import UIRoomTexas from './scene/room/texas/UIRoomTexas';
import UIPreloadingComponent from './scene/UIPreloadingComponent';
import UIPromptComponent from './scene/UIPromptComponent';

// export interface IUIConfigItem {
//     UIType: { new (): UIComponentBase<any> }; // 或者是你的基类：typeof UIComponentBase
//     Name: string;
//     Bundle: string;
//     Path: string;
// }
// export type UIPrefabType = 'BringInDialog';
export const UIPrefabDialog = {
    AgreeSecondPcs: {
        UIType: UIAgreeSecondPcs,
        Name: '第二套公共牌投票',
        Bundle: BUNDLE_RESOURCES,
        Path: 'rc/dialog/agreeSecondPcs/UIAgreeSecondPcs'
    },
    MushroomIntroduction: {
        UIType: UIGuideDialog,
        Name: '蘑菇介绍',
        Bundle: BUNDLE_RESOURCES,
        Path: 'rc/dialog/mushroomandcriticalhit/UIGuideDialog'
    },
    CriticalHitIntroduction: {
        UIType: UIGuideDialog,
        Name: '暴击介绍',
        Bundle: BUNDLE_RESOURCES,
        Path: 'rc/dialog/mushroomandcriticalhit/UIGuideDialog'
    },
    SquidIntroduction: {
        UIType: UIDialogSquid,
        Name: '鱿鱼介绍窗口',
        Bundle: BUNDLE_RESOURCES,
        Path: 'rc/dialog/squid/UIDialogSquid'
    },
    SquidOver: {
        UIType: UISquidEnd,
        Name: '鱿鱼结算',
        Bundle: BUNDLE_RESOURCES,
        Path: 'rc/dialog/squidover/UISquidOver'
    },
    ConfirmOrNotice: {
        UIType: UIConfirmDialog,
        Name: '确认或者提示',
        Bundle: BUNDLE_RESOURCES,
        Path: 'rc/dialog/confirm/UIConfirmDialog'
    },
    TexasTableSetting: {
        UIType: UIGameplayTableSetting,
        Name: '牌桌设置',
        Bundle: BUNDLE_RESOURCES,
        Path: 'rc/dialog/settings/UIGameplayTableSetting'
    },
    TexasTableSecurity: {
        UIType: UIGameplaySecuritySetting,
        Name: '牌桌安全设置',
        Bundle: BUNDLE_RESOURCES,
        Path: 'rc/dialog/security/UIGameplaySecuritySetting'
    },
    BuyInsurance: {
        UIType: UIInsuranceNewPanel,
        Name: '购买保险',
        Bundle: BUNDLE_RESOURCES,
        Path: 'rc/dialog/insurance/UIInsuranceNewPanel'
    },
    BringIn: {
        UIType: UIBringIn,
        Name: '带入弹框',
        Bundle: BUNDLE_RESOURCES,
        Path: 'rc/dialog/bringin/UIBringIn'
    },
    BringOut: {
        UIType: UIBringOut,
        Name: '带入弹框',
        Bundle: BUNDLE_RESOURCES,
        Path: 'rc/dialog/bringin/UIBringIn'
    },
    RechargeDiamond: {
        UIType: UIRechargeDiamond,
        Name: '扫码充钻石',
        Bundle: BUNDLE_RESOURCES,
        Path: 'rc/dialog/rechargediamond/UIRechargeDiamond'
    },
    TexasReport: {
        UIType: UITexasReport,
        Name: '牌桌战绩',
        Bundle: BUNDLE_RESOURCES,
        Path: 'rc/scene/room/texas/UITexasReport'
    },
    TexasReportPlayerInfo: {
        UIType: UITexasReportPlayerInfo,
        Name: '战绩玩家详情',
        Bundle: BUNDLE_RESOURCES,
        Path: 'rc/scene/room/texas/UITexasReportPlayerInfo'
    },
    PersonalSettings: {
        UIType: UIPersonalSettings,
        Name: '个性设置',
        Bundle: BUNDLE_RESOURCES,
        Path: 'rc/dialog/personalsettings/UIPersonalSettings'
    },
    TexasHistory: {
        UIType: UITexasHistory,
        Name: '牌谱回放',
        Bundle: BUNDLE_RESOURCES,
        Path: 'rc/scene/room/texas/UITexasHistory'
    },
    TexasChat: {
        UIType: UIChatDlg,
        Name: '牌桌聊天',
        Bundle: BUNDLE_RESOURCES,
        Path: 'rc/scene/room/texas/UIChatDlg'
    },
    PlayerInfo: {
        UIType: UIPlayerInfo,
        Name: '玩家信息',
        Bundle: BUNDLE_RESOURCES,
        Path: 'rc/dialog/playerinfo/UIPlayerInfo'
    },
    PlayerReport: {
        UIType: UIReport,
        Name: '举报',
        Bundle: BUNDLE_RESOURCES,
        Path: 'rc/dialog/playerinfo/UIReport'
    },
    Emoji: {
        UIType: UIEmojiDlg,
        Name: '表情',
        Bundle: BUNDLE_RESOURCES,
        Path: 'rc/dialog/emoji/UIEmojiDlg'
    }
} as const;

export const UIPrefabScene = {
    TexasRoom: {
        UIType: UIRoomTexas,
        Name: '带入弹框',
        Bundle: BUNDLE_RESOURCES,
        Path: 'rc/scene/room/texas/UIRoomTexas'
    }
} as const;

export const UIPrefabComponent = {
    Preloading: {
        UIType: UIPreloadingComponent,
        Name: '带入弹框',
        Bundle: BUNDLE_RESOURCES,
        Path: 'rc/scene/UIPreloading'
    },
    Prompt: {
        UIType: UIPromptComponent,
        Name: '网络Loading',
        Bundle: BUNDLE_RESOURCES,
        Path: 'rc/scene/UIPrompt'
    }
} as const;

export type UIPrefabDialogType = keyof typeof UIPrefabDialog;

export type UIPrefabComponentType = keyof typeof UIPrefabComponent;

export type UIPrefabSceneType = keyof typeof UIPrefabScene;
