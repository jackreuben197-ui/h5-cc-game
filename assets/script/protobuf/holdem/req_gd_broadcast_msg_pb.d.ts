// package: holdem.pb
// file: protobuf/holdem/req_gd_broadcast_msg.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageGdBroadcastMsg extends jspb.Message {
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
  toObject(includeInstance?: boolean): ClientMessageGdBroadcastMsg.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageGdBroadcastMsg): ClientMessageGdBroadcastMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageGdBroadcastMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageGdBroadcastMsg;
  static deserializeBinaryFromReader(message: ClientMessageGdBroadcastMsg, reader: jspb.BinaryReader): ClientMessageGdBroadcastMsg;
}

export namespace ClientMessageGdBroadcastMsg {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    consume: protobuf_holdem_define_pb.Def.ConsumeTypeMap[keyof protobuf_holdem_define_pb.Def.ConsumeTypeMap],
    message: string,
    extra: Uint8Array | string,
    msgType: protobuf_holdem_define_pb.Def.BroadcastMsgTypeMap[keyof protobuf_holdem_define_pb.Def.BroadcastMsgTypeMap],
  }
}

export class ServerMessageGdBroadcastMsg extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdBroadcastMsg.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdBroadcastMsg): ServerMessageGdBroadcastMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdBroadcastMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdBroadcastMsg;
  static deserializeBinaryFromReader(message: ServerMessageGdBroadcastMsg, reader: jspb.BinaryReader): ServerMessageGdBroadcastMsg;
}

export namespace ServerMessageGdBroadcastMsg {
  export type AsObject = {
    status: number,
  }
}

