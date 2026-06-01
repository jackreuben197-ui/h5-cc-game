// package: holdem.pb
// file: protobuf/holdem/recv_ft_seated_others.proto

import * as jspb from "google-protobuf";

export class ServerMessageFtSeatedOthers extends jspb.Message {
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

  getVip(): number;
  setVip(value: number): void;

  getKeepSeatLeftTime(): number;
  setKeepSeatLeftTime(value: number): void;

  getKeepSeatDeadline(): number;
  setKeepSeatDeadline(value: number): void;

  getUserSubscriptionId(): number;
  setUserSubscriptionId(value: number): void;

  getIpAddr(): string;
  setIpAddr(value: string): void;

  getVideoMaskId(): number;
  setVideoMaskId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtSeatedOthers.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtSeatedOthers): ServerMessageFtSeatedOthers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtSeatedOthers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtSeatedOthers;
  static deserializeBinaryFromReader(message: ServerMessageFtSeatedOthers, reader: jspb.BinaryReader): ServerMessageFtSeatedOthers;
}

export namespace ServerMessageFtSeatedOthers {
  export type AsObject = {
    seatId: number,
    sex: number,
    avatar: string,
    name: string,
    userRid: number,
    chips: number,
    vip: number,
    keepSeatLeftTime: number,
    keepSeatDeadline: number,
    userSubscriptionId: number,
    ipAddr: string,
    videoMaskId: number,
  }
}

