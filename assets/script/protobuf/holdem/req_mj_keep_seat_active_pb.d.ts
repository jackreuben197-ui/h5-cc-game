// package: holdem.pb
// file: protobuf/holdem/req_mj_keep_seat_active.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageMjKeepSeatActive extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getKeep(): boolean;
  setKeep(value: boolean): void;

  getDuration(): number;
  setDuration(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageMjKeepSeatActive.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageMjKeepSeatActive): ClientMessageMjKeepSeatActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageMjKeepSeatActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageMjKeepSeatActive;
  static deserializeBinaryFromReader(message: ClientMessageMjKeepSeatActive, reader: jspb.BinaryReader): ClientMessageMjKeepSeatActive;
}

export namespace ClientMessageMjKeepSeatActive {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    keep: boolean,
    duration: number,
  }
}

export class ServerMessageMjKeepSeatActive extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getTimes(): number;
  setTimes(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjKeepSeatActive.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjKeepSeatActive): ServerMessageMjKeepSeatActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjKeepSeatActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjKeepSeatActive;
  static deserializeBinaryFromReader(message: ServerMessageMjKeepSeatActive, reader: jspb.BinaryReader): ServerMessageMjKeepSeatActive;
}

export namespace ServerMessageMjKeepSeatActive {
  export type AsObject = {
    status: number,
    times: number,
  }
}

