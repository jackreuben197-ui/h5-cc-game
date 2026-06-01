// package: holdem.pb
// file: protobuf/holdem/recv_g_get_message.proto

import * as jspb from "google-protobuf";

export class ServerMessageGetMessage extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): void;

  getExtra(): Uint8Array | string;
  getExtra_asU8(): Uint8Array;
  getExtra_asB64(): string;
  setExtra(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGetMessage.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGetMessage): ServerMessageGetMessage.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGetMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGetMessage;
  static deserializeBinaryFromReader(message: ServerMessageGetMessage, reader: jspb.BinaryReader): ServerMessageGetMessage;
}

export namespace ServerMessageGetMessage {
  export type AsObject = {
    message: string,
    extra: Uint8Array | string,
  }
}

