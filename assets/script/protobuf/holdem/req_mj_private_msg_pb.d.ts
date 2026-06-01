// package: holdem.pb
// file: protobuf/holdem/req_mj_private_msg.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageMjPrivateMsg extends jspb.Message {
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
  toObject(includeInstance?: boolean): ClientMessageMjPrivateMsg.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageMjPrivateMsg): ClientMessageMjPrivateMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageMjPrivateMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageMjPrivateMsg;
  static deserializeBinaryFromReader(message: ClientMessageMjPrivateMsg, reader: jspb.BinaryReader): ClientMessageMjPrivateMsg;
}

export namespace ClientMessageMjPrivateMsg {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    consume: protobuf_holdem_define_pb.Def.ConsumeTypeMap[keyof protobuf_holdem_define_pb.Def.ConsumeTypeMap],
    message: string,
    extra: Uint8Array | string,
    targetUserRid: number,
  }
}

export class ServerMessageMjPrivateMsg extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjPrivateMsg.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjPrivateMsg): ServerMessageMjPrivateMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjPrivateMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjPrivateMsg;
  static deserializeBinaryFromReader(message: ServerMessageMjPrivateMsg, reader: jspb.BinaryReader): ServerMessageMjPrivateMsg;
}

export namespace ServerMessageMjPrivateMsg {
  export type AsObject = {
    status: number,
  }
}

