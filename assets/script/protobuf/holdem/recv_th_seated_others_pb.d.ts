// package: holdem.pb
// file: protobuf/holdem/recv_th_seated_others.proto

import * as jspb from "google-protobuf";

export class ServerMessageSeatedOthers extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getSex(): number;
  setSex(value: number): void;

  getAvatar(): string;
  setAvatar(value: string): void;

  getName(): string;
  setName(value: string): void;

  getUserRid(): number;
  setUserRid(value: number): void;

  getChips(): number;
  setChips(value: number): void;

  getStoreChips(): number;
  setStoreChips(value: number): void;

  getHunterKill(): number;
  setHunterKill(value: number): void;

  getHunterKillAward(): number;
  setHunterKillAward(value: number): void;

  getHunterKillAwardOther(): number;
  setHunterKillAwardOther(value: number): void;

  getHunterHeadValue(): number;
  setHunterHeadValue(value: number): void;

  getVip(): number;
  setVip(value: number): void;

  getKeepSeatLeftTime(): number;
  setKeepSeatLeftTime(value: number): void;

  getKeepSeatDeadline(): number;
  setKeepSeatDeadline(value: number): void;

  getDeposit(): number;
  setDeposit(value: number): void;

  getSquidIn(): boolean;
  setSquidIn(value: boolean): void;

  getUserSubscriptionId(): number;
  setUserSubscriptionId(value: number): void;

  getIpAddr(): string;
  setIpAddr(value: string): void;

  getVideoMaskId(): number;
  setVideoMaskId(value: number): void;

  getTotalBringin(): number;
  setTotalBringin(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageSeatedOthers.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageSeatedOthers): ServerMessageSeatedOthers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageSeatedOthers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageSeatedOthers;
  static deserializeBinaryFromReader(message: ServerMessageSeatedOthers, reader: jspb.BinaryReader): ServerMessageSeatedOthers;
}

export namespace ServerMessageSeatedOthers {
  export type AsObject = {
    seatId: number,
    sex: number,
    avatar: string,
    name: string,
    userRid: number,
    chips: number,
    storeChips: number,
    hunterKill: number,
    hunterKillAward: number,
    hunterKillAwardOther: number,
    hunterHeadValue: number,
    vip: number,
    keepSeatLeftTime: number,
    keepSeatDeadline: number,
    deposit: number,
    squidIn: boolean,
    userSubscriptionId: number,
    ipAddr: string,
    videoMaskId: number,
    totalBringin: number,
  }
}

