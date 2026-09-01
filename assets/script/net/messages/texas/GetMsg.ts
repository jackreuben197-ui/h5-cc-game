import { ServerMessageGetMsg } from '@silenthill/agreement-web';
import roomDataManager from '../../../data/room/RoomDataManager';
import TexasGameRoomData from '../../../data/room/texas/TexasGameRoomData';
import TexasGameRoomDataChat from '../../../data/room/texas/TexasGameRoomDataChat';
import userStore from '../../../data/user/UserStore';
import { handleBroadcastExtra } from './BroadcastMsg';

/** GetMsg extra 内层广播数据（对应 pokerqueen BroadcastMsg.Response 的结果）。 */
interface BroadcastMsgData {
    name?: string;
    type?: number;
    user_id?: number;
    target_user_id?: number;
    message?: string;
    /** 1=表情（type 为 PropsID），2=文字，3=语音（对齐 Unity UIGameplayChatComponent） */
    msgType?: number;
    time?: number;
    sex?: number;
    headUrl?: string;
    isDanmu?: boolean;
    is_prologue?: boolean;
}

function decodeExtra(extra: Uint8Array | string): string | null {
    try {
        if (extra instanceof Uint8Array) {
            return new TextDecoder('utf-8').decode(extra);
        }
        const bin = atob(extra.toString());
        const u8 = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
        return new TextDecoder('utf-8').decode(u8);
    } catch (e) {
        console.warn('[GetMsg] extra decode error:', e);
        return null;
    }
}

// GetMsg 1121
export function GetMsg(data: ServerMessageGetMsg.AsObject, roomID: number, matchID: number) {
    const roomData = roomDataManager.getRoomData<TexasGameRoomData>(roomID, matchID);
    if (!roomData) return;
    // main 分支的座位实时动画路由：扔道具(600-611)→飞道具，魔法表情(≥700)→头像播 spine。
    // 与下方“聊天面板记录”是两件事，互不冲突：魔法表情既在头像上播、也进聊天记录。
    handleBroadcastExtra(data.extra, roomID, matchID);
    const json = decodeExtra(data.extra);
    if (!json) return;
    let envelope: { code?: number; data?: unknown };
    try {
        envelope = JSON.parse(json);
    } catch (e) {
        console.warn('[GetMsg] JSON parse error:', json?.substring(0, 200));
        return;
    }
    // 1000=文字聊天/弹幕，10001=表情/道具（表情不在本次迁移范围，靠 type!==0 过滤）
    if (envelope.code !== 1000 && envelope.code !== 10001) return;
    console.log('[Chat][GetMsg] 收到广播', { code: envelope.code, roomID });
    let broadcastMsg: BroadcastMsgData;
    try {
        broadcastMsg = typeof envelope.data === 'string' ? JSON.parse(envelope.data) : (envelope.data as BroadcastMsgData);
    } catch (e) {
        console.warn('[GetMsg] inner data parse error:', e);
        return;
    }
    if (!broadcastMsg) return;
    console.log('[Chat][GetMsg] 解析消息', broadcastMsg);
    const isSelfMessage = broadcastMsg.user_id === userStore.userID;
    const timestamp = TexasGameRoomDataChat.normalizeTimestamp(broadcastMsg.time || Date.now());
    // 表情消息：msgType=1，type 为 PropsID（对齐 Unity UIGameplayChatComponent 判定标准）
    if (broadcastMsg.msgType === 1 && typeof broadcastMsg.type === 'number') {
        roomData.chat.addMessage(
            {
                userID: broadcastMsg.user_id,
                name: broadcastMsg.name || '',
                content: '',
                headUrl: broadcastMsg.headUrl || '',
                sex: broadcastMsg.sex || 0,
                timestamp,
                time: TexasGameRoomDataChat.formatTimestamp(timestamp),
                emojiType: broadcastMsg.type
            },
            !isSelfMessage
        );
        return;
    }
    // 只处理文本聊天/弹幕：type=0 且有内容
    if (broadcastMsg.type !== 0 || !broadcastMsg.message) return;
    // 本人消息走 1019 确认路径（BroadcastMsg.ts），此处过滤
    if (isSelfMessage) return;
    if (broadcastMsg.isDanmu === true) {
        roomData.chat.addDanmu({
            name: broadcastMsg.name || '',
            content: broadcastMsg.message
        });
        return;
    }
    roomData.chat.addMessage(
        {
            userID: broadcastMsg.user_id,
            name: broadcastMsg.name || '',
            content: broadcastMsg.message,
            headUrl: broadcastMsg.headUrl || '',
            sex: broadcastMsg.sex || 0,
            timestamp,
            time: TexasGameRoomDataChat.formatTimestamp(timestamp)
        },
        true
    );
}
