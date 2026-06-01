// package: holdem.pb
// file: protobuf/holdem/recv_g_error.proto

import * as jspb from "google-protobuf";

export class ServerMessageError extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getMessage(): string;
  setMessage(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageError.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageError): ServerMessageError.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageError, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageError;
  static deserializeBinaryFromReader(message: ServerMessageError, reader: jspb.BinaryReader): ServerMessageError;
}

export namespace ServerMessageError {
  export type AsObject = {
    status: number,
    message: string,
  }
}

