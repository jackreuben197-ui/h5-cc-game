// package: holdem.pb
// file: protobuf/holdem/recv_ft_get_msg.proto

import * as jspb from "google-protobuf";

export class ServerMessageFtGetMsg extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): void;

  getExtra(): Uint8Array | string;
  getExtra_asU8(): Uint8Array;
  getExtra_asB64(): string;
  setExtra(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtGetMsg.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtGetMsg): ServerMessageFtGetMsg.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtGetMsg, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtGetMsg;
  static deserializeBinaryFromReader(message: ServerMessageFtGetMsg, reader: jspb.BinaryReader): ServerMessageFtGetMsg;
}

export namespace ServerMessageFtGetMsg {
  export type AsObject = {
    message: string,
    extra: Uint8Array | string,
  }
}

