// package: holdem.pb
// file: protobuf/holdem/recv_cb_game_play_end.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_cb_pb from "../../protobuf/holdem/define_cb_pb";

export class ServerMessageCbGamePlayEnd extends jspb.Message {
  getGameNum(): number;
  setGameNum(value: number): void;

  clearSummaryList(): void;
  getSummaryList(): Array<protobuf_holdem_define_cb_pb.CBPlaySummary>;
  setSummaryList(value: Array<protobuf_holdem_define_cb_pb.CBPlaySummary>): void;
  addSummary(value?: protobuf_holdem_define_cb_pb.CBPlaySummary, index?: number): protobuf_holdem_define_cb_pb.CBPlaySummary;

  clearUserPlayList(): void;
  getUserPlayList(): Array<protobuf_holdem_define_cb_pb.CBSlotUserPlaySummary>;
  setUserPlayList(value: Array<protobuf_holdem_define_cb_pb.CBSlotUserPlaySummary>): void;
  addUserPlay(value?: protobuf_holdem_define_cb_pb.CBSlotUserPlaySummary, index?: number): protobuf_holdem_define_cb_pb.CBSlotUserPlaySummary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageCbGamePlayEnd.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageCbGamePlayEnd): ServerMessageCbGamePlayEnd.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageCbGamePlayEnd, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageCbGamePlayEnd;
  static deserializeBinaryFromReader(message: ServerMessageCbGamePlayEnd, reader: jspb.BinaryReader): ServerMessageCbGamePlayEnd;
}

export namespace ServerMessageCbGamePlayEnd {
  export type AsObject = {
    gameNum: number,
    summaryList: Array<protobuf_holdem_define_cb_pb.CBPlaySummary.AsObject>,
    userPlayList: Array<protobuf_holdem_define_cb_pb.CBSlotUserPlaySummary.AsObject>,
  }
}

