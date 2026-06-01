// package: holdem.pb
// file: protobuf/holdem/req_gd_roomers.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";
import * as protobuf_holdem_define_gd_pb from "../../protobuf/holdem/define_gd_pb";

export class ClientMessageGdRoomers extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getHistory(): boolean;
  setHistory(value: boolean): void;

  getHistoryOffset(): number;
  setHistoryOffset(value: number): void;

  getHistoryLimit(): number;
  setHistoryLimit(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageGdRoomers.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageGdRoomers): ClientMessageGdRoomers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageGdRoomers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageGdRoomers;
  static deserializeBinaryFromReader(message: ClientMessageGdRoomers, reader: jspb.BinaryReader): ClientMessageGdRoomers;
}

export namespace ClientMessageGdRoomers {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    history: boolean,
    historyOffset: number,
    historyLimit: number,
  }
}

export class ServerMessageGdRoomers extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  clearObserversList(): void;
  getObserversList(): Array<protobuf_holdem_define_pb.Roomer>;
  setObserversList(value: Array<protobuf_holdem_define_pb.Roomer>): void;
  addObservers(value?: protobuf_holdem_define_pb.Roomer, index?: number): protobuf_holdem_define_pb.Roomer;

  clearPlayersList(): void;
  getPlayersList(): Array<protobuf_holdem_define_gd_pb.PlayerSummaryGD>;
  setPlayersList(value: Array<protobuf_holdem_define_gd_pb.PlayerSummaryGD>): void;
  addPlayers(value?: protobuf_holdem_define_gd_pb.PlayerSummaryGD, index?: number): protobuf_holdem_define_gd_pb.PlayerSummaryGD;

  getHistoryOffset(): number;
  setHistoryOffset(value: number): void;

  getHistoryLimit(): number;
  setHistoryLimit(value: number): void;

  getTotal(): number;
  setTotal(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdRoomers.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdRoomers): ServerMessageGdRoomers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdRoomers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdRoomers;
  static deserializeBinaryFromReader(message: ServerMessageGdRoomers, reader: jspb.BinaryReader): ServerMessageGdRoomers;
}

export namespace ServerMessageGdRoomers {
  export type AsObject = {
    status: number,
    observersList: Array<protobuf_holdem_define_pb.Roomer.AsObject>,
    playersList: Array<protobuf_holdem_define_gd_pb.PlayerSummaryGD.AsObject>,
    historyOffset: number,
    historyLimit: number,
    total: number,
  }
}

