// package: holdem.pb
// file: protobuf/holdem/req_gd_ready_start.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageGdReadyStart extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageGdReadyStart.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageGdReadyStart): ClientMessageGdReadyStart.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageGdReadyStart, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageGdReadyStart;
  static deserializeBinaryFromReader(message: ClientMessageGdReadyStart, reader: jspb.BinaryReader): ClientMessageGdReadyStart;
}

export namespace ClientMessageGdReadyStart {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
  }
}

export class ServerMessageGdReadyStart extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdReadyStart.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdReadyStart): ServerMessageGdReadyStart.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdReadyStart, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdReadyStart;
  static deserializeBinaryFromReader(message: ServerMessageGdReadyStart, reader: jspb.BinaryReader): ServerMessageGdReadyStart;
}

export namespace ServerMessageGdReadyStart {
  export type AsObject = {
    status: number,
  }
}

