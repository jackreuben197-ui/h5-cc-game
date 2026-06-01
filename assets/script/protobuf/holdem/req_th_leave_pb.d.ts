// package: holdem.pb
// file: protobuf/holdem/req_th_leave.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageLeave extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageLeave.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageLeave): ClientMessageLeave.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageLeave, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageLeave;
  static deserializeBinaryFromReader(message: ClientMessageLeave, reader: jspb.BinaryReader): ClientMessageLeave;
}

export namespace ClientMessageLeave {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
  }
}

export class ServerMessageLeave extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageLeave.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageLeave): ServerMessageLeave.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageLeave, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageLeave;
  static deserializeBinaryFromReader(message: ServerMessageLeave, reader: jspb.BinaryReader): ServerMessageLeave;
}

export namespace ServerMessageLeave {
  export type AsObject = {
    status: number,
  }
}

