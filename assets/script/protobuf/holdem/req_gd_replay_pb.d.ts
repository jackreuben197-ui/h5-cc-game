// package: holdem.pb
// file: protobuf/holdem/req_gd_replay.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageGdReplay extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getMatchNum(): number;
  setMatchNum(value: number): void;

  getUniqueId(): string;
  setUniqueId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageGdReplay.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageGdReplay): ClientMessageGdReplay.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageGdReplay, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageGdReplay;
  static deserializeBinaryFromReader(message: ClientMessageGdReplay, reader: jspb.BinaryReader): ClientMessageGdReplay;
}

export namespace ClientMessageGdReplay {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    matchNum: number,
    uniqueId: string,
  }
}

export class ServerMessageGdReplay extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdReplay.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdReplay): ServerMessageGdReplay.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdReplay, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdReplay;
  static deserializeBinaryFromReader(message: ServerMessageGdReplay, reader: jspb.BinaryReader): ServerMessageGdReplay;
}

export namespace ServerMessageGdReplay {
  export type AsObject = {
    status: number,
    data: Uint8Array | string,
  }
}

