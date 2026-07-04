import { ServerMessageBroadcastMsg } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { ThrowPropBroadcastData } from '../../../data/room/texas/TexasGameRoomDataSeatsStateManager';

const BROADCAST_MSG_CODE = 10001;
const PROP_TYPE_BASE = 600;
const PROP_TYPE_COUNT = 12;

// BroadcastMsg 1019
export function BroadcastMsg(data: ServerMessageBroadcastMsg.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    roomData.seatsStateManager.confirmPendingThrowProp(data.status);
}

export function handleBroadcastExtra(extra: Uint8Array | string, roomID: number, matchID: number): void {
    const propData = parseThrowPropBroadcast(extra);
    if (!propData) return;
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    roomData.seatsStateManager.throwPropEvent(propData);
}

export function parseThrowPropBroadcast(extra: Uint8Array | string): ThrowPropBroadcastData | null {
    const outerJson = decodeExtra(extra);
    if (!outerJson) return null;
    let outer: any;
    try {
        outer = JSON.parse(outerJson);
    } catch (error) {
        return null;
    }
    if (!outer || Number(outer.code) !== BROADCAST_MSG_CODE) return null;
    let inner = outer.data;
    if (typeof inner === 'string') {
        try {
            inner = JSON.parse(inner);
        } catch (error) {
            return null;
        }
    }
    const type = Number(inner.type || 0);
    const userID = Number(inner.user_id || 0);
    const targetUserID = Number(inner.target_user_id || 0);
    const propOffset = type - PROP_TYPE_BASE;
    if (propOffset < 0 || propOffset >= PROP_TYPE_COUNT || !userID || !targetUserID) return null;
    return { type, userID, targetUserID };
}

function decodeExtra(extra: Uint8Array | string): string {
    if (!extra) return '';
    if (typeof extra !== 'string') return bytesToString(extra);
    if (extra.charAt(0) === '{') return extra;
    try {
        const bin = atob(extra);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        const text = bytesToString(bytes);
        return text || extra;
    } catch (error) {
        return extra;
    }
}

function bytesToString(bytes: Uint8Array): string {
    let result = '';
    for (let i = 0; i < bytes.length; i++) result += String.fromCharCode(bytes[i]);
    try {
        return decodeURIComponent(escape(result));
    } catch (error) {
        return result;
    }
}
