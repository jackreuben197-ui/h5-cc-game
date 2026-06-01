// package: holdem.pb
// file: protobuf/holdem/req_th_keep_seat_active.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageKeepSeatActive extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getKeep(): boolean;
  setKeep(value: boolean): void;

  getDuration(): number;
  setDuration(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageKeepSeatActive.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageKeepSeatActive): ClientMessageKeepSeatActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageKeepSeatActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageKeepSeatActive;
  static deserializeBinaryFromReader(message: ClientMessageKeepSeatActive, reader: jspb.BinaryReader): ClientMessageKeepSeatActive;
}

export namespace ClientMessageKeepSeatActive {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    keep: boolean,
    duration: number,
  }
}

export class ServerMessageKeepSeatActive extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getTimes(): number;
  setTimes(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageKeepSeatActive.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageKeepSeatActive): ServerMessageKeepSeatActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageKeepSeatActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageKeepSeatActive;
  static deserializeBinaryFromReader(message: ServerMessageKeepSeatActive, reader: jspb.BinaryReader): ServerMessageKeepSeatActive;
}

export namespace ServerMessageKeepSeatActive {
  export type AsObject = {
    status: number,
    times: number,
  }
}

