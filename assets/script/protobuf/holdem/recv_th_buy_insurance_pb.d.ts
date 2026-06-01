// package: holdem.pb
// file: protobuf/holdem/recv_th_buy_insurance.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageBuyInsurance extends jspb.Message {
  getRound(): protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap];
  setRound(value: protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap]): void;

  getSeatId(): number;
  setSeatId(value: number): void;

  clearBuyList(): void;
  getBuyList(): Array<protobuf_holdem_define_pb.PotInsuranceBuy>;
  setBuyList(value: Array<protobuf_holdem_define_pb.PotInsuranceBuy>): void;
  addBuy(value?: protobuf_holdem_define_pb.PotInsuranceBuy, index?: number): protobuf_holdem_define_pb.PotInsuranceBuy;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageBuyInsurance.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageBuyInsurance): ServerMessageBuyInsurance.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageBuyInsurance, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageBuyInsurance;
  static deserializeBinaryFromReader(message: ServerMessageBuyInsurance, reader: jspb.BinaryReader): ServerMessageBuyInsurance;
}

export namespace ServerMessageBuyInsurance {
  export type AsObject = {
    round: protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap],
    seatId: number,
    buyList: Array<protobuf_holdem_define_pb.PotInsuranceBuy.AsObject>,
  }
}

