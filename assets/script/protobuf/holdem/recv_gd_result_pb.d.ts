// package: holdem.pb
// file: protobuf/holdem/recv_gd_result.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_gd_pb from "../../protobuf/holdem/define_gd_pb";

export class ServerMessageGdResult extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<protobuf_holdem_define_gd_pb.ResultGD>;
  setResultsList(value: Array<protobuf_holdem_define_gd_pb.ResultGD>): void;
  addResults(value?: protobuf_holdem_define_gd_pb.ResultGD, index?: number): protobuf_holdem_define_gd_pb.ResultGD;

  getMatchNum(): number;
  setMatchNum(value: number): void;

  getCurrentWinrate(): number;
  setCurrentWinrate(value: number): void;

  getLevelCardGroup1(): number;
  setLevelCardGroup1(value: number): void;

  getLevelCardGroup2(): number;
  setLevelCardGroup2(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdResult.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdResult): ServerMessageGdResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdResult;
  static deserializeBinaryFromReader(message: ServerMessageGdResult, reader: jspb.BinaryReader): ServerMessageGdResult;
}

export namespace ServerMessageGdResult {
  export type AsObject = {
    resultsList: Array<protobuf_holdem_define_gd_pb.ResultGD.AsObject>,
    matchNum: number,
    currentWinrate: number,
    levelCardGroup1: number,
    levelCardGroup2: number,
  }
}

