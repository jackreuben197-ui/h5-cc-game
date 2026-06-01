// package: holdem.pb
// file: protobuf/holdem/recv_gd_hand_clear.proto

import * as jspb from "google-protobuf";

export class ServerMessageGdHandClear extends jspb.Message {
  getMatchNum(): number;
  setMatchNum(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdHandClear.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdHandClear): ServerMessageGdHandClear.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdHandClear, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdHandClear;
  static deserializeBinaryFromReader(message: ServerMessageGdHandClear, reader: jspb.BinaryReader): ServerMessageGdHandClear;
}

export namespace ServerMessageGdHandClear {
  export type AsObject = {
    matchNum: number,
  }
}

