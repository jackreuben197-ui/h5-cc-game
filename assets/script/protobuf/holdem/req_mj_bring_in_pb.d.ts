// package: holdem.pb
// file: protobuf/holdem/req_mj_bring_in.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageMjBringIn extends jspb.Message {
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
  toObject(includeInstance?: boolean): ClientMessageMjBringIn.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageMjBringIn): ClientMessageMjBringIn.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageMjBringIn, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageMjBringIn;
  static deserializeBinaryFromReader(message: ClientMessageMjBringIn, reader: jspb.BinaryReader): ClientMessageMjBringIn;
}

export namespace ClientMessageMjBringIn {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    bringIn: number,
    useWallet: boolean,
    applyBringIn: boolean,
  }
}

export class ServerMessageMjBringIn extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getChips(): number;
  setChips(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjBringIn.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjBringIn): ServerMessageMjBringIn.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjBringIn, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjBringIn;
  static deserializeBinaryFromReader(message: ServerMessageMjBringIn, reader: jspb.BinaryReader): ServerMessageMjBringIn;
}

export namespace ServerMessageMjBringIn {
  export type AsObject = {
    status: number,
    chips: number,
  }
}

