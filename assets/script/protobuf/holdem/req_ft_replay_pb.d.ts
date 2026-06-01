// package: holdem.pb
// file: protobuf/holdem/req_ft_replay.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageFtPublicReplay extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getHandNum(): number;
  setHandNum(value: number): void;

  getUniqueId(): string;
  setUniqueId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageFtPublicReplay.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageFtPublicReplay): ClientMessageFtPublicReplay.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageFtPublicReplay, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageFtPublicReplay;
  static deserializeBinaryFromReader(message: ClientMessageFtPublicReplay, reader: jspb.BinaryReader): ClientMessageFtPublicReplay;
}

export namespace ClientMessageFtPublicReplay {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    handNum: number,
    uniqueId: string,
  }
}

export class ServerMessageFtPublicReplay extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtPublicReplay.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtPublicReplay): ServerMessageFtPublicReplay.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtPublicReplay, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtPublicReplay;
  static deserializeBinaryFromReader(message: ServerMessageFtPublicReplay, reader: jspb.BinaryReader): ServerMessageFtPublicReplay;
}

export namespace ServerMessageFtPublicReplay {
  export type AsObject = {
    status: number,
    data: Uint8Array | string,
  }
}

