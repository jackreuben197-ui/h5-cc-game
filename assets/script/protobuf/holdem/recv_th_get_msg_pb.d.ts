// package: holdem.pb
// file: protobuf/holdem/recv_th_get_msg.proto

import * as jspb from "google-protobuf";

export class ServerMessageGetMsg extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): void;

  getExtra(): Uint8Array | string;
  getExtra_asU8(): Uint8Array;
  getExtra_asB64(): string;
  setExtra(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGetMsg.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGetMsg): ServerMessageGetMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGetMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGetMsg;
  static deserializeBinaryFromReader(message: ServerMessageGetMsg, reader: jspb.BinaryReader): ServerMessageGetMsg;
}

export namespace ServerMessageGetMsg {
  export type AsObject = {
    message: string,
    extra: Uint8Array | string,
  }
}

