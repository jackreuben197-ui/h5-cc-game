// package: holdem.pb
// file: protobuf/holdem/req_ft_stand_up_active.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageFtStandupActive extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageFtStandupActive.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageFtStandupActive): ClientMessageFtStandupActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageFtStandupActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageFtStandupActive;
  static deserializeBinaryFromReader(message: ClientMessageFtStandupActive, reader: jspb.BinaryReader): ClientMessageFtStandupActive;
}

export namespace ClientMessageFtStandupActive {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
  }
}

export class ServerMessageFtStandupActive extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getSeatId(): number;
  setSeatId(value: number): void;

  getChips(): number;
  setChips(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtStandupActive.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtStandupActive): ServerMessageFtStandupActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtStandupActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtStandupActive;
  static deserializeBinaryFromReader(message: ServerMessageFtStandupActive, reader: jspb.BinaryReader): ServerMessageFtStandupActive;
}

export namespace ServerMessageFtStandupActive {
  export type AsObject = {
    status: number,
    seatId: number,
    chips: number,
  }
}

