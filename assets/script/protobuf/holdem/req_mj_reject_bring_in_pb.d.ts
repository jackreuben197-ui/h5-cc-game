// package: holdem.pb
// file: protobuf/holdem/req_mj_reject_bring_in.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageMjRejectBringIn extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageMjRejectBringIn.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageMjRejectBringIn): ClientMessageMjRejectBringIn.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageMjRejectBringIn, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageMjRejectBringIn;
  static deserializeBinaryFromReader(message: ClientMessageMjRejectBringIn, reader: jspb.BinaryReader): ClientMessageMjRejectBringIn;
}

export namespace ClientMessageMjRejectBringIn {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
  }
}

export class ServerMessageMjRejectBringIn extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjRejectBringIn.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjRejectBringIn): ServerMessageMjRejectBringIn.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjRejectBringIn, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjRejectBringIn;
  static deserializeBinaryFromReader(message: ServerMessageMjRejectBringIn, reader: jspb.BinaryReader): ServerMessageMjRejectBringIn;
}

export namespace ServerMessageMjRejectBringIn {
  export type AsObject = {
    status: number,
  }
}

