// package: holdem.pb
// file: protobuf/holdem/recv_ft_winner.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";
import * as protobuf_holdem_define_ft_pb from "../../protobuf/holdem/define_ft_pb";

export class ServerMessageFtWinner extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<protobuf_holdem_define_ft_pb.ResultFT>;
  setResultsList(value: Array<protobuf_holdem_define_ft_pb.ResultFT>): void;
  addResults(value?: protobuf_holdem_define_ft_pb.ResultFT, index?: number): protobuf_holdem_define_ft_pb.ResultFT;

  getHandNum(): number;
  setHandNum(value: number): void;

  getRound(): protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap];
  setRound(value: protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap]): void;

  clearTurnPublicCardsGroupList(): void;
  getTurnPublicCardsGroupList(): Array<protobuf_holdem_define_ft_pb.CardsGroup>;
  setTurnPublicCardsGroupList(value: Array<protobuf_holdem_define_ft_pb.CardsGroup>): void;
  addTurnPublicCardsGroup(value?: protobuf_holdem_define_ft_pb.CardsGroup, index?: number): protobuf_holdem_define_ft_pb.CardsGroup;

  clearRiverPublicCardsGroupList(): void;
  getRiverPublicCardsGroupList(): Array<protobuf_holdem_define_ft_pb.CardsGroup>;
  setRiverPublicCardsGroupList(value: Array<protobuf_holdem_define_ft_pb.CardsGroup>): void;
  addRiverPublicCardsGroup(value?: protobuf_holdem_define_ft_pb.CardsGroup, index?: number): protobuf_holdem_define_ft_pb.CardsGroup;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtWinner.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtWinner): ServerMessageFtWinner.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtWinner, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtWinner;
  static deserializeBinaryFromReader(message: ServerMessageFtWinner, reader: jspb.BinaryReader): ServerMessageFtWinner;
}

export namespace ServerMessageFtWinner {
  export type AsObject = {
    resultsList: Array<protobuf_holdem_define_ft_pb.ResultFT.AsObject>,
    handNum: number,
    round: protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap],
    turnPublicCardsGroupList: Array<protobuf_holdem_define_ft_pb.CardsGroup.AsObject>,
    riverPublicCardsGroupList: Array<protobuf_holdem_define_ft_pb.CardsGroup.AsObject>,
  }
}

