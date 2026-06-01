// package: holdem.pb
// file: protobuf/holdem/recv_mj_exchange_tiles_complete.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_mj_pb from "../../protobuf/holdem/define_mj_pb";

export class ServerMessageMjExchangeTilesComplete extends jspb.Message {
  clearInTilesList(): void;
  getInTilesList(): Array<protobuf_holdem_define_mj_pb.Tile>;
  setInTilesList(value: Array<protobuf_holdem_define_mj_pb.Tile>): void;
  addInTiles(value?: protobuf_holdem_define_mj_pb.Tile, index?: number): protobuf_holdem_define_mj_pb.Tile;

  clearOutTilesList(): void;
  getOutTilesList(): Array<protobuf_holdem_define_mj_pb.Tile>;
  setOutTilesList(value: Array<protobuf_holdem_define_mj_pb.Tile>): void;
  addOutTiles(value?: protobuf_holdem_define_mj_pb.Tile, index?: number): protobuf_holdem_define_mj_pb.Tile;

  clearOpsList(): void;
  getOpsList(): Array<protobuf_holdem_define_mj_pb.OperatorMJ>;
  setOpsList(value: Array<protobuf_holdem_define_mj_pb.OperatorMJ>): void;
  addOps(value?: protobuf_holdem_define_mj_pb.OperatorMJ, index?: number): protobuf_holdem_define_mj_pb.OperatorMJ;

  getWaitDeadline(): number;
  setWaitDeadline(value: number): void;

  getExchangeTileLength(): number;
  setExchangeTileLength(value: number): void;

  clearReadyTilesList(): void;
  getReadyTilesList(): Array<protobuf_holdem_define_mj_pb.ReadyTile>;
  setReadyTilesList(value: Array<protobuf_holdem_define_mj_pb.ReadyTile>): void;
  addReadyTiles(value?: protobuf_holdem_define_mj_pb.ReadyTile, index?: number): protobuf_holdem_define_mj_pb.ReadyTile;

  getMode(): protobuf_holdem_define_mj_pb.DefMJ.ExchangeModeMap[keyof protobuf_holdem_define_mj_pb.DefMJ.ExchangeModeMap];
  setMode(value: protobuf_holdem_define_mj_pb.DefMJ.ExchangeModeMap[keyof protobuf_holdem_define_mj_pb.DefMJ.ExchangeModeMap]): void;

  getDefaultVoid(): protobuf_holdem_define_mj_pb.DefMJ.TileTypeMap[keyof protobuf_holdem_define_mj_pb.DefMJ.TileTypeMap];
  setDefaultVoid(value: protobuf_holdem_define_mj_pb.DefMJ.TileTypeMap[keyof protobuf_holdem_define_mj_pb.DefMJ.TileTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjExchangeTilesComplete.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjExchangeTilesComplete): ServerMessageMjExchangeTilesComplete.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjExchangeTilesComplete, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjExchangeTilesComplete;
  static deserializeBinaryFromReader(message: ServerMessageMjExchangeTilesComplete, reader: jspb.BinaryReader): ServerMessageMjExchangeTilesComplete;
}

export namespace ServerMessageMjExchangeTilesComplete {
  export type AsObject = {
    inTilesList: Array<protobuf_holdem_define_mj_pb.Tile.AsObject>,
    outTilesList: Array<protobuf_holdem_define_mj_pb.Tile.AsObject>,
    opsList: Array<protobuf_holdem_define_mj_pb.OperatorMJ.AsObject>,
    waitDeadline: number,
    exchangeTileLength: number,
    readyTilesList: Array<protobuf_holdem_define_mj_pb.ReadyTile.AsObject>,
    mode: protobuf_holdem_define_mj_pb.DefMJ.ExchangeModeMap[keyof protobuf_holdem_define_mj_pb.DefMJ.ExchangeModeMap],
    defaultVoid: protobuf_holdem_define_mj_pb.DefMJ.TileTypeMap[keyof protobuf_holdem_define_mj_pb.DefMJ.TileTypeMap],
  }
}

