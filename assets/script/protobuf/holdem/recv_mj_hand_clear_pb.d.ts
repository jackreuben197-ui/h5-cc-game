// package: holdem.pb
// file: protobuf/holdem/recv_mj_hand_clear.proto

import * as jspb from "google-protobuf";

export class ServerMessageMjHandClear extends jspb.Message {
  getMatchNum(): number;
  setMatchNum(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjHandClear.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjHandClear): ServerMessageMjHandClear.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjHandClear, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjHandClear;
  static deserializeBinaryFromReader(message: ServerMessageMjHandClear, reader: jspb.BinaryReader): ServerMessageMjHandClear;
}

export namespace ServerMessageMjHandClear {
  export type AsObject = {
    matchNum: number,
  }
}

