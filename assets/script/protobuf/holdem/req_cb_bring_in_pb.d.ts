// package: holdem.pb
// file: protobuf/holdem/req_cb_bring_in.proto

import * as jspb from "google-protobuf";

export class ClientMessageCbBringIn extends jspb.Message {
  getRoomId(): number;
  setRoomId(value: number): void;

  getBringIn(): number;
  setBringIn(value: number): void;

  getClubId(): number;
  setClubId(value: number): void;

  getReturnOrNew(): number;
  setReturnOrNew(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageCbBringIn.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageCbBringIn): ClientMessageCbBringIn.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageCbBringIn, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageCbBringIn;
  static deserializeBinaryFromReader(message: ClientMessageCbBringIn, reader: jspb.BinaryReader): ClientMessageCbBringIn;
}

export namespace ClientMessageCbBringIn {
  export type AsObject = {
    roomId: number,
    bringIn: number,
    clubId: number,
    returnOrNew: number,
  }
}

export class ServerMessageCbBringIn extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getBringIn(): number;
  setBringIn(value: number): void;

  getCurrent(): number;
  setCurrent(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageCbBringIn.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageCbBringIn): ServerMessageCbBringIn.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageCbBringIn, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageCbBringIn;
  static deserializeBinaryFromReader(message: ServerMessageCbBringIn, reader: jspb.BinaryReader): ServerMessageCbBringIn;
}

export namespace ServerMessageCbBringIn {
  export type AsObject = {
    status: number,
    bringIn: number,
    current: number,
  }
}

