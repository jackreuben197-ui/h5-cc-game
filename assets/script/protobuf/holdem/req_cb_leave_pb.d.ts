// package: holdem.pb
// file: protobuf/holdem/req_cb_leave.proto

import * as jspb from "google-protobuf";

export class ClientMessageCbLeave extends jspb.Message {
  getRoomId(): number;
  setRoomId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageCbLeave.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageCbLeave): ClientMessageCbLeave.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageCbLeave, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageCbLeave;
  static deserializeBinaryFromReader(message: ClientMessageCbLeave, reader: jspb.BinaryReader): ClientMessageCbLeave;
}

export namespace ClientMessageCbLeave {
  export type AsObject = {
    roomId: number,
  }
}

export class ServerMessageCbLeave extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageCbLeave.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageCbLeave): ServerMessageCbLeave.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageCbLeave, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageCbLeave;
  static deserializeBinaryFromReader(message: ServerMessageCbLeave, reader: jspb.BinaryReader): ServerMessageCbLeave;
}

export namespace ServerMessageCbLeave {
  export type AsObject = {
    status: number,
  }
}

