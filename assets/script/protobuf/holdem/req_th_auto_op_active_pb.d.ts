// package: holdem.pb
// file: protobuf/holdem/req_th_auto_op_active.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageAutoOpActive extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getEnable(): boolean;
  setEnable(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageAutoOpActive.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageAutoOpActive): ClientMessageAutoOpActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageAutoOpActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageAutoOpActive;
  static deserializeBinaryFromReader(message: ClientMessageAutoOpActive, reader: jspb.BinaryReader): ClientMessageAutoOpActive;
}

export namespace ClientMessageAutoOpActive {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    enable: boolean,
  }
}

export class ServerMessageAutoOpActive extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageAutoOpActive.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageAutoOpActive): ServerMessageAutoOpActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageAutoOpActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageAutoOpActive;
  static deserializeBinaryFromReader(message: ServerMessageAutoOpActive, reader: jspb.BinaryReader): ServerMessageAutoOpActive;
}

export namespace ServerMessageAutoOpActive {
  export type AsObject = {
    status: number,
  }
}

