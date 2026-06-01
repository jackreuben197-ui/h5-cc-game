// package: holdem.pb
// file: protobuf/holdem/recv_cb_game_start.proto

import * as jspb from "google-protobuf";

export class ServerMessageCbGameStart extends jspb.Message {
  getGameNum(): number;
  setGameNum(value: number): void;

  getFirstCard(): number;
  setFirstCard(value: number): void;

  getOnline(): number;
  setOnline(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageCbGameStart.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageCbGameStart): ServerMessageCbGameStart.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageCbGameStart, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageCbGameStart;
  static deserializeBinaryFromReader(message: ServerMessageCbGameStart, reader: jspb.BinaryReader): ServerMessageCbGameStart;
}

export namespace ServerMessageCbGameStart {
  export type AsObject = {
    gameNum: number,
    firstCard: number,
    online: number,
  }
}

