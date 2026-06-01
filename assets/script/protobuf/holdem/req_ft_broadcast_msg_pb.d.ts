// package: holdem.pb
// file: protobuf/holdem/req_ft_broadcast_msg.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageFtBroadcastMsg extends jspb.Message {
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
  toObject(includeInstance?: boolean): ClientMessageFtBroadcastMsg.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageFtBroadcastMsg): ClientMessageFtBroadcastMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageFtBroadcastMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageFtBroadcastMsg;
  static deserializeBinaryFromReader(message: ClientMessageFtBroadcastMsg, reader: jspb.BinaryReader): ClientMessageFtBroadcastMsg;
}

export namespace ClientMessageFtBroadcastMsg {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    consume: protobuf_holdem_define_pb.Def.ConsumeTypeMap[keyof protobuf_holdem_define_pb.Def.ConsumeTypeMap],
    message: string,
    extra: Uint8Array | string,
    msgType: protobuf_holdem_define_pb.Def.BroadcastMsgTypeMap[keyof protobuf_holdem_define_pb.Def.BroadcastMsgTypeMap],
  }
}

export class ServerMessageFtBroadcastMsg extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtBroadcastMsg.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtBroadcastMsg): ServerMessageFtBroadcastMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtBroadcastMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtBroadcastMsg;
  static deserializeBinaryFromReader(message: ServerMessageFtBroadcastMsg, reader: jspb.BinaryReader): ServerMessageFtBroadcastMsg;
}

export namespace ServerMessageFtBroadcastMsg {
  export type AsObject = {
    status: number,
  }
}

