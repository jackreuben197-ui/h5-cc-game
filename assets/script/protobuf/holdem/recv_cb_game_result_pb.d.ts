// package: holdem.pb
// file: protobuf/holdem/recv_cb_game_result.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_cb_pb from "../../protobuf/holdem/define_cb_pb";

export class ServerMessageCbGameResult extends jspb.Message {
  getGameNum(): number;
  setGameNum(value: number): void;

  getFirstCard(): number;
  setFirstCard(value: number): void;

  hasGameResult(): boolean;
  clearGameResult(): void;
  getGameResult(): protobuf_holdem_define_cb_pb.CBGameResult | undefined;
  setGameResult(value?: protobuf_holdem_define_cb_pb.CBGameResult): void;

  clearMyPlayList(): void;
  getMyPlayList(): Array<protobuf_holdem_define_cb_pb.CBPlayResult>;
  setMyPlayList(value: Array<protobuf_holdem_define_cb_pb.CBPlayResult>): void;
  addMyPlay(value?: protobuf_holdem_define_cb_pb.CBPlayResult, index?: number): protobuf_holdem_define_cb_pb.CBPlayResult;

  getMyWin(): number;
  setMyWin(value: number): void;

  getOnline(): number;
  setOnline(value: number): void;

  clearItemsList(): void;
  getItemsList(): Array<protobuf_holdem_define_cb_pb.CBHistoryItem>;
  setItemsList(value: Array<protobuf_holdem_define_cb_pb.CBHistoryItem>): void;
  addItems(value?: protobuf_holdem_define_cb_pb.CBHistoryItem, index?: number): protobuf_holdem_define_cb_pb.CBHistoryItem;

  clearOtherUserPlaysList(): void;
  getOtherUserPlaysList(): Array<protobuf_holdem_define_cb_pb.CBUserPlaySummary>;
  setOtherUserPlaysList(value: Array<protobuf_holdem_define_cb_pb.CBUserPlaySummary>): void;
  addOtherUserPlays(value?: protobuf_holdem_define_cb_pb.CBUserPlaySummary, index?: number): protobuf_holdem_define_cb_pb.CBUserPlaySummary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageCbGameResult.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageCbGameResult): ServerMessageCbGameResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageCbGameResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageCbGameResult;
  static deserializeBinaryFromReader(message: ServerMessageCbGameResult, reader: jspb.BinaryReader): ServerMessageCbGameResult;
}

export namespace ServerMessageCbGameResult {
  export type AsObject = {
    gameNum: number,
    firstCard: number,
    gameResult?: protobuf_holdem_define_cb_pb.CBGameResult.AsObject,
    myPlayList: Array<protobuf_holdem_define_cb_pb.CBPlayResult.AsObject>,
    myWin: number,
    online: number,
    itemsList: Array<protobuf_holdem_define_cb_pb.CBHistoryItem.AsObject>,
    otherUserPlaysList: Array<protobuf_holdem_define_cb_pb.CBUserPlaySummary.AsObject>,
  }
}

