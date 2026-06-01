// package: holdem.pb
// file: protobuf/holdem/req_mj_auto_op_active.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageMjAutoOpActive extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getEnable(): boolean;
  setEnable(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageMjAutoOpActive.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageMjAutoOpActive): ClientMessageMjAutoOpActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageMjAutoOpActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageMjAutoOpActive;
  static deserializeBinaryFromReader(message: ClientMessageMjAutoOpActive, reader: jspb.BinaryReader): ClientMessageMjAutoOpActive;
}

export namespace ClientMessageMjAutoOpActive {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    enable: boolean,
  }
}

export class ServerMessageMjAutoOpActive extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjAutoOpActive.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjAutoOpActive): ServerMessageMjAutoOpActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjAutoOpActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjAutoOpActive;
  static deserializeBinaryFromReader(message: ServerMessageMjAutoOpActive, reader: jspb.BinaryReader): ServerMessageMjAutoOpActive;
}

export namespace ServerMessageMjAutoOpActive {
  export type AsObject = {
    status: number,
  }
}

