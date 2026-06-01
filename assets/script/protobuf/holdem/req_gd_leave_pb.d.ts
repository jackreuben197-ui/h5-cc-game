// package: holdem.pb
// file: protobuf/holdem/req_gd_leave.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageGdLeave extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageGdLeave.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageGdLeave): ClientMessageGdLeave.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageGdLeave, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageGdLeave;
  static deserializeBinaryFromReader(message: ClientMessageGdLeave, reader: jspb.BinaryReader): ClientMessageGdLeave;
}

export namespace ClientMessageGdLeave {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
  }
}

export class ServerMessageGdLeave extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdLeave.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdLeave): ServerMessageGdLeave.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdLeave, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdLeave;
  static deserializeBinaryFromReader(message: ServerMessageGdLeave, reader: jspb.BinaryReader): ServerMessageGdLeave;
}

export namespace ServerMessageGdLeave {
  export type AsObject = {
    status: number,
  }
}

