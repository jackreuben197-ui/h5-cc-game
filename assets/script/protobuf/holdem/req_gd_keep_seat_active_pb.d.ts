// package: holdem.pb
// file: protobuf/holdem/req_gd_keep_seat_active.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageGdKeepSeatActive extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getKeep(): boolean;
  setKeep(value: boolean): void;

  getDuration(): number;
  setDuration(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageGdKeepSeatActive.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageGdKeepSeatActive): ClientMessageGdKeepSeatActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageGdKeepSeatActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageGdKeepSeatActive;
  static deserializeBinaryFromReader(message: ClientMessageGdKeepSeatActive, reader: jspb.BinaryReader): ClientMessageGdKeepSeatActive;
}

export namespace ClientMessageGdKeepSeatActive {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    keep: boolean,
    duration: number,
  }
}

export class ServerMessageGdKeepSeatActive extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getTimes(): number;
  setTimes(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdKeepSeatActive.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdKeepSeatActive): ServerMessageGdKeepSeatActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdKeepSeatActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdKeepSeatActive;
  static deserializeBinaryFromReader(message: ServerMessageGdKeepSeatActive, reader: jspb.BinaryReader): ServerMessageGdKeepSeatActive;
}

export namespace ServerMessageGdKeepSeatActive {
  export type AsObject = {
    status: number,
    times: number,
  }
}

