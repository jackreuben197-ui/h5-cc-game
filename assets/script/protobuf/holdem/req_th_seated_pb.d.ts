// package: holdem.pb
// file: protobuf/holdem/req_th_seated.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageSeated extends jspb.Message {
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

  getStore(): number;
  setStore(value: number): void;

  getClubId(): number;
  setClubId(value: number): void;

  getApplyBringIn(): boolean;
  setApplyBringIn(value: boolean): void;

  getAutoOnTableNoStore(): boolean;
  setAutoOnTableNoStore(value: boolean): void;

  getAutoOnTableFix(): number;
  setAutoOnTableFix(value: number): void;

  getDepositAdvance(): number;
  setDepositAdvance(value: number): void;

  getAutoOnTableMax(): number;
  setAutoOnTableMax(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageSeated.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageSeated): ClientMessageSeated.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageSeated, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageSeated;
  static deserializeBinaryFromReader(message: ClientMessageSeated, reader: jspb.BinaryReader): ClientMessageSeated;
}

export namespace ClientMessageSeated {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    seatId: number,
    returnOrNew: number,
    bringIn: number,
    autoOnTable: number,
    autoUseWallet: boolean,
    store: number,
    clubId: number,
    applyBringIn: boolean,
    autoOnTableNoStore: boolean,
    autoOnTableFix: number,
    depositAdvance: number,
    autoOnTableMax: number,
  }
}

export class ServerMessageSeated extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getChips(): number;
  setChips(value: number): void;

  getAccountChips(): number;
  setAccountChips(value: number): void;

  getRecvSeatId(): number;
  setRecvSeatId(value: number): void;

  getPostStatus(): protobuf_holdem_define_pb.Def.CanPlayStatusMap[keyof protobuf_holdem_define_pb.Def.CanPlayStatusMap];
  setPostStatus(value: protobuf_holdem_define_pb.Def.CanPlayStatusMap[keyof protobuf_holdem_define_pb.Def.CanPlayStatusMap]): void;

  getStoreChips(): number;
  setStoreChips(value: number): void;

  getDeposit(): number;
  setDeposit(value: number): void;

  getSquidIn(): boolean;
  setSquidIn(value: boolean): void;

  getKeepSeatLeftTime(): number;
  setKeepSeatLeftTime(value: number): void;

  getKeepSeatDeadline(): number;
  setKeepSeatDeadline(value: number): void;

  getUserSubscriptionId(): number;
  setUserSubscriptionId(value: number): void;

  getSquidTotalLimit(): number;
  setSquidTotalLimit(value: number): void;

  getAlreadySeated(): boolean;
  setAlreadySeated(value: boolean): void;

  getSquidRoundSeated(): boolean;
  setSquidRoundSeated(value: boolean): void;

  getVideoMaskId(): number;
  setVideoMaskId(value: number): void;

  getTotalBringin(): number;
  setTotalBringin(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageSeated.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageSeated): ServerMessageSeated.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageSeated, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageSeated;
  static deserializeBinaryFromReader(message: ServerMessageSeated, reader: jspb.BinaryReader): ServerMessageSeated;
}

export namespace ServerMessageSeated {
  export type AsObject = {
    status: number,
    chips: number,
    accountChips: number,
    recvSeatId: number,
    postStatus: protobuf_holdem_define_pb.Def.CanPlayStatusMap[keyof protobuf_holdem_define_pb.Def.CanPlayStatusMap],
    storeChips: number,
    deposit: number,
    squidIn: boolean,
    keepSeatLeftTime: number,
    keepSeatDeadline: number,
    userSubscriptionId: number,
    squidTotalLimit: number,
    alreadySeated: boolean,
    squidRoundSeated: boolean,
    videoMaskId: number,
    totalBringin: number,
  }
}

