// package: holdem.pb
// file: protobuf/holdem/recv_th_public_cards.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessagePublicCards extends jspb.Message {
  clearPublicCardsArrayList(): void;
  getPublicCardsArrayList(): Array<number>;
  setPublicCardsArrayList(value: Array<number>): void;
  addPublicCardsArray(value: number, index?: number): number;

  hasNextOperator(): boolean;
  clearNextOperator(): void;
  getNextOperator(): protobuf_holdem_define_pb.Operator | undefined;
  setNextOperator(value?: protobuf_holdem_define_pb.Operator): void;

  clearExtPublicCardsArrayList(): void;
  getExtPublicCardsArrayList(): Array<number>;
  setExtPublicCardsArrayList(value: Array<number>): void;
  addExtPublicCardsArray(value: number, index?: number): number;

  getRnd(): protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap];
  setRnd(value: protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap]): void;

  clearAllinUsersList(): void;
  getAllinUsersList(): Array<protobuf_holdem_define_pb.PlayerAllInShowCardWinCardsLength>;
  setAllinUsersList(value: Array<protobuf_holdem_define_pb.PlayerAllInShowCardWinCardsLength>): void;
  addAllinUsers(value?: protobuf_holdem_define_pb.PlayerAllInShowCardWinCardsLength, index?: number): protobuf_holdem_define_pb.PlayerAllInShowCardWinCardsLength;

  clearExtPublicCardsAllinSummaryList(): void;
  getExtPublicCardsAllinSummaryList(): Array<protobuf_holdem_define_pb.SecondPublicCardsPlayerAllInShowCardSummary>;
  setExtPublicCardsAllinSummaryList(value: Array<protobuf_holdem_define_pb.SecondPublicCardsPlayerAllInShowCardSummary>): void;
  addExtPublicCardsAllinSummary(value?: protobuf_holdem_define_pb.SecondPublicCardsPlayerAllInShowCardSummary, index?: number): protobuf_holdem_define_pb.SecondPublicCardsPlayerAllInShowCardSummary;

  clearPublicCardsArray2List(): void;
  getPublicCardsArray2List(): Array<number>;
  setPublicCardsArray2List(value: Array<number>): void;
  addPublicCardsArray2(value: number, index?: number): number;

  clearAllinUsers2List(): void;
  getAllinUsers2List(): Array<protobuf_holdem_define_pb.PlayerAllInShowCardWinCardsLength>;
  setAllinUsers2List(value: Array<protobuf_holdem_define_pb.PlayerAllInShowCardWinCardsLength>): void;
  addAllinUsers2(value?: protobuf_holdem_define_pb.PlayerAllInShowCardWinCardsLength, index?: number): protobuf_holdem_define_pb.PlayerAllInShowCardWinCardsLength;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessagePublicCards.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessagePublicCards): ServerMessagePublicCards.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessagePublicCards, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessagePublicCards;
  static deserializeBinaryFromReader(message: ServerMessagePublicCards, reader: jspb.BinaryReader): ServerMessagePublicCards;
}

export namespace ServerMessagePublicCards {
  export type AsObject = {
    publicCardsArrayList: Array<number>,
    nextOperator?: protobuf_holdem_define_pb.Operator.AsObject,
    extPublicCardsArrayList: Array<number>,
    rnd: protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap],
    allinUsersList: Array<protobuf_holdem_define_pb.PlayerAllInShowCardWinCardsLength.AsObject>,
    extPublicCardsAllinSummaryList: Array<protobuf_holdem_define_pb.SecondPublicCardsPlayerAllInShowCardSummary.AsObject>,
    publicCardsArray2List: Array<number>,
    allinUsers2List: Array<protobuf_holdem_define_pb.PlayerAllInShowCardWinCardsLength.AsObject>,
  }
}

