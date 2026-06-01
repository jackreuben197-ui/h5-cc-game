// package: holdem.pb
// file: protobuf/holdem/req_ft_pair.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageFtPair extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  clearHandGroupIndexesList(): void;
  getHandGroupIndexesList(): Array<number>;
  setHandGroupIndexesList(value: Array<number>): void;
  addHandGroupIndexes(value: number, index?: number): number;

  getConfirm(): boolean;
  setConfirm(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageFtPair.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageFtPair): ClientMessageFtPair.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageFtPair, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageFtPair;
  static deserializeBinaryFromReader(message: ClientMessageFtPair, reader: jspb.BinaryReader): ClientMessageFtPair;
}

export namespace ClientMessageFtPair {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    handGroupIndexesList: Array<number>,
    confirm: boolean,
  }
}

export class ServerMessageFtPair extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtPair.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtPair): ServerMessageFtPair.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtPair, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtPair;
  static deserializeBinaryFromReader(message: ServerMessageFtPair, reader: jspb.BinaryReader): ServerMessageFtPair;
}

export namespace ServerMessageFtPair {
  export type AsObject = {
    status: number,
  }
}

