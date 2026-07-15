import { ServerMessageJackpotAward } from '@silenthill/agreement-web';
import h5MessageManager from '../../../H5MsgMgr';

// JackpotAward 1130：中奖广播 → 交给 H5 弹获奖面板
export function JackpotAward(data: ServerMessageJackpotAward.AsObject, roomID: number, matchID: number) {
    if (!data?.awardUsersList?.length) return;
    h5MessageManager.sendToH5('showPanel', 1, {
        panelType: 'jackpotAward',
        title: '',
        props: { awardUsersList: data.awardUsersList }
    });
}
