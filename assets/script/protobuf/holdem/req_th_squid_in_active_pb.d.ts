// package: holdem.pb
// file: protobuf/holdem/req_th_squid_in_active.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageSquidInActive extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getEnable(): boolean;
  setEnable(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageSquidInActive.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageSquidInActive): ClientMessageSquidInActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageSquidInActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageSquidInActive;
  static deserializeBinaryFromReader(message: ClientMessageSquidInActive, reader: jspb.BinaryReader): ClientMessageSquidInActive;
}

export namespace ClientMessageSquidInActive {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    enable: boolean,
  }
}

export class ServerMessageSquidInActive extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageSquidInActive.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageSquidInActive): ServerMessageSquidInActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageSquidInActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageSquidInActive;
  static deserializeBinaryFromReader(message: ServerMessageSquidInActive, reader: jspb.BinaryReader): ServerMessageSquidInActive;
}

export namespace ServerMessageSquidInActive {
  export type AsObject = {
    status: number,
  }
}

