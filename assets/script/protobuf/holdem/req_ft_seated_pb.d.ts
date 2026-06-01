// package: holdem.pb
// file: protobuf/holdem/req_ft_seated.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageFtSeated extends jspb.Message {
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
  toObject(includeInstance?: boolean): ClientMessageFtSeated.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageFtSeated): ClientMessageFtSeated.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageFtSeated, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageFtSeated;
  static deserializeBinaryFromReader(message: ClientMessageFtSeated, reader: jspb.BinaryReader): ClientMessageFtSeated;
}

export namespace ClientMessageFtSeated {
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

export class ServerMessageFtSeated extends jspb.Message {
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

  getTotalBringin(): number;
  setTotalBringin(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtSeated.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtSeated): ServerMessageFtSeated.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtSeated, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtSeated;
  static deserializeBinaryFromReader(message: ServerMessageFtSeated, reader: jspb.BinaryReader): ServerMessageFtSeated;
}

export namespace ServerMessageFtSeated {
  export type AsObject = {
    status: number,
    chips: number,
    accountChips: number,
    recvSeatId: number,
    keepSeatLeftTime: number,
    keepSeatDeadline: number,
    userSubscriptionId: number,
    videoMaskId: number,
    totalBringin: number,
  }
}

