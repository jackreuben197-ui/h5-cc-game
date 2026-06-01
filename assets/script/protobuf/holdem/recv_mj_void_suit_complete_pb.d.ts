// package: holdem.pb
// file: protobuf/holdem/recv_mj_void_suit_complete.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_mj_pb from "../../protobuf/holdem/define_mj_pb";

export class ServerMessageMjVoidSuitComplete extends jspb.Message {
  clearPlayersList(): void;
  getPlayersList(): Array<protobuf_holdem_define_mj_pb.PlayerVoidSuit>;
  setPlayersList(value: Array<protobuf_holdem_define_mj_pb.PlayerVoidSuit>): void;
  addPlayers(value?: protobuf_holdem_define_mj_pb.PlayerVoidSuit, index?: number): protobuf_holdem_define_mj_pb.PlayerVoidSuit;

  clearOpsList(): void;
  getOpsList(): Array<protobuf_holdem_define_mj_pb.OperatorMJ>;
  setOpsList(value: Array<protobuf_holdem_define_mj_pb.OperatorMJ>): void;
  addOps(value?: protobuf_holdem_define_mj_pb.OperatorMJ, index?: number): protobuf_holdem_define_mj_pb.OperatorMJ;

  getWaitDeadline(): number;
  setWaitDeadline(value: number): void;

  clearReadyTilesList(): void;
  getReadyTilesList(): Array<protobuf_holdem_define_mj_pb.ReadyTile>;
  setReadyTilesList(value: Array<protobuf_holdem_define_mj_pb.ReadyTile>): void;
  addReadyTiles(value?: protobuf_holdem_define_mj_pb.ReadyTile, index?: number): protobuf_holdem_define_mj_pb.ReadyTile;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjVoidSuitComplete.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjVoidSuitComplete): ServerMessageMjVoidSuitComplete.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjVoidSuitComplete, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjVoidSuitComplete;
  static deserializeBinaryFromReader(message: ServerMessageMjVoidSuitComplete, reader: jspb.BinaryReader): ServerMessageMjVoidSuitComplete;
}

export namespace ServerMessageMjVoidSuitComplete {
  export type AsObject = {
    playersList: Array<protobuf_holdem_define_mj_pb.PlayerVoidSuit.AsObject>,
    opsList: Array<protobuf_holdem_define_mj_pb.OperatorMJ.AsObject>,
    waitDeadline: number,
    readyTilesList: Array<protobuf_holdem_define_mj_pb.ReadyTile.AsObject>,
  }
}

