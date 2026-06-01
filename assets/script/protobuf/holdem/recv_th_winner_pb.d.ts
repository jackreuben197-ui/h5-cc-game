// package: holdem.pb
// file: protobuf/holdem/recv_th_winner.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageWinner extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<protobuf_holdem_define_pb.Result>;
  setResultsList(value: Array<protobuf_holdem_define_pb.Result>): void;
  addResults(value?: protobuf_holdem_define_pb.Result, index?: number): protobuf_holdem_define_pb.Result;

  getHandNum(): number;
  setHandNum(value: number): void;

  getRound(): protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap];
  setRound(value: protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap]): void;

  hasPools(): boolean;
  clearPools(): void;
  getPools(): protobuf_holdem_define_pb.ExternalPools | undefined;
  setPools(value?: protobuf_holdem_define_pb.ExternalPools): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageWinner.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageWinner): ServerMessageWinner.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageWinner, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageWinner;
  static deserializeBinaryFromReader(message: ServerMessageWinner, reader: jspb.BinaryReader): ServerMessageWinner;
}

export namespace ServerMessageWinner {
  export type AsObject = {
    resultsList: Array<protobuf_holdem_define_pb.Result.AsObject>,
    handNum: number,
    round: protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap],
    pools?: protobuf_holdem_define_pb.ExternalPools.AsObject,
  }
}

