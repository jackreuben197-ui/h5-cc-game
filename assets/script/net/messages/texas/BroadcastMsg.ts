import { ServerMessageBroadcastMsg } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { EmojiBroadcastData, ThrowPropBroadcastData } from '../../../data/room/texas/TexasGameRoomDataSeatsStateManager';
import { BroadcastCode, PropsID, THROW_PROP_IDS, getFreeEmojiTypeBase } from '../../../game/constant/BroadcastCode';

// BroadcastMsg 1019
export function BroadcastMsg(data: ServerMessageBroadcastMsg.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    roomData.seatsStateManager.confirmPendingThrowProp(data.status);
    roomData.seatsStateManager.confirmPendingEmoji(data.status);
}

export function handleBroadcastExtra(extra: Uint8Array | string, roomID: number, matchID: number): void {
    const inner = parseBroadcastInner(extra);
    const innerData = parseInner(inner);
    if (!innerData) return;
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (THROW_PROP_IDS.indexOf(innerData.type) >= 0) {
        const propData: ThrowPropBroadcastData = {
            type: innerData.type,
            userID: innerData.userID,
            targetUserID: innerData.targetUserID
        };
        roomData.seatsStateManager.throwPropEvent(propData);
        return;
    }
    if (innerData.type >= getFreeEmojiTypeBase()) {
        const emojiData: EmojiBroadcastData = {
            type: innerData.type,
            userID: innerData.userID
        };
        roomData.seatsStateManager.emojiEvent(emojiData);
    }
}

function parseInner(inner: any): ThrowPropBroadcastData | null {
    if (!inner) return null;
    const type = Number(inner.type || 0);
    const userID = Number(inner.user_id || 0);
    const targetUserID = Number(inner.target_user_id || 0);
    return { type: type as PropsID, userID, targetUserID };
}

function parseBroadcastInner(extra: Uint8Array | string): any {
    const outerJson = decodeExtra(extra);
    if (!outerJson) return null;
    let outer: any;
    try {
        outer = JSON.parse(outerJson);
    } catch (error) {
        return null;
    }
    if (!outer || Number(outer.code) !== BroadcastCode.BroadcastMsg) return null;
    let inner = outer.data;
    if (typeof inner === 'string') {
        try {
            inner = JSON.parse(inner);
        } catch (error) {
            return null;
        }
    }
    return inner;
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
