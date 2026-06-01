// package: holdem.pb
// file: protobuf/holdem/recv_g_limit_hand.proto

import * as jspb from "google-protobuf";

export class ServerMessageLimitHandNumber extends jspb.Message {
  getHandLeft(): number;
  setHandLeft(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageLimitHandNumber.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageLimitHandNumber): ServerMessageLimitHandNumber.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageLimitHandNumber, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageLimitHandNumber;
  static deserializeBinaryFromReader(message: ServerMessageLimitHandNumber, reader: jspb.BinaryReader): ServerMessageLimitHandNumber;
}

export namespace ServerMessageLimitHandNumber {
  export type AsObject = {
    handLeft: number,
  }
}

