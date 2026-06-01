// package: holdem.pb
// file: protobuf/holdem/req_mj_roomers.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";
import * as protobuf_holdem_define_mj_pb from "../../protobuf/holdem/define_mj_pb";

export class ClientMessageMjRoomers extends jspb.Message {
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
  toObject(includeInstance?: boolean): ClientMessageMjRoomers.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageMjRoomers): ClientMessageMjRoomers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageMjRoomers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageMjRoomers;
  static deserializeBinaryFromReader(message: ClientMessageMjRoomers, reader: jspb.BinaryReader): ClientMessageMjRoomers;
}

export namespace ClientMessageMjRoomers {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    history: boolean,
    historyOffset: number,
    historyLimit: number,
  }
}

export class ServerMessageMjRoomers extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  clearObserversList(): void;
  getObserversList(): Array<protobuf_holdem_define_pb.Roomer>;
  setObserversList(value: Array<protobuf_holdem_define_pb.Roomer>): void;
  addObservers(value?: protobuf_holdem_define_pb.Roomer, index?: number): protobuf_holdem_define_pb.Roomer;

  clearPlayersList(): void;
  getPlayersList(): Array<protobuf_holdem_define_mj_pb.PlayerSummaryMJ>;
  setPlayersList(value: Array<protobuf_holdem_define_mj_pb.PlayerSummaryMJ>): void;
  addPlayers(value?: protobuf_holdem_define_mj_pb.PlayerSummaryMJ, index?: number): protobuf_holdem_define_mj_pb.PlayerSummaryMJ;

  getHistoryOffset(): number;
  setHistoryOffset(value: number): void;

  getHistoryLimit(): number;
  setHistoryLimit(value: number): void;

  getTotal(): number;
  setTotal(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjRoomers.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjRoomers): ServerMessageMjRoomers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjRoomers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjRoomers;
  static deserializeBinaryFromReader(message: ServerMessageMjRoomers, reader: jspb.BinaryReader): ServerMessageMjRoomers;
}

export namespace ServerMessageMjRoomers {
  export type AsObject = {
    status: number,
    observersList: Array<protobuf_holdem_define_pb.Roomer.AsObject>,
    playersList: Array<protobuf_holdem_define_mj_pb.PlayerSummaryMJ.AsObject>,
    historyOffset: number,
    historyLimit: number,
    total: number,
  }
}

