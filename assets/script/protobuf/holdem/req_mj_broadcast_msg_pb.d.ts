// package: holdem.pb
// file: protobuf/holdem/req_mj_broadcast_msg.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageMjBroadcastMsg extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getConsume(): protobuf_holdem_define_pb.Def.ConsumeTypeMap[keyof protobuf_holdem_define_pb.Def.ConsumeTypeMap];
  setConsume(value: protobuf_holdem_define_pb.Def.ConsumeTypeMap[keyof protobuf_holdem_define_pb.Def.ConsumeTypeMap]): void;

  getMessage(): string;
  setMessage(value: string): void;

  getExtra(): Uint8Array | string;
  getExtra_asU8(): Uint8Array;
  getExtra_asB64(): string;
  setExtra(value: Uint8Array | string): void;

  getMsgType(): protobuf_holdem_define_pb.Def.BroadcastMsgTypeMap[keyof protobuf_holdem_define_pb.Def.BroadcastMsgTypeMap];
  setMsgType(value: protobuf_holdem_define_pb.Def.BroadcastMsgTypeMap[keyof protobuf_holdem_define_pb.Def.BroadcastMsgTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageMjBroadcastMsg.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageMjBroadcastMsg): ClientMessageMjBroadcastMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageMjBroadcastMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageMjBroadcastMsg;
  static deserializeBinaryFromReader(message: ClientMessageMjBroadcastMsg, reader: jspb.BinaryReader): ClientMessageMjBroadcastMsg;
}

export namespace ClientMessageMjBroadcastMsg {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    consume: protobuf_holdem_define_pb.Def.ConsumeTypeMap[keyof protobuf_holdem_define_pb.Def.ConsumeTypeMap],
    message: string,
    extra: Uint8Array | string,
    msgType: protobuf_holdem_define_pb.Def.BroadcastMsgTypeMap[keyof protobuf_holdem_define_pb.Def.BroadcastMsgTypeMap],
  }
}

export class ServerMessageMjBroadcastMsg extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjBroadcastMsg.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjBroadcastMsg): ServerMessageMjBroadcastMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjBroadcastMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjBroadcastMsg;
  static deserializeBinaryFromReader(message: ServerMessageMjBroadcastMsg, reader: jspb.BinaryReader): ServerMessageMjBroadcastMsg;
}

export namespace ServerMessageMjBroadcastMsg {
  export type AsObject = {
    status: number,
  }
}

