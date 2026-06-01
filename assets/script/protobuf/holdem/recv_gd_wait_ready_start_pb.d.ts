// package: holdem.pb
// file: protobuf/holdem/recv_gd_wait_ready_start.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_gd_pb from "../../protobuf/holdem/define_gd_pb";

export class ServerMessageGdWaitReadyStart extends jspb.Message {
  getWaitDeadline(): number;
  setWaitDeadline(value: number): void;

  clearPlayerGoldList(): void;
  getPlayerGoldList(): Array<protobuf_holdem_define_gd_pb.PlayerGoldGD>;
  setPlayerGoldList(value: Array<protobuf_holdem_define_gd_pb.PlayerGoldGD>): void;
  addPlayerGold(value?: protobuf_holdem_define_gd_pb.PlayerGoldGD, index?: number): protobuf_holdem_define_gd_pb.PlayerGoldGD;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdWaitReadyStart.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdWaitReadyStart): ServerMessageGdWaitReadyStart.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdWaitReadyStart, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdWaitReadyStart;
  static deserializeBinaryFromReader(message: ServerMessageGdWaitReadyStart, reader: jspb.BinaryReader): ServerMessageGdWaitReadyStart;
}

export namespace ServerMessageGdWaitReadyStart {
  export type AsObject = {
    waitDeadline: number,
    playerGoldList: Array<protobuf_holdem_define_gd_pb.PlayerGoldGD.AsObject>,
  }
}

