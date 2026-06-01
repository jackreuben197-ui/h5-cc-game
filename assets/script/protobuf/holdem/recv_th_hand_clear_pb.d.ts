// package: holdem.pb
// file: protobuf/holdem/recv_th_hand_clear.proto

import * as jspb from "google-protobuf";

export class ServerMessageHandClear extends jspb.Message {
  getHandNum(): number;
  setHandNum(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageHandClear.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageHandClear): ServerMessageHandClear.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageHandClear, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageHandClear;
  static deserializeBinaryFromReader(message: ServerMessageHandClear, reader: jspb.BinaryReader): ServerMessageHandClear;
}

export namespace ServerMessageHandClear {
  export type AsObject = {
    handNum: number,
  }
}

