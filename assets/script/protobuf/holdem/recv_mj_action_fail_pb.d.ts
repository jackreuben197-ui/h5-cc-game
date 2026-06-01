// package: holdem.pb
// file: protobuf/holdem/recv_mj_action_fail.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_mj_pb from "../../protobuf/holdem/define_mj_pb";

export class ServerMessageMjActionFail extends jspb.Message {
  getOperatorSeatId(): number;
  setOperatorSeatId(value: number): void;

  getAct(): protobuf_holdem_define_mj_pb.DefMJ.ActionMjMap[keyof protobuf_holdem_define_mj_pb.DefMJ.ActionMjMap];
  setAct(value: protobuf_holdem_define_mj_pb.DefMJ.ActionMjMap[keyof protobuf_holdem_define_mj_pb.DefMJ.ActionMjMap]): void;

  clearTilesList(): void;
  getTilesList(): Array<protobuf_holdem_define_mj_pb.Tile>;
  setTilesList(value: Array<protobuf_holdem_define_mj_pb.Tile>): void;
  addTiles(value?: protobuf_holdem_define_mj_pb.Tile, index?: number): protobuf_holdem_define_mj_pb.Tile;

  getTargetSeatId(): number;
  setTargetSeatId(value: number): void;

  hasTargetTile(): boolean;
  clearTargetTile(): void;
  getTargetTile(): protobuf_holdem_define_mj_pb.Tile | undefined;
  setTargetTile(value?: protobuf_holdem_define_mj_pb.Tile): void;

  getR(): protobuf_holdem_define_mj_pb.DefMJ.ActionFailReasonMap[keyof protobuf_holdem_define_mj_pb.DefMJ.ActionFailReasonMap];
  setR(value: protobuf_holdem_define_mj_pb.DefMJ.ActionFailReasonMap[keyof protobuf_holdem_define_mj_pb.DefMJ.ActionFailReasonMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjActionFail.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjActionFail): ServerMessageMjActionFail.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjActionFail, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjActionFail;
  static deserializeBinaryFromReader(message: ServerMessageMjActionFail, reader: jspb.BinaryReader): ServerMessageMjActionFail;
}

export namespace ServerMessageMjActionFail {
  export type AsObject = {
    operatorSeatId: number,
    act: protobuf_holdem_define_mj_pb.DefMJ.ActionMjMap[keyof protobuf_holdem_define_mj_pb.DefMJ.ActionMjMap],
    tilesList: Array<protobuf_holdem_define_mj_pb.Tile.AsObject>,
    targetSeatId: number,
    targetTile?: protobuf_holdem_define_mj_pb.Tile.AsObject,
    r: protobuf_holdem_define_mj_pb.DefMJ.ActionFailReasonMap[keyof protobuf_holdem_define_mj_pb.DefMJ.ActionFailReasonMap],
  }
}

