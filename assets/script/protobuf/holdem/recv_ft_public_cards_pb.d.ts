// package: holdem.pb
// file: protobuf/holdem/recv_ft_public_cards.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";
import * as protobuf_holdem_define_ft_pb from "../../protobuf/holdem/define_ft_pb";

export class ServerMessageFtPublicCards extends jspb.Message {
  clearPublicCardsGroupList(): void;
  getPublicCardsGroupList(): Array<protobuf_holdem_define_ft_pb.CardsGroup>;
  setPublicCardsGroupList(value: Array<protobuf_holdem_define_ft_pb.CardsGroup>): void;
  addPublicCardsGroup(value?: protobuf_holdem_define_ft_pb.CardsGroup, index?: number): protobuf_holdem_define_ft_pb.CardsGroup;

  getRnd(): protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap];
  setRnd(value: protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap]): void;

  clearOperatorsList(): void;
  getOperatorsList(): Array<protobuf_holdem_define_ft_pb.OperatorFT>;
  setOperatorsList(value: Array<protobuf_holdem_define_ft_pb.OperatorFT>): void;
  addOperators(value?: protobuf_holdem_define_ft_pb.OperatorFT, index?: number): protobuf_holdem_define_ft_pb.OperatorFT;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtPublicCards.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtPublicCards): ServerMessageFtPublicCards.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtPublicCards, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtPublicCards;
  static deserializeBinaryFromReader(message: ServerMessageFtPublicCards, reader: jspb.BinaryReader): ServerMessageFtPublicCards;
}

export namespace ServerMessageFtPublicCards {
  export type AsObject = {
    publicCardsGroupList: Array<protobuf_holdem_define_ft_pb.CardsGroup.AsObject>,
    rnd: protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap],
    operatorsList: Array<protobuf_holdem_define_ft_pb.OperatorFT.AsObject>,
  }
}

