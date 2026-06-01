// package: holdem.pb
// file: protobuf/holdem/req_gd_auto_op_active.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageGdAutoOpActive extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getEnable(): boolean;
  setEnable(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageGdAutoOpActive.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageGdAutoOpActive): ClientMessageGdAutoOpActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageGdAutoOpActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageGdAutoOpActive;
  static deserializeBinaryFromReader(message: ClientMessageGdAutoOpActive, reader: jspb.BinaryReader): ClientMessageGdAutoOpActive;
}

export namespace ClientMessageGdAutoOpActive {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    enable: boolean,
  }
}

export class ServerMessageGdAutoOpActive extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdAutoOpActive.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdAutoOpActive): ServerMessageGdAutoOpActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdAutoOpActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdAutoOpActive;
  static deserializeBinaryFromReader(message: ServerMessageGdAutoOpActive, reader: jspb.BinaryReader): ServerMessageGdAutoOpActive;
}

export namespace ServerMessageGdAutoOpActive {
  export type AsObject = {
    status: number,
  }
}

