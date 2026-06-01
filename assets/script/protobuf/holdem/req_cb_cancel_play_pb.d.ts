// package: holdem.pb
// file: protobuf/holdem/req_cb_cancel_play.proto

import * as jspb from "google-protobuf";

export class ClientMessageCbCancelPlay extends jspb.Message {
  getGameNum(): number;
  setGameNum(value: number): void;

  getRoomId(): number;
  setRoomId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageCbCancelPlay.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageCbCancelPlay): ClientMessageCbCancelPlay.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageCbCancelPlay, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageCbCancelPlay;
  static deserializeBinaryFromReader(message: ClientMessageCbCancelPlay, reader: jspb.BinaryReader): ClientMessageCbCancelPlay;
}

export namespace ClientMessageCbCancelPlay {
  export type AsObject = {
    gameNum: number,
    roomId: number,
  }
}

export class ServerMessageCbCancelPlay extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getAmount(): number;
  setAmount(value: number): void;

  getCurrent(): number;
  setCurrent(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageCbCancelPlay.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageCbCancelPlay): ServerMessageCbCancelPlay.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageCbCancelPlay, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageCbCancelPlay;
  static deserializeBinaryFromReader(message: ServerMessageCbCancelPlay, reader: jspb.BinaryReader): ServerMessageCbCancelPlay;
}

export namespace ServerMessageCbCancelPlay {
  export type AsObject = {
    status: number,
    amount: number,
    current: number,
  }
}

