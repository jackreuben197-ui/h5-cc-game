// package: holdem.pb
// file: protobuf/holdem/req_th_replay.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessagePublicReplay extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getHandNum(): number;
  setHandNum(value: number): void;

  getUniqueId(): string;
  setUniqueId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessagePublicReplay.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessagePublicReplay): ClientMessagePublicReplay.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessagePublicReplay, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessagePublicReplay;
  static deserializeBinaryFromReader(message: ClientMessagePublicReplay, reader: jspb.BinaryReader): ClientMessagePublicReplay;
}

export namespace ClientMessagePublicReplay {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    handNum: number,
    uniqueId: string,
  }
}

export class ServerMessagePublicReplay extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessagePublicReplay.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessagePublicReplay): ServerMessagePublicReplay.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessagePublicReplay, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessagePublicReplay;
  static deserializeBinaryFromReader(message: ServerMessagePublicReplay, reader: jspb.BinaryReader): ServerMessagePublicReplay;
}

export namespace ServerMessagePublicReplay {
  export type AsObject = {
    status: number,
    data: Uint8Array | string,
  }
}

