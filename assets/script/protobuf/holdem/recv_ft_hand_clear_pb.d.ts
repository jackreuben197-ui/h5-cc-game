// package: holdem.pb
// file: protobuf/holdem/recv_ft_hand_clear.proto

import * as jspb from "google-protobuf";

export class ServerMessageFtHandClear extends jspb.Message {
  getHandNum(): number;
  setHandNum(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtHandClear.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtHandClear): ServerMessageFtHandClear.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtHandClear, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtHandClear;
  static deserializeBinaryFromReader(message: ServerMessageFtHandClear, reader: jspb.BinaryReader): ServerMessageFtHandClear;
}

export namespace ServerMessageFtHandClear {
  export type AsObject = {
    handNum: number,
  }
}

