// package: holdem.pb
// file: protobuf/holdem/recv_th_agree_second_pcs_trigged.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageAgreeSecondPcsTrigged extends jspb.Message {
  getRound(): protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap];
  setRound(value: protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap]): void;

  clearOperatorList(): void;
  getOperatorList(): Array<protobuf_holdem_define_pb.Operator>;
  setOperatorList(value: Array<protobuf_holdem_define_pb.Operator>): void;
  addOperator(value?: protobuf_holdem_define_pb.Operator, index?: number): protobuf_holdem_define_pb.Operator;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageAgreeSecondPcsTrigged.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageAgreeSecondPcsTrigged): ServerMessageAgreeSecondPcsTrigged.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageAgreeSecondPcsTrigged, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageAgreeSecondPcsTrigged;
  static deserializeBinaryFromReader(message: ServerMessageAgreeSecondPcsTrigged, reader: jspb.BinaryReader): ServerMessageAgreeSecondPcsTrigged;
}

export namespace ServerMessageAgreeSecondPcsTrigged {
  export type AsObject = {
    round: protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap],
    operatorList: Array<protobuf_holdem_define_pb.Operator.AsObject>,
  }
}

