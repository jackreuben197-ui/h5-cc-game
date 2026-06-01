// package: holdem.pb
// file: protobuf/holdem/req_gd_stand_up_active.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageGdStandupActive extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageGdStandupActive.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageGdStandupActive): ClientMessageGdStandupActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageGdStandupActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageGdStandupActive;
  static deserializeBinaryFromReader(message: ClientMessageGdStandupActive, reader: jspb.BinaryReader): ClientMessageGdStandupActive;
}

export namespace ClientMessageGdStandupActive {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
  }
}

export class ServerMessageGdStandupActive extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getSeatId(): number;
  setSeatId(value: number): void;

  getChips(): number;
  setChips(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdStandupActive.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdStandupActive): ServerMessageGdStandupActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdStandupActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdStandupActive;
  static deserializeBinaryFromReader(message: ServerMessageGdStandupActive, reader: jspb.BinaryReader): ServerMessageGdStandupActive;
}

export namespace ServerMessageGdStandupActive {
  export type AsObject = {
    status: number,
    seatId: number,
    chips: number,
  }
}

