import { Code, CodeMap, GPS, PotInsuranceBuy, Room } from '@silenthill/agreement-web';
import h5MessageManager from '../../H5MsgMgr';
import { traceClass } from '../../core/decorator/LogTrace';
import userStore from '../../data/user/UserStore';
import MessageHandler from '../messages/MessageHandler';
import { CodeMessageCowboyClientGC, CodeMessageCowboyServerGC } from './CodeMessageCowboyGC';
import { CodeMessageFantasyClientGC, CodeMessageFantasyServerGC } from './CodeMessageFantasyGC';
import { CodeMessageGuandanClientGC, CodeMessageGuandanServerGC } from './CodeMessageGuandanGC';
import { CodeMessageMahjongClientGC, CodeMessageMahjongServerGC } from './CodeMessageMahjongGC';
import { CodeMessageOtherClientGC, CodeMessageOtherServerGC, CodeMessageRpcClientGC } from './CodeMessageOtherGC';
import { CodeMessageTexasClientGC, CodeMessageTexasServerGC } from './CodeMessageTexasGC';
import OpCodeHelper from './OpCodeHelper';
import packetHead from './PacketHead';

const { ccclass, property } = cc._decorator;

export interface IProtocolRpc {
    rpcId: number;
}

@ccclass
@traceClass()
export default class ProtocolAgency extends cc.Component {
    private static _codeNameMap: Record<number, string> | null = null;
    // 序列化的时候，如果找不到类定义用这个
    private static _staticClassDic = { room: Room, gps: GPS, buyList: PotInsuranceBuy };

    public static getCodeName(codeValue: number): string {
        // 【核心判断】如果还没初始化过，就初始化一次；以后进来直接跳过
        if (!this._codeNameMap) {
            this._codeNameMap = {};
            for (const key in Code) {
                const val = Code[key as keyof CodeMap];
                this._codeNameMap[val] = key;
            }
            ProtocolAgency.tracelog.debug('CodeNameMap 初始化');
        }
        return this._codeNameMap[codeValue] || `UNKNOWN_CODE(${codeValue})`;
    }

    public static gTimeStamp: number = 0;
    private static _rpcIdSeed: number = 0;
    private static _pendingRequests = new Map<number, (data: any) => void>();

    private static _getAvailableRpcId(): number {
        this._rpcIdSeed = (this._rpcIdSeed + 1) % 0xffffffff; // uint.MaxValue
        if (this._rpcIdSeed == 0) {
            this._rpcIdSeed = 1;
        }
        return this._rpcIdSeed;
    }

    private static _getRpcId(data: any): number | null {
        if (data && typeof data === 'object' && 'rpcId' in data && typeof data.rpcId === 'number') {
            return data.rpcId;
        }
        return null;
    }

    static async SendAsync<K extends keyof CodeMessageRpcClientGC>(
        code: K,
        param: CodeMessageRpcClientGC[K][1],
        roomID: number = 0,
        matchID: number = 0,
        classDic?: Record<string, { new (): any }>
    ): Promise<CodeMessageRpcClientGC[K][3]> {
        return new Promise((resolve, reject) => {
            // 重置 rpcid
            param.rpcId = this._getAvailableRpcId();
            this._pendingRequests.set(param.rpcId, (data: CodeMessageRpcClientGC[K][3]) => {
                this.tracelog.debug('RPCID(complete):', param.rpcId);
                resolve(data);
            });
            this.tracelog.debug('RPCID:', param.rpcId);
            this.Send({
                code: code,
                roomID: roomID,
                matchID: matchID,
                body: param,
                classDic: classDic
            });
            const rpcId = param.rpcId;
            setTimeout(() => {
                if (this._pendingRequests.has(rpcId)) {
                    this._pendingRequests.delete(rpcId);
                    reject(new Error(`请求超时: ${code}`));
                }
            }, 3000); // 3秒超时
        });
    }

    private static _clientCtorMap: Map<number, any> = new Map();

    private static _getClientCtor(code: number): { new (): any } | null {
        if (code >= 4001 && code < 5000) return (CodeMessageGuandanClientGC as any)[code]?.[0];
        if (code >= 3001 && code < 4000) return (CodeMessageMahjongClientGC as any)[code]?.[0];
        if (code >= 2001 && code < 3000) return (CodeMessageCowboyClientGC as any)[code]?.[0];
        if (code >= 1201 && code < 1400) return (CodeMessageFantasyClientGC as any)[code]?.[0];
        if (code >= 1001 && code < 1200) return (CodeMessageTexasClientGC as any)[code]?.[0];
        return (CodeMessageOtherClientGC as any)[code]?.[0] ?? (CodeMessageRpcClientGC as any)[code]?.[0];
    }

    private static _cachedClientClass(code: number): any {
        if (this._clientCtorMap.has(code)) {
            return this._clientCtorMap.get(code);
        }
        const Ctor = this._getClientCtor(code);
        if (!Ctor) return null;
        const inst = new Ctor();
        this._clientCtorMap.set(code, inst);
        return inst;
    }

    private static _setProtoFields(obj: any, body: any, classDic?: Record<string, { new (): any }>) {
        for (const key in body) {
            const value = body[key];
            const setter = 'set' + key[0].toUpperCase() + key.slice(1);
            if (typeof obj[setter] !== 'function') continue;
            if (classDic && classDic[key]) {
                if (value instanceof Array) {
                    const children: any[] = [];
                    value.forEach(item => {
                        const child = new classDic[key]();
                        this._setProtoFields(child, item, classDic);
                        children.push(child);
                    });
                    obj[setter](children);
                } else {
                    const child = new classDic[key]();
                    obj[setter](child);
                    this._setProtoFields(child, value, classDic);
                }
            } else {
                obj[setter](value);
            }
        }
    }

    private static _serializeBody(code: number, body: any, classDic?: Record<string, { new (): any }>): Uint8Array | null {
        const msg = this._cachedClientClass(code);
        if (!msg) {
            this.tracelog.error('no client message class for code', code, ProtocolAgency.getCodeName(code));
            return null;
        }
        let inClassDic: Record<string, any>;
        if (classDic) {
            inClassDic = { ...this._staticClassDic, ...classDic };
        } else {
            inClassDic = this._staticClassDic;
        }
        this._setProtoFields(msg, body, inClassDic);
        return msg.serializeBinary();
    }

    /** 发送德州数据 */
    static Send<K extends keyof CodeMessageTexasClientGC>(param: {
        code: K;
        roomID: number;
        matchID: number;
        body: CodeMessageTexasClientGC[K][1];
        classDic?: Record<string, { new (): any }>;
    }): void;

    /** 发送Fantasy12数据 */
    static Send<K extends keyof CodeMessageFantasyClientGC>(param: {
        code: K;
        roomID: number;
        matchID: number;
        body: CodeMessageFantasyClientGC[K][1];
        classDic?: Record<string, { new (): any }>;
    }): void;

    /** 发送Cowboy数据 */
    static Send<K extends keyof CodeMessageCowboyClientGC>(param: {
        code: K;
        roomID: number;
        matchID: number;
        body: CodeMessageCowboyClientGC[K][1];
        classDic?: Record<string, { new (): any }>;
    }): void;

    /** 发送Mahjong数据 */
    static Send<K extends keyof CodeMessageMahjongClientGC>(param: {
        code: K;
        roomID: number;
        matchID: number;
        body: CodeMessageMahjongClientGC[K][1];
        classDic?: Record<string, { new (): any }>;
    }): void;

    /** 发送Guandan数据 */
    static Send<K extends keyof CodeMessageGuandanClientGC>(param: {
        code: K;
        roomID: number;
        matchID: number;
        body: CodeMessageGuandanClientGC[K][1];
        classDic?: Record<string, { new (): any }>;
    }): void;

    /** 发送Other数据 */
    static Send<K extends keyof CodeMessageOtherClientGC>(param: {
        code: K;
        roomID: number;
        matchID: number;
        body: CodeMessageOtherClientGC[K][1];
        classDic?: Record<string, { new (): any }>;
    }): void;

    /** 发送RPC数据(实际情况是SendAsync直接调用) */
    static Send<K extends keyof CodeMessageRpcClientGC>(param: {
        code: K;
        roomID: number;
        matchID: number;
        body: CodeMessageRpcClientGC[K][1];
        classDic?: Record<string, { new (): any }>;
    }): void;

    /** 发送数据 */
    static Send(param: { code: number; roomID: number; matchID: number; body: any; classDic?: Record<string, { new (): any }> }): void {
        // H5 桥接模式：所有协议通过 H5 层转发
        if (h5MessageManager.handshakeDone && userStore.token) {
            const protocol_name = ProtocolAgency.getCodeName(param.code);
            if (!protocol_name) {
                this.tracelog.debug('code not in ProtocolCode', protocol_name, JSON.stringify(param));
                return;
            }
            // let client = ProtocolMap[param.Code]?.Client;
            // if (!client) {
            //     this.tracelog.debug('protocol unregistered in ProtocolMap', protocol_name, JSON.stringify(param));
            //     return;
            // }
            if (OpCodeHelper.NeedLog(param.code as (typeof Code)[keyof typeof Code])) {
                this.tracelog.debug(`>>>>> send: ${protocol_name}`, `roomID:${param.roomID},matchID:${param.matchID},body:`, param.body);
            }
            const bodyBA = this._serializeBody(param.code, param.body, param.classDic);
            if (!bodyBA) return;
            const bodyLength: number = bodyBA.byteLength;
            let dataLength: number = packetHead.FixHeadLength + bodyLength;
            let bufferLength: number = packetHead.Length + bodyLength;
            let arrayBuffer: ArrayBuffer = new ArrayBuffer(bufferLength);
            let dataView: DataView = new DataView(arrayBuffer);
            this._writeUint32(dataView, packetHead.FieldOffset.DataLength, dataLength);
            this._writeUint8Array(dataView, packetHead.FieldOffset.CharsFlag, packetHead.CharsFlag);
            this._writeUint16(dataView, packetHead.FieldOffset.Code, param.code);
            this._writeString(dataView, packetHead.FieldOffset.Token, userStore.token);
            this._writeUint64(dataView, packetHead.FieldOffset.RoomID, param.roomID);
            this._writeUint64(dataView, packetHead.FieldOffset.MatchID, param.matchID);
            this._writeUint8(dataView, packetHead.FieldOffset.ProtoVersion, packetHead.ProtoVersion.Protobuf);
            this._writeUint8Array(dataView, packetHead.Length, bodyBA);
            // 通过 H5 桥接转发二进制包
            h5MessageManager.sendToH5('wsSend', 0, new Uint8Array(arrayBuffer));
            return;
        }
    }

    private static _writeUint8(dataView: DataView, offset: number, num: number) {
        dataView.setUint8(offset, num);
    }

    private static _writeUint16(dataView: DataView, offset: number, num: number) {
        dataView.setUint16(offset, num);
    }

    private static _writeUint32(dataView: DataView, offset: number, num: number) {
        dataView.setUint32(offset, num);
    }

    /**
     * js不具备64位整型，需要特殊处理
     * @param dataView
     * @param offset
     * @param num
     */
    private static _writeUint64(dataView: DataView, offset: number, num: number) {
        if (num > 0xffffffff) {
            let num_hex_str = num.toString(16);
            let m = num_hex_str.length - 8;
            let a = num_hex_str.substring(0, m);
            let b = num_hex_str.substring(m);
            dataView.setUint32(offset, parseInt('0x' + a));
            dataView.setUint32(offset + 4, parseInt('0x' + b));
        } else {
            dataView.setUint32(offset, 0);
            dataView.setUint32(offset + 4, num);
        }
    }

    private static _writeString(dataView: DataView, offset: number, str: string) {
        for (let i = 0; i < str.length; i++) {
            let value: number = str.charCodeAt(i);
            dataView.setUint8(offset++, value);
        }
    }

    private static _writeUint8Array(dataView: DataView, offset: number, uint8Array: Uint8Array) {
        for (let i = 0; i < uint8Array.length; i++) {
            let value: number = uint8Array[i];
            dataView.setUint8(offset++, value);
        }
    }

    private static _getServerCtor(code: number): { deserializeBinary(bytes: Uint8Array): any } | null {
        if (code >= 4001 && code < 5000) return (CodeMessageGuandanServerGC as any)[code];
        if (code >= 3001 && code < 4000) return (CodeMessageMahjongServerGC as any)[code];
        if (code >= 2001 && code < 3000) return (CodeMessageCowboyServerGC as any)[code];
        if (code >= 1201 && code < 1400) return (CodeMessageFantasyServerGC as any)[code];
        if (code >= 1001 && code < 1200) return (CodeMessageTexasServerGC as any)[code];
        return (CodeMessageOtherServerGC as any)[code];
    }

    static Receive(data: ArrayBuffer) {
        if (!data) return;
        let ua = new Uint8Array(data);
        for (let i = 0; i < packetHead.CharsFlag.length; i++) {
            if (ua[i] != packetHead.CharsFlag[i]) {
                this.tracelog.debug('charsflag is no match');
                return;
            }
        }
        let code_offset = packetHead.FieldOffset.Code - packetHead.FieldSize.DataLength;
        let code: number = this._readNumber(ua, code_offset, packetHead.FieldSize.Code);
        const protocol_name = ProtocolAgency.getCodeName(code);
        if (!protocol_name) {
            this.tracelog.debug('code is undefined ' + code);
            return;
        }
        if (
            code < 1000 &&
            code != Code.MSG_D_REGISTER &&
            code != Code.MSG_R_ROOMS &&
            code != Code.MSG_R_MTT_DETAIL &&
            code != Code.MSG_S_ROOM_USER_SEND_DIAMOND &&
            code != Code.MSG_S_UTIL_ANTI_CHEAT_ROOM_VIDEO &&
            code != Code.MSG_S_NOTIFICATION_ROOM_READY
        ) {
            // this.tracelog.debug('drop code:', ProtocolAgency.getCodeName(code));
            return;
        }
        let roomid_offset = packetHead.FieldOffset.RoomID - packetHead.FieldSize.DataLength;
        let matchid_offset = packetHead.FieldOffset.MatchID - packetHead.FieldSize.DataLength;
        let roomid: number = this._readNumber(ua, roomid_offset, packetHead.FieldSize.RoomID);
        let matchid: number = this._readNumber(ua, matchid_offset, packetHead.FieldSize.MatchID);
        let body_ua: Uint8Array = new Uint8Array(data.slice(packetHead.FixHeadLength));
        const ServerCtor = this._getServerCtor(code);
        if (!ServerCtor) {
            this.tracelog.debug('protocol unregistered for receive ' + code);
            return;
        }
        const msg = ServerCtor.deserializeBinary(body_ua);
        let body: any = msg.toObject();
        if (OpCodeHelper.NeedLog(code as (typeof Code)[keyof typeof Code])) {
            this.tracelog.debug(`<<<<< receive : ${protocol_name}`, `RoomID:${roomid},MatchID:${matchid},body:`, body);
        }
        const rpcId = this._getRpcId(body);
        // 检查是否有 SendAsync 在等这个 code
        if (rpcId && this._pendingRequests.has(rpcId)) {
            const resolve = this._pendingRequests.get(rpcId);
            // 移除映射（防止重复触发）
            this._pendingRequests.delete(rpcId);
            // 关键：把数据传回给 SendAsync 里的 resolve
            if (resolve) {
                resolve(body);
            }
            return;
        }
        //
        // 记录服务器的timeStamp数据：
        if (code == Code.MSG_D_HEARTBEAT) {
            // 记录当前Server时间戳:
            if ((body as any).timestamp) {
                if (!this.gTimeStamp) console.log('首次设置全局的GTimeStamp:' + (body as any).timestamp);
                this.gTimeStamp = (body as any).timestamp;
            }
        }
        // 新的消息处理，只针对新的模式
        MessageHandler.handle(code, body, roomid, matchid);
        body = null;
        body_ua = null;
    }

    private static _readNumber(ua: Uint8Array, offset: number, size: number): number {
        let result: number = 0;
        for (let i = 0; i < size; i++) {
            let num = ua[offset + i];
            let op = size - i - 1;
            result |= num << (op * 8);
        }
        return result;
    }
}
