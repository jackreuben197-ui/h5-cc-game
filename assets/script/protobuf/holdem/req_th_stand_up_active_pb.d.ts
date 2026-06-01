// package: holdem.pb
// file: protobuf/holdem/req_th_stand_up_active.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageStandupActive extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getCancelStandup(): boolean;
  setCancelStandup(value: boolean): void;

  getManualChangeRoom(): boolean;
  setManualChangeRoom(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageStandupActive.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageStandupActive): ClientMessageStandupActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageStandupActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageStandupActive;
  static deserializeBinaryFromReader(message: ClientMessageStandupActive, reader: jspb.BinaryReader): ClientMessageStandupActive;
}

export namespace ClientMessageStandupActive {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    cancelStandup: boolean,
    manualChangeRoom: boolean,
  }
}

export class ServerMessageStandupActive extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getSeatId(): number;
  setSeatId(value: number): void;

  getChips(): number;
  setChips(value: number): void;

  getWillStandup(): boolean;
  setWillStandup(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageStandupActive.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageStandupActive): ServerMessageStandupActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageStandupActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageStandupActive;
  static deserializeBinaryFromReader(message: ServerMessageStandupActive, reader: jspb.BinaryReader): ServerMessageStandupActive;
}

export namespace ServerMessageStandupActive {
  export type AsObject = {
    status: number,
    seatId: number,
    chips: number,
    willStandup: boolean,
  }
}

