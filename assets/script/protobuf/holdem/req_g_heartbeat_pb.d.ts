// package: holdem.pb
// file: protobuf/holdem/req_g_heartbeat.proto

import * as jspb from "google-protobuf";

export class ClientMessageHeartbeat extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageHeartbeat.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageHeartbeat): ClientMessageHeartbeat.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageHeartbeat, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageHeartbeat;
  static deserializeBinaryFromReader(message: ClientMessageHeartbeat, reader: jspb.BinaryReader): ClientMessageHeartbeat;
}

export namespace ClientMessageHeartbeat {
  export type AsObject = {
  }
}

export class ServerMessageHeartbeat extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getTimestamp(): number;
  setTimestamp(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageHeartbeat.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageHeartbeat): ServerMessageHeartbeat.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageHeartbeat, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageHeartbeat;
  static deserializeBinaryFromReader(message: ServerMessageHeartbeat, reader: jspb.BinaryReader): ServerMessageHeartbeat;
}

export namespace ServerMessageHeartbeat {
  export type AsObject = {
    status: number,
    timestamp: number,
  }
}

