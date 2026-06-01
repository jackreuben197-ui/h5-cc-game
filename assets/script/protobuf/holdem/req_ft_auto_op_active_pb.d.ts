// package: holdem.pb
// file: protobuf/holdem/req_ft_auto_op_active.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageFtAutoOpActive extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getEnable(): boolean;
  setEnable(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageFtAutoOpActive.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageFtAutoOpActive): ClientMessageFtAutoOpActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageFtAutoOpActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageFtAutoOpActive;
  static deserializeBinaryFromReader(message: ClientMessageFtAutoOpActive, reader: jspb.BinaryReader): ClientMessageFtAutoOpActive;
}

export namespace ClientMessageFtAutoOpActive {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    enable: boolean,
  }
}

export class ServerMessageFtAutoOpActive extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtAutoOpActive.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtAutoOpActive): ServerMessageFtAutoOpActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtAutoOpActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtAutoOpActive;
  static deserializeBinaryFromReader(message: ServerMessageFtAutoOpActive, reader: jspb.BinaryReader): ServerMessageFtAutoOpActive;
}

export namespace ServerMessageFtAutoOpActive {
  export type AsObject = {
    status: number,
  }
}

