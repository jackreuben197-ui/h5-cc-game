// package: holdem.pb
// file: protobuf/holdem/recv_g_user_device_is_blocked.proto

import * as jspb from "google-protobuf";

export class ServerMessageUserDeviceIsBlocked extends jspb.Message {
  getCode(): number;
  setCode(value: number): void;

  getData(): string;
  setData(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageUserDeviceIsBlocked.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageUserDeviceIsBlocked): ServerMessageUserDeviceIsBlocked.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageUserDeviceIsBlocked, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageUserDeviceIsBlocked;
  static deserializeBinaryFromReader(message: ServerMessageUserDeviceIsBlocked, reader: jspb.BinaryReader): ServerMessageUserDeviceIsBlocked;
}

export namespace ServerMessageUserDeviceIsBlocked {
  export type AsObject = {
    code: number,
    data: string,
  }
}

