// package: holdem.pb
// file: protobuf/holdem/recv_mj_action_all.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_mj_pb from "../../protobuf/holdem/define_mj_pb";

export class ServerMessageMjActionAll extends jspb.Message {
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

  hasClaimOps(): boolean;
  clearClaimOps(): void;
  getClaimOps(): protobuf_holdem_define_mj_pb.OperatorMJ | undefined;
  setClaimOps(value?: protobuf_holdem_define_mj_pb.OperatorMJ): void;

  getWaitDeadline(): number;
  setWaitDeadline(value: number): void;

  clearErjsList(): void;
  getErjsList(): Array<protobuf_holdem_define_mj_pb.ExternalResultMJ>;
  setErjsList(value: Array<protobuf_holdem_define_mj_pb.ExternalResultMJ>): void;
  addErjs(value?: protobuf_holdem_define_mj_pb.ExternalResultMJ, index?: number): protobuf_holdem_define_mj_pb.ExternalResultMJ;

  clearOperatorReadyTilesList(): void;
  getOperatorReadyTilesList(): Array<protobuf_holdem_define_mj_pb.ReadyTile>;
  setOperatorReadyTilesList(value: Array<protobuf_holdem_define_mj_pb.ReadyTile>): void;
  addOperatorReadyTiles(value?: protobuf_holdem_define_mj_pb.ReadyTile, index?: number): protobuf_holdem_define_mj_pb.ReadyTile;

  getIsOffline(): boolean;
  setIsOffline(value: boolean): void;

  getMsgType(): protobuf_holdem_define_mj_pb.DefMJ.ActionAllTypeMap[keyof protobuf_holdem_define_mj_pb.DefMJ.ActionAllTypeMap];
  setMsgType(value: protobuf_holdem_define_mj_pb.DefMJ.ActionAllTypeMap[keyof protobuf_holdem_define_mj_pb.DefMJ.ActionAllTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjActionAll.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjActionAll): ServerMessageMjActionAll.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjActionAll, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjActionAll;
  static deserializeBinaryFromReader(message: ServerMessageMjActionAll, reader: jspb.BinaryReader): ServerMessageMjActionAll;
}

export namespace ServerMessageMjActionAll {
  export type AsObject = {
    operatorSeatId: number,
    act: protobuf_holdem_define_mj_pb.DefMJ.ActionMjMap[keyof protobuf_holdem_define_mj_pb.DefMJ.ActionMjMap],
    tilesList: Array<protobuf_holdem_define_mj_pb.Tile.AsObject>,
    targetSeatId: number,
    targetTile?: protobuf_holdem_define_mj_pb.Tile.AsObject,
    claimOps?: protobuf_holdem_define_mj_pb.OperatorMJ.AsObject,
    waitDeadline: number,
    erjsList: Array<protobuf_holdem_define_mj_pb.ExternalResultMJ.AsObject>,
    operatorReadyTilesList: Array<protobuf_holdem_define_mj_pb.ReadyTile.AsObject>,
    isOffline: boolean,
    msgType: protobuf_holdem_define_mj_pb.DefMJ.ActionAllTypeMap[keyof protobuf_holdem_define_mj_pb.DefMJ.ActionAllTypeMap],
  }
}

