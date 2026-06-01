// package: holdem.pb
// file: protobuf/holdem/req_mj_stand_up_active.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageMjStandupActive extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageMjStandupActive.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageMjStandupActive): ClientMessageMjStandupActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageMjStandupActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageMjStandupActive;
  static deserializeBinaryFromReader(message: ClientMessageMjStandupActive, reader: jspb.BinaryReader): ClientMessageMjStandupActive;
}

export namespace ClientMessageMjStandupActive {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
  }
}

export class ServerMessageMjStandupActive extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getSeatId(): number;
  setSeatId(value: number): void;

  getChips(): number;
  setChips(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjStandupActive.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjStandupActive): ServerMessageMjStandupActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjStandupActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjStandupActive;
  static deserializeBinaryFromReader(message: ServerMessageMjStandupActive, reader: jspb.BinaryReader): ServerMessageMjStandupActive;
}

export namespace ServerMessageMjStandupActive {
  export type AsObject = {
    status: number,
    seatId: number,
    chips: number,
  }
}

