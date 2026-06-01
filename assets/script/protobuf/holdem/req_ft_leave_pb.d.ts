// package: holdem.pb
// file: protobuf/holdem/req_ft_leave.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageFtLeave extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageFtLeave.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageFtLeave): ClientMessageFtLeave.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageFtLeave, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageFtLeave;
  static deserializeBinaryFromReader(message: ClientMessageFtLeave, reader: jspb.BinaryReader): ClientMessageFtLeave;
}

export namespace ClientMessageFtLeave {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
  }
}

export class ServerMessageFtLeave extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtLeave.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtLeave): ServerMessageFtLeave.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtLeave, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtLeave;
  static deserializeBinaryFromReader(message: ServerMessageFtLeave, reader: jspb.BinaryReader): ServerMessageFtLeave;
}

export namespace ServerMessageFtLeave {
  export type AsObject = {
    status: number,
  }
}

