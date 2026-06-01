// package: holdem.pb
// file: protobuf/holdem/recv_th_insurance_trigged.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageInsuranceTrigged extends jspb.Message {
  getRound(): protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap];
  setRound(value: protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap]): void;

  clearOperatorList(): void;
  getOperatorList(): Array<protobuf_holdem_define_pb.Operator>;
  setOperatorList(value: Array<protobuf_holdem_define_pb.Operator>): void;
  addOperator(value?: protobuf_holdem_define_pb.Operator, index?: number): protobuf_holdem_define_pb.Operator;

  clearInvalidPotsList(): void;
  getInvalidPotsList(): Array<protobuf_holdem_define_pb.InsurancePotInvalid>;
  setInvalidPotsList(value: Array<protobuf_holdem_define_pb.InsurancePotInvalid>): void;
  addInvalidPots(value?: protobuf_holdem_define_pb.InsurancePotInvalid, index?: number): protobuf_holdem_define_pb.InsurancePotInvalid;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageInsuranceTrigged.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageInsuranceTrigged): ServerMessageInsuranceTrigged.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageInsuranceTrigged, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageInsuranceTrigged;
  static deserializeBinaryFromReader(message: ServerMessageInsuranceTrigged, reader: jspb.BinaryReader): ServerMessageInsuranceTrigged;
}

export namespace ServerMessageInsuranceTrigged {
  export type AsObject = {
    round: protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap],
    operatorList: Array<protobuf_holdem_define_pb.Operator.AsObject>,
    invalidPotsList: Array<protobuf_holdem_define_pb.InsurancePotInvalid.AsObject>,
  }
}

