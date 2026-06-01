// package: holdem.pb
// file: protobuf/holdem/req_g_register.proto

import * as jspb from "google-protobuf";

export class ClientMessageRegister extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageRegister.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageRegister): ClientMessageRegister.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageRegister, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageRegister;
  static deserializeBinaryFromReader(message: ClientMessageRegister, reader: jspb.BinaryReader): ClientMessageRegister;
}

export namespace ClientMessageRegister {
  export type AsObject = {
  }
}

export class ServerMessageRegister extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getTimestamp(): number;
  setTimestamp(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageRegister.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageRegister): ServerMessageRegister.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageRegister, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageRegister;
  static deserializeBinaryFromReader(message: ServerMessageRegister, reader: jspb.BinaryReader): ServerMessageRegister;
}

export namespace ServerMessageRegister {
  export type AsObject = {
    status: number,
    timestamp: number,
  }
}

