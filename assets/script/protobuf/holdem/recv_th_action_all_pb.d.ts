// package: holdem.pb
// file: protobuf/holdem/recv_th_action_all.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageActionAll extends jspb.Message {
  getOperatorSeatId(): number;
  setOperatorSeatId(value: number): void;

  getAction(): protobuf_holdem_define_pb.Def.ActionMap[keyof protobuf_holdem_define_pb.Def.ActionMap];
  setAction(value: protobuf_holdem_define_pb.Def.ActionMap[keyof protobuf_holdem_define_pb.Def.ActionMap]): void;

  getAmount(): number;
  setAmount(value: number): void;

  hasNextOperator(): boolean;
  clearNextOperator(): void;
  getNextOperator(): protobuf_holdem_define_pb.Operator | undefined;
  setNextOperator(value?: protobuf_holdem_define_pb.Operator): void;

  getAllBet(): number;
  setAllBet(value: number): void;

  getRoundBet(): number;
  setRoundBet(value: number): void;

  getIsAuto(): boolean;
  setIsAuto(value: boolean): void;

  getLeftChips(): number;
  setLeftChips(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageActionAll.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageActionAll): ServerMessageActionAll.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageActionAll, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageActionAll;
  static deserializeBinaryFromReader(message: ServerMessageActionAll, reader: jspb.BinaryReader): ServerMessageActionAll;
}

export namespace ServerMessageActionAll {
  export type AsObject = {
    operatorSeatId: number,
    action: protobuf_holdem_define_pb.Def.ActionMap[keyof protobuf_holdem_define_pb.Def.ActionMap],
    amount: number,
    nextOperator?: protobuf_holdem_define_pb.Operator.AsObject,
    allBet: number,
    roundBet: number,
    isAuto: boolean,
    leftChips: number,
  }
}

