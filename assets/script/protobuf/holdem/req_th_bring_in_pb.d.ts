// package: holdem.pb
// file: protobuf/holdem/req_th_bring_in.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageBringIn extends jspb.Message {
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

  getDepositAdvance(): number;
  setDepositAdvance(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageBringIn.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageBringIn): ClientMessageBringIn.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageBringIn, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageBringIn;
  static deserializeBinaryFromReader(message: ClientMessageBringIn, reader: jspb.BinaryReader): ClientMessageBringIn;
}

export namespace ClientMessageBringIn {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    bringIn: number,
    useWallet: boolean,
    applyBringIn: boolean,
    depositAdvance: number,
  }
}

export class ServerMessageBringIn extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getChips(): number;
  setChips(value: number): void;

  getTotalChips(): number;
  setTotalChips(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageBringIn.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageBringIn): ServerMessageBringIn.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageBringIn, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageBringIn;
  static deserializeBinaryFromReader(message: ServerMessageBringIn, reader: jspb.BinaryReader): ServerMessageBringIn;
}

export namespace ServerMessageBringIn {
  export type AsObject = {
    status: number,
    chips: number,
    totalChips: number,
  }
}

