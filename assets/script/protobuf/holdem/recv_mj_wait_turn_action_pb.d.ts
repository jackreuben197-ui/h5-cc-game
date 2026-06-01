// package: holdem.pb
// file: protobuf/holdem/recv_mj_wait_turn_action.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_mj_pb from "../../protobuf/holdem/define_mj_pb";

export class ServerMessageMjWaitTurnAction extends jspb.Message {
  hasOp(): boolean;
  clearOp(): void;
  getOp(): protobuf_holdem_define_mj_pb.OperatorMJ | undefined;
  setOp(value?: protobuf_holdem_define_mj_pb.OperatorMJ): void;

  getWaitDeadline(): number;
  setWaitDeadline(value: number): void;

  getWallAscIndex(): number;
  setWallAscIndex(value: number): void;

  getWallDescIndex(): number;
  setWallDescIndex(value: number): void;

  getWallLeft(): number;
  setWallLeft(value: number): void;

  clearExchangeTilesList(): void;
  getExchangeTilesList(): Array<protobuf_holdem_define_mj_pb.ExchangeFlower>;
  setExchangeTilesList(value: Array<protobuf_holdem_define_mj_pb.ExchangeFlower>): void;
  addExchangeTiles(value?: protobuf_holdem_define_mj_pb.ExchangeFlower, index?: number): protobuf_holdem_define_mj_pb.ExchangeFlower;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjWaitTurnAction.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjWaitTurnAction): ServerMessageMjWaitTurnAction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjWaitTurnAction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjWaitTurnAction;
  static deserializeBinaryFromReader(message: ServerMessageMjWaitTurnAction, reader: jspb.BinaryReader): ServerMessageMjWaitTurnAction;
}

export namespace ServerMessageMjWaitTurnAction {
  export type AsObject = {
    op?: protobuf_holdem_define_mj_pb.OperatorMJ.AsObject,
    waitDeadline: number,
    wallAscIndex: number,
    wallDescIndex: number,
    wallLeft: number,
    exchangeTilesList: Array<protobuf_holdem_define_mj_pb.ExchangeFlower.AsObject>,
  }
}

