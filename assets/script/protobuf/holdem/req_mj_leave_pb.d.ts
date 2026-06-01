// package: holdem.pb
// file: protobuf/holdem/req_mj_leave.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageMjLeave extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageMjLeave.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageMjLeave): ClientMessageMjLeave.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageMjLeave, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageMjLeave;
  static deserializeBinaryFromReader(message: ClientMessageMjLeave, reader: jspb.BinaryReader): ClientMessageMjLeave;
}

export namespace ClientMessageMjLeave {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
  }
}

export class ServerMessageMjLeave extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjLeave.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjLeave): ServerMessageMjLeave.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjLeave, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjLeave;
  static deserializeBinaryFromReader(message: ServerMessageMjLeave, reader: jspb.BinaryReader): ServerMessageMjLeave;
}

export namespace ServerMessageMjLeave {
  export type AsObject = {
    status: number,
  }
}

