// package: holdem.pb
// file: protobuf/holdem/recv_g_jackpot_marquee.proto

import * as jspb from "google-protobuf";

export class ServerMessageJackpotMarquee extends jspb.Message {
  getRoomId(): number;
  setRoomId(value: number): void;

  getHandNum(): number;
  setHandNum(value: number): void;

  getUserRid(): number;
  setUserRid(value: number): void;

  getNickname(): string;
  setNickname(value: string): void;

  getAvatar(): string;
  setAvatar(value: string): void;

  getAward(): number;
  setAward(value: number): void;

  getCardsType(): number;
  setCardsType(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageJackpotMarquee.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageJackpotMarquee): ServerMessageJackpotMarquee.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageJackpotMarquee, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageJackpotMarquee;
  static deserializeBinaryFromReader(message: ServerMessageJackpotMarquee, reader: jspb.BinaryReader): ServerMessageJackpotMarquee;
}

export namespace ServerMessageJackpotMarquee {
  export type AsObject = {
    roomId: number,
    handNum: number,
    userRid: number,
    nickname: string,
    avatar: string,
    award: number,
    cardsType: number,
  }
}

