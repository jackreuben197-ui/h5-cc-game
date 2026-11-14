import { Code, ServerMessageRegister } from '@silenthill/agreement-web';
import { createLogger } from '../../../core/decorator/LogTrace';
import userStore from '../../../data/user/UserStore';
import h5MessageManager from '../../../H5MsgMgr';
import ProtocolAgency from '../../websocket/ProtocolAgency';

const _plog = createLogger('ServerMessageRegister', 'info');
let userPlayingRequestedForPage = false;

/**
 * 仅在浏览器整页刷新时触发恢复提示。
 * 普通地址导航、切后台恢复和 WebSocket 重连都不触发。
 */
function isBrowserReload(): boolean {
    try {
        const navigationEntries =
            typeof performance?.getEntriesByType === 'function' ? performance.getEntriesByType('navigation') : [];
        const navigation = navigationEntries[0] as { type?: string } | undefined;
        if (navigation?.type) return navigation.type === 'reload';

        // 兼容不支持 PerformanceNavigationTiming 的旧 WebView。
        return (performance as any)?.navigation?.type === 1;
    } catch (_) {
        return false;
    }
}

function requestCurrentPlayingAfterReload(attempt = 0): void {
    if (userPlayingRequestedForPage || !isBrowserReload()) return;
    if (!userStore.token || !h5MessageManager.handshakeDone || userStore.userID <= 0) {
        if (attempt < 50) {
            setTimeout(() => requestCurrentPlayingAfterReload(attempt + 1), 100);
        }
        return;
    }
    if (userStore.isGuestAccount) return;

    userPlayingRequestedForPage = true;
    ProtocolAgency.Send({
        code: Code.MSG_D_USER_PLAYING,
        roomID: 0,
        matchID: 0,
        body: {}
    });
    _plog.info('browser reload detected, request current playing rooms');
}

// Register 1
export function Register(data: ServerMessageRegister.AsObject, roomID: number, matchID: number) {
    const details = {
        status: data?.status,
        timestamp: data?.timestamp,
        roomID,
        matchID
    };
    if (data?.status === 0) {
        _plog.info('REGISTER ack:', details);
        requestCurrentPlayingAfterReload();
        return;
    }
    _plog.warn('REGISTER rejected:', details);
}
