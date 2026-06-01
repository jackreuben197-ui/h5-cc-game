// package: holdem.pb
// file: protobuf/holdem/req_mj_replay.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageMjReplay extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getMatchNum(): number;
  setMatchNum(value: number): void;

  getUniqueId(): string;
  setUniqueId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageMjReplay.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageMjReplay): ClientMessageMjReplay.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageMjReplay, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageMjReplay;
  static deserializeBinaryFromReader(message: ClientMessageMjReplay, reader: jspb.BinaryReader): ClientMessageMjReplay;
}

export namespace ClientMessageMjReplay {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    matchNum: number,
    uniqueId: string,
  }
}

export class ServerMessageMjReplay extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjReplay.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjReplay): ServerMessageMjReplay.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjReplay, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjReplay;
  static deserializeBinaryFromReader(message: ServerMessageMjReplay, reader: jspb.BinaryReader): ServerMessageMjReplay;
}

export namespace ServerMessageMjReplay {
  export type AsObject = {
    status: number,
    data: Uint8Array | string,
  }
}

