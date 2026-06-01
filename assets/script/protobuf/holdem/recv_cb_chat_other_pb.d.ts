// package: holdem.pb
// file: protobuf/holdem/recv_cb_chat_other.proto

import * as jspb from "google-protobuf";

export class ServerMessageCbChatOthers extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): void;

  getExtra(): Uint8Array | string;
  getExtra_asU8(): Uint8Array;
  getExtra_asB64(): string;
  setExtra(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageCbChatOthers.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageCbChatOthers): ServerMessageCbChatOthers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageCbChatOthers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageCbChatOthers;
  static deserializeBinaryFromReader(message: ServerMessageCbChatOthers, reader: jspb.BinaryReader): ServerMessageCbChatOthers;
}

export namespace ServerMessageCbChatOthers {
  export type AsObject = {
    message: string,
    extra: Uint8Array | string,
  }
}

