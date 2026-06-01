// package: holdem.pb
// file: protobuf/holdem/recv_gd_stand_up.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageGdStandup extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getReason(): protobuf_holdem_define_pb.Def.StandUpReasonMap[keyof protobuf_holdem_define_pb.Def.StandUpReasonMap];
  setReason(value: protobuf_holdem_define_pb.Def.StandUpReasonMap[keyof protobuf_holdem_define_pb.Def.StandUpReasonMap]): void;

  getBringOut(): number;
  setBringOut(value: number): void;

  getAccountChips(): number;
  setAccountChips(value: number): void;

  getFee(): number;
  setFee(value: number): void;

  getWillLeave(): boolean;
  setWillLeave(value: boolean): void;

  getMuted(): boolean;
  setMuted(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdStandup.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdStandup): ServerMessageGdStandup.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdStandup, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdStandup;
  static deserializeBinaryFromReader(message: ServerMessageGdStandup, reader: jspb.BinaryReader): ServerMessageGdStandup;
}

export namespace ServerMessageGdStandup {
  export type AsObject = {
    seatId: number,
    reason: protobuf_holdem_define_pb.Def.StandUpReasonMap[keyof protobuf_holdem_define_pb.Def.StandUpReasonMap],
    bringOut: number,
    accountChips: number,
    fee: number,
    willLeave: boolean,
    muted: boolean,
  }
}

