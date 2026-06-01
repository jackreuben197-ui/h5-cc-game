// package: holdem.pb
// file: protobuf/holdem/recv_mj_result.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_mj_pb from "../../protobuf/holdem/define_mj_pb";

export class ServerMessageMjResult extends jspb.Message {
  clearResultsList(): void;
  getResultsList(): Array<protobuf_holdem_define_mj_pb.ResultMJ>;
  setResultsList(value: Array<protobuf_holdem_define_mj_pb.ResultMJ>): void;
  addResults(value?: protobuf_holdem_define_mj_pb.ResultMJ, index?: number): protobuf_holdem_define_mj_pb.ResultMJ;

  getMatchNum(): number;
  setMatchNum(value: number): void;

  getFinal(): boolean;
  setFinal(value: boolean): void;

  getDraw(): boolean;
  setDraw(value: boolean): void;

  getWallAscIndex(): number;
  setWallAscIndex(value: number): void;

  getWallDescIndex(): number;
  setWallDescIndex(value: number): void;

  getWallLeft(): number;
  setWallLeft(value: number): void;

  clearHorseTilesList(): void;
  getHorseTilesList(): Array<number>;
  setHorseTilesList(value: Array<number>): void;
  addHorseTiles(value: number, index?: number): number;

  clearReadyTilesList(): void;
  getReadyTilesList(): Array<protobuf_holdem_define_mj_pb.ReadyTile>;
  setReadyTilesList(value: Array<protobuf_holdem_define_mj_pb.ReadyTile>): void;
  addReadyTiles(value?: protobuf_holdem_define_mj_pb.ReadyTile, index?: number): protobuf_holdem_define_mj_pb.ReadyTile;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjResult.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjResult): ServerMessageMjResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjResult;
  static deserializeBinaryFromReader(message: ServerMessageMjResult, reader: jspb.BinaryReader): ServerMessageMjResult;
}

export namespace ServerMessageMjResult {
  export type AsObject = {
    resultsList: Array<protobuf_holdem_define_mj_pb.ResultMJ.AsObject>,
    matchNum: number,
    pb_final: boolean,
    draw: boolean,
    wallAscIndex: number,
    wallDescIndex: number,
    wallLeft: number,
    horseTilesList: Array<number>,
    readyTilesList: Array<protobuf_holdem_define_mj_pb.ReadyTile.AsObject>,
  }
}

