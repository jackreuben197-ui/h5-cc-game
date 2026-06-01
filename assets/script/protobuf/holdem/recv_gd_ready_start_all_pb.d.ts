// package: holdem.pb
// file: protobuf/holdem/recv_gd_ready_start_all.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_gd_pb from "../../protobuf/holdem/define_gd_pb";

export class ServerMessageGdReadyStartAll extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getWaitDeadline(): number;
  setWaitDeadline(value: number): void;

  clearPlayerGoldList(): void;
  getPlayerGoldList(): Array<protobuf_holdem_define_gd_pb.PlayerGoldGD>;
  setPlayerGoldList(value: Array<protobuf_holdem_define_gd_pb.PlayerGoldGD>): void;
  addPlayerGold(value?: protobuf_holdem_define_gd_pb.PlayerGoldGD, index?: number): protobuf_holdem_define_gd_pb.PlayerGoldGD;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdReadyStartAll.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdReadyStartAll): ServerMessageGdReadyStartAll.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdReadyStartAll, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdReadyStartAll;
  static deserializeBinaryFromReader(message: ServerMessageGdReadyStartAll, reader: jspb.BinaryReader): ServerMessageGdReadyStartAll;
}

export namespace ServerMessageGdReadyStartAll {
  export type AsObject = {
    seatId: number,
    waitDeadline: number,
    playerGoldList: Array<protobuf_holdem_define_gd_pb.PlayerGoldGD.AsObject>,
  }
}

