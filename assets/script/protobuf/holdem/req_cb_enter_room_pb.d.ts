// package: holdem.pb
// file: protobuf/holdem/req_cb_enter_room.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_cb_pb from "../../protobuf/holdem/define_cb_pb";

export class ClientMessageCbEnterRoom extends jspb.Message {
  getRoomId(): number;
  setRoomId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageCbEnterRoom.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageCbEnterRoom): ClientMessageCbEnterRoom.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageCbEnterRoom, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageCbEnterRoom;
  static deserializeBinaryFromReader(message: ClientMessageCbEnterRoom, reader: jspb.BinaryReader): ClientMessageCbEnterRoom;
}

export namespace ClientMessageCbEnterRoom {
  export type AsObject = {
    roomId: number,
  }
}

export class ServerMessageCbEnterRoom extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_cb_pb.CBRoom | undefined;
  setRoom(value?: protobuf_holdem_define_cb_pb.CBRoom): void;

  hasGame(): boolean;
  clearGame(): void;
  getGame(): protobuf_holdem_define_cb_pb.CBGame | undefined;
  setGame(value?: protobuf_holdem_define_cb_pb.CBGame): void;

  clearItemsList(): void;
  getItemsList(): Array<protobuf_holdem_define_cb_pb.CBHistoryItem>;
  setItemsList(value: Array<protobuf_holdem_define_cb_pb.CBHistoryItem>): void;
  addItems(value?: protobuf_holdem_define_cb_pb.CBHistoryItem, index?: number): protobuf_holdem_define_cb_pb.CBHistoryItem;

  getOnline(): number;
  setOnline(value: number): void;

  clearMyPlayList(): void;
  getMyPlayList(): Array<protobuf_holdem_define_cb_pb.CBPlayResult>;
  setMyPlayList(value: Array<protobuf_holdem_define_cb_pb.CBPlayResult>): void;
  addMyPlay(value?: protobuf_holdem_define_cb_pb.CBPlayResult, index?: number): protobuf_holdem_define_cb_pb.CBPlayResult;

  getMyWin(): number;
  setMyWin(value: number): void;

  getOnTable(): boolean;
  setOnTable(value: boolean): void;

  getMyWallet(): number;
  setMyWallet(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageCbEnterRoom.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageCbEnterRoom): ServerMessageCbEnterRoom.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageCbEnterRoom, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageCbEnterRoom;
  static deserializeBinaryFromReader(message: ServerMessageCbEnterRoom, reader: jspb.BinaryReader): ServerMessageCbEnterRoom;
}

export namespace ServerMessageCbEnterRoom {
  export type AsObject = {
    status: number,
    room?: protobuf_holdem_define_cb_pb.CBRoom.AsObject,
    game?: protobuf_holdem_define_cb_pb.CBGame.AsObject,
    itemsList: Array<protobuf_holdem_define_cb_pb.CBHistoryItem.AsObject>,
    online: number,
    myPlayList: Array<protobuf_holdem_define_cb_pb.CBPlayResult.AsObject>,
    myWin: number,
    onTable: boolean,
    myWallet: number,
  }
}

