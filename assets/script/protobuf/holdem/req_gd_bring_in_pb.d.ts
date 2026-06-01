// package: holdem.pb
// file: protobuf/holdem/req_gd_bring_in.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageGdBringIn extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getBringIn(): number;
  setBringIn(value: number): void;

  getUseWallet(): boolean;
  setUseWallet(value: boolean): void;

  getApplyBringIn(): boolean;
  setApplyBringIn(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageGdBringIn.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageGdBringIn): ClientMessageGdBringIn.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageGdBringIn, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageGdBringIn;
  static deserializeBinaryFromReader(message: ClientMessageGdBringIn, reader: jspb.BinaryReader): ClientMessageGdBringIn;
}

export namespace ClientMessageGdBringIn {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    bringIn: number,
    useWallet: boolean,
    applyBringIn: boolean,
  }
}

export class ServerMessageGdBringIn extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getChips(): number;
  setChips(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdBringIn.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdBringIn): ServerMessageGdBringIn.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdBringIn, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdBringIn;
  static deserializeBinaryFromReader(message: ServerMessageGdBringIn, reader: jspb.BinaryReader): ServerMessageGdBringIn;
}

export namespace ServerMessageGdBringIn {
  export type AsObject = {
    status: number,
    chips: number,
  }
}

