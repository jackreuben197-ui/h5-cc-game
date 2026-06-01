// package: holdem.pb
// file: protobuf/holdem/req_ft_bring_in.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageFtBringIn extends jspb.Message {
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
  toObject(includeInstance?: boolean): ClientMessageFtBringIn.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageFtBringIn): ClientMessageFtBringIn.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageFtBringIn, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageFtBringIn;
  static deserializeBinaryFromReader(message: ClientMessageFtBringIn, reader: jspb.BinaryReader): ClientMessageFtBringIn;
}

export namespace ClientMessageFtBringIn {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    bringIn: number,
    useWallet: boolean,
    applyBringIn: boolean,
  }
}

export class ServerMessageFtBringIn extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getChips(): number;
  setChips(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtBringIn.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtBringIn): ServerMessageFtBringIn.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtBringIn, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtBringIn;
  static deserializeBinaryFromReader(message: ServerMessageFtBringIn, reader: jspb.BinaryReader): ServerMessageFtBringIn;
}

export namespace ServerMessageFtBringIn {
  export type AsObject = {
    status: number,
    chips: number,
  }
}

