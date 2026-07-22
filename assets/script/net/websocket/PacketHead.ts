/**
 * 头部包体结构
 */

class PacketHead {
    /*
包格式（表头：字节长度)
|       4        |     2     |       4       |            32            |      8      |      8      |         1          |          0-n          |
| :------------: | :-------: | :-----------: | :----------------------: | :---------: | :---------: | :----------------: | :-------------------: |
| 数据段的总长度  | 消息类型   |   固定标记     |     用户标记(Token)       |   roomID    |   matchID  | 数据段结构的版本号   |      各异数据段       |
|   120(int32)   | 1(uint16) | BQMN(char[4]) | asdffdsaasdffdsa(string) |             |             |      2 (int8)      | 数据marshal后数据byte |

⚠️ 新协议（与 h5-game src/bridge/ws/holdemPacket.ts 对齐，必须一致，否则服务端直接断开 1006）：
  - 固定标记由 "YM"(2字节) 改为 "BQMN"(4字节)
  - 字段顺序调整：消息类型(Code) 移到 固定标记(CharsFlag) 之前
  发送包偏移: dataLength=0, code=4, BQMN=6, token=10, roomID=42, matchID=50, protoVersion=58, body=59
  接收包偏移(不含 dataLength): code=0, BQMN=2, token=6, roomID=38, matchID=46, protoVersion=54, body=55
  旧格式: YM(2) 在 code 之前, Length=57, FixHeadLength=53
*/
    //固定标记
    public CharsFlag: Uint8Array = new Uint8Array([0x42 /*B*/, 0x51 /*Q*/, 0x4d /*M*/, 0x4e /*N*/]);
    private _length: number = 0;
    private _fixlength: number = 0;
    public ProtoVersion = {
        Unknown: 0,
        Json: 1,
        Protobuf: 2
    };
    public FieldSize = {
        DataLength: 4,
        CharsFlag: 4,
        Code: 2,
        Token: 32,
        RoomID: 8,
        MatchID: 8,
        ProtoVersion: 1
    };
    public FieldIndex = {
        DataLength: 0,
        Code: 1,
        CharsFlag: 2,
        Token: 3,
        RoomID: 4,
        MatchID: 5,
        ProtoVersion: 6
    };
    public FieldOffset = {
        DataLength: 0,
        CharsFlag: 0,
        Code: 0,
        Token: 0,
        RoomID: 0,
        MatchID: 0,
        ProtoVersion: 0
    };

    public constructor() {
        // 新协议顺序：dataLength → code → CharsFlag(BQMN) → token → roomID → matchID → protoVersion
        this.FieldOffset.Code = this.FieldOffset.DataLength + this.FieldSize.DataLength;
        this.FieldOffset.CharsFlag = this.FieldOffset.Code + this.FieldSize.Code;
        this.FieldOffset.Token = this.FieldOffset.CharsFlag + this.FieldSize.CharsFlag;
        this.FieldOffset.RoomID = this.FieldOffset.Token + this.FieldSize.Token;
        this.FieldOffset.MatchID = this.FieldOffset.RoomID + this.FieldSize.RoomID;
        this.FieldOffset.ProtoVersion = this.FieldOffset.MatchID + this.FieldSize.MatchID;
        this._length =
            this.FieldSize.DataLength +
            this.FieldSize.CharsFlag +
            this.FieldSize.Code +
            this.FieldSize.Token +
            this.FieldSize.RoomID +
            this.FieldSize.MatchID +
            this.FieldSize.ProtoVersion;
        this._fixlength = this._length - this.FieldSize.DataLength;
    }

    public get Length(): number {
        return this._length;
    }
    public get FixHeadLength(): number {
        return this._fixlength;
    }
}

const packetHead = new PacketHead();

export default packetHead;
