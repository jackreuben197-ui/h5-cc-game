// package: holdem.pb
// file: protobuf/holdem/req_ft_keep_seat_active.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageFtKeepSeatActive extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getKeep(): boolean;
  setKeep(value: boolean): void;

  getDuration(): number;
  setDuration(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageFtKeepSeatActive.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageFtKeepSeatActive): ClientMessageFtKeepSeatActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageFtKeepSeatActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageFtKeepSeatActive;
  static deserializeBinaryFromReader(message: ClientMessageFtKeepSeatActive, reader: jspb.BinaryReader): ClientMessageFtKeepSeatActive;
}

export namespace ClientMessageFtKeepSeatActive {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    keep: boolean,
    duration: number,
  }
}

export class ServerMessageFtKeepSeatActive extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getTimes(): number;
  setTimes(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtKeepSeatActive.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtKeepSeatActive): ServerMessageFtKeepSeatActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtKeepSeatActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtKeepSeatActive;
  static deserializeBinaryFromReader(message: ServerMessageFtKeepSeatActive, reader: jspb.BinaryReader): ServerMessageFtKeepSeatActive;
}

export namespace ServerMessageFtKeepSeatActive {
  export type AsObject = {
    status: number,
    times: number,
  }
}

