// package: holdem.pb
// file: protobuf/holdem/req_gd_seated.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageGdSeated extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getSeatId(): number;
  setSeatId(value: number): void;

  getReturnOrNew(): number;
  setReturnOrNew(value: number): void;

  getBringIn(): number;
  setBringIn(value: number): void;

  getAutoOnTable(): number;
  setAutoOnTable(value: number): void;

  getAutoUseWallet(): boolean;
  setAutoUseWallet(value: boolean): void;

  getAutoOnTableFix(): number;
  setAutoOnTableFix(value: number): void;

  getClubId(): number;
  setClubId(value: number): void;

  getApplyBringIn(): boolean;
  setApplyBringIn(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageGdSeated.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageGdSeated): ClientMessageGdSeated.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageGdSeated, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageGdSeated;
  static deserializeBinaryFromReader(message: ClientMessageGdSeated, reader: jspb.BinaryReader): ClientMessageGdSeated;
}

export namespace ClientMessageGdSeated {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    seatId: number,
    returnOrNew: number,
    bringIn: number,
    autoOnTable: number,
    autoUseWallet: boolean,
    autoOnTableFix: number,
    clubId: number,
    applyBringIn: boolean,
  }
}

export class ServerMessageGdSeated extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getChips(): number;
  setChips(value: number): void;

  getAccountChips(): number;
  setAccountChips(value: number): void;

  getRecvSeatId(): number;
  setRecvSeatId(value: number): void;

  getKeepSeatLeftTime(): number;
  setKeepSeatLeftTime(value: number): void;

  getKeepSeatDeadline(): number;
  setKeepSeatDeadline(value: number): void;

  getUserSubscriptionId(): number;
  setUserSubscriptionId(value: number): void;

  getVideoMaskId(): number;
  setVideoMaskId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdSeated.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdSeated): ServerMessageGdSeated.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdSeated, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdSeated;
  static deserializeBinaryFromReader(message: ServerMessageGdSeated, reader: jspb.BinaryReader): ServerMessageGdSeated;
}

export namespace ServerMessageGdSeated {
  export type AsObject = {
    status: number,
    chips: number,
    accountChips: number,
    recvSeatId: number,
    keepSeatLeftTime: number,
    keepSeatDeadline: number,
    userSubscriptionId: number,
    videoMaskId: number,
  }
}

