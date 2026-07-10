import { Def, ServerMessageBroadcastMsg } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import { EmojiBroadcastData, ThrowPropBroadcastData } from '../../../data/room/texas/TexasGameRoomDataSeatsStateManager';

const BROADCAST_MSG_CODE = 1000;

const EMOJI_TYPE_COUNT = 15;

const PROP_TYPE_COUNT = 12;

// BroadcastMsg 1019
export function BroadcastMsg(data: ServerMessageBroadcastMsg.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    roomData.seatsStateManager.confirmPendingThrowProp(data.status);
    roomData.seatsStateManager.confirmPendingEmoji(data.status);
}

export function handleBroadcastExtra(extra: Uint8Array | string, roomID: number, matchID: number): void {
    const propData = parseThrowPropBroadcast(extra);
    const emojiData = parseEmojiBroadcast(extra);
    if (!propData && !emojiData) return;
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (propData) roomData.seatsStateManager.throwPropEvent(propData);
    if (emojiData) roomData.seatsStateManager.emojiEvent(emojiData);
}

export function parseThrowPropBroadcast(extra: Uint8Array | string): ThrowPropBroadcastData | null {
    const inner = parseBroadcastInner(extra);
    if (!inner) return null;
    const type = Number(inner.type || 0);
    const userID = Number(inner.user_id || 0);
    const targetUserID = Number(inner.target_user_id || 0);
    const propOffset = type - getThrowPropTypeBase();
    if (propOffset < 0 || propOffset >= PROP_TYPE_COUNT || !userID || !targetUserID) return null;
    return { type, userID, targetUserID };
}

export function parseEmojiBroadcast(extra: Uint8Array | string): EmojiBroadcastData | null {
    const inner = parseBroadcastInner(extra);
    if (!inner) return null;
    const type = Number(inner.type || 0);
    const userID = Number(inner.user_id || 0);
    const emojiOffset = type - getEmojiTypeBase();
    if (emojiOffset < 0 || emojiOffset >= EMOJI_TYPE_COUNT || !userID) return null;
    return { type, userID };
}

function getEmojiTypeBase(): number {
    return Def.ConsumeType.CT_EMOJI_1 * 100;
}

function getThrowPropTypeBase(): number {
    return Def.ConsumeType.CT_EMOJI_2 * 100;
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
    if (!outer || Number(outer.code) !== BROADCAST_MSG_CODE) return null;
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
