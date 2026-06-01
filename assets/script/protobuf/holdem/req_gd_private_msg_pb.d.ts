// package: holdem.pb
// file: protobuf/holdem/req_gd_private_msg.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageGdPrivateMsg extends jspb.Message {
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

  getTargetUserRid(): number;
  setTargetUserRid(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageGdPrivateMsg.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageGdPrivateMsg): ClientMessageGdPrivateMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageGdPrivateMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageGdPrivateMsg;
  static deserializeBinaryFromReader(message: ClientMessageGdPrivateMsg, reader: jspb.BinaryReader): ClientMessageGdPrivateMsg;
}

export namespace ClientMessageGdPrivateMsg {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    consume: protobuf_holdem_define_pb.Def.ConsumeTypeMap[keyof protobuf_holdem_define_pb.Def.ConsumeTypeMap],
    message: string,
    extra: Uint8Array | string,
    targetUserRid: number,
  }
}

export class ServerMessageGdPrivateMsg extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdPrivateMsg.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdPrivateMsg): ServerMessageGdPrivateMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdPrivateMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdPrivateMsg;
  static deserializeBinaryFromReader(message: ServerMessageGdPrivateMsg, reader: jspb.BinaryReader): ServerMessageGdPrivateMsg;
}

export namespace ServerMessageGdPrivateMsg {
  export type AsObject = {
    status: number,
  }
}

