// package: holdem.pb
// file: protobuf/holdem/recv_g_user_is_blocked.proto

import * as jspb from "google-protobuf";

export class ServerMessageUserIsBlocked extends jspb.Message {
  getCode(): number;
  setCode(value: number): void;

  getData(): string;
  setData(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageUserIsBlocked.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageUserIsBlocked): ServerMessageUserIsBlocked.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageUserIsBlocked, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageUserIsBlocked;
  static deserializeBinaryFromReader(message: ServerMessageUserIsBlocked, reader: jspb.BinaryReader): ServerMessageUserIsBlocked;
}

export namespace ServerMessageUserIsBlocked {
  export type AsObject = {
    code: number,
    data: string,
  }
}

