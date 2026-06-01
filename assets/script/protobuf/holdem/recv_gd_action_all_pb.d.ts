// package: holdem.pb
// file: protobuf/holdem/recv_gd_action_all.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_gd_pb from "../../protobuf/holdem/define_gd_pb";

export class ServerMessageGdActionAll extends jspb.Message {
  getOperatorSeatId(): number;
  setOperatorSeatId(value: number): void;

  getAct(): protobuf_holdem_define_gd_pb.DefGD.ActionGdMap[keyof protobuf_holdem_define_gd_pb.DefGD.ActionGdMap];
  setAct(value: protobuf_holdem_define_gd_pb.DefGD.ActionGdMap[keyof protobuf_holdem_define_gd_pb.DefGD.ActionGdMap]): void;

  hasDiscardCards(): boolean;
  clearDiscardCards(): void;
  getDiscardCards(): protobuf_holdem_define_gd_pb.ValidCards | undefined;
  setDiscardCards(value?: protobuf_holdem_define_gd_pb.ValidCards): void;

  getHandCardsLength(): number;
  setHandCardsLength(value: number): void;

  getCurrentWinrate(): number;
  setCurrentWinrate(value: number): void;

  hasNextOperator(): boolean;
  clearNextOperator(): void;
  getNextOperator(): protobuf_holdem_define_gd_pb.OperatorGD | undefined;
  setNextOperator(value?: protobuf_holdem_define_gd_pb.OperatorGD): void;

  getRank(): protobuf_holdem_define_gd_pb.DefGD.WinTypeMap[keyof protobuf_holdem_define_gd_pb.DefGD.WinTypeMap];
  setRank(value: protobuf_holdem_define_gd_pb.DefGD.WinTypeMap[keyof protobuf_holdem_define_gd_pb.DefGD.WinTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdActionAll.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdActionAll): ServerMessageGdActionAll.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdActionAll, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdActionAll;
  static deserializeBinaryFromReader(message: ServerMessageGdActionAll, reader: jspb.BinaryReader): ServerMessageGdActionAll;
}

export namespace ServerMessageGdActionAll {
  export type AsObject = {
    operatorSeatId: number,
    act: protobuf_holdem_define_gd_pb.DefGD.ActionGdMap[keyof protobuf_holdem_define_gd_pb.DefGD.ActionGdMap],
    discardCards?: protobuf_holdem_define_gd_pb.ValidCards.AsObject,
    handCardsLength: number,
    currentWinrate: number,
    nextOperator?: protobuf_holdem_define_gd_pb.OperatorGD.AsObject,
    rank: protobuf_holdem_define_gd_pb.DefGD.WinTypeMap[keyof protobuf_holdem_define_gd_pb.DefGD.WinTypeMap],
  }
}

