// package: holdem.pb
// file: protobuf/holdem/recv_g_user_game_watch.proto

import * as jspb from "google-protobuf";

export class ServerMessageUserGameWatch extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getUserName(): string;
  setUserName(value: string): void;

  getRoomId(): number;
  setRoomId(value: number): void;

  getHandNum(): number;
  setHandNum(value: number): void;

  getAmount(): number;
  setAmount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageUserGameWatch.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageUserGameWatch): ServerMessageUserGameWatch.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageUserGameWatch, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageUserGameWatch;
  static deserializeBinaryFromReader(message: ServerMessageUserGameWatch, reader: jspb.BinaryReader): ServerMessageUserGameWatch;
}

export namespace ServerMessageUserGameWatch {
  export type AsObject = {
    id: number,
    userName: string,
    roomId: number,
    handNum: number,
    amount: number,
  }
}

