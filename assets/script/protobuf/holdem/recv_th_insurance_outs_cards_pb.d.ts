// package: holdem.pb
// file: protobuf/holdem/recv_th_insurance_outs_cards.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageInsuranceOutsCards extends jspb.Message {
  getRound(): protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap];
  setRound(value: protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap]): void;

  clearPlayerCardsList(): void;
  getPlayerCardsList(): Array<protobuf_holdem_define_pb.PlayerInsuranceOutsCards>;
  setPlayerCardsList(value: Array<protobuf_holdem_define_pb.PlayerInsuranceOutsCards>): void;
  addPlayerCards(value?: protobuf_holdem_define_pb.PlayerInsuranceOutsCards, index?: number): protobuf_holdem_define_pb.PlayerInsuranceOutsCards;

  clearInsurSeatIdsList(): void;
  getInsurSeatIdsList(): Array<number>;
  setInsurSeatIdsList(value: Array<number>): void;
  addInsurSeatIds(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageInsuranceOutsCards.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageInsuranceOutsCards): ServerMessageInsuranceOutsCards.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageInsuranceOutsCards, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageInsuranceOutsCards;
  static deserializeBinaryFromReader(message: ServerMessageInsuranceOutsCards, reader: jspb.BinaryReader): ServerMessageInsuranceOutsCards;
}

export namespace ServerMessageInsuranceOutsCards {
  export type AsObject = {
    round: protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap],
    playerCardsList: Array<protobuf_holdem_define_pb.PlayerInsuranceOutsCards.AsObject>,
    insurSeatIdsList: Array<number>,
  }
}

