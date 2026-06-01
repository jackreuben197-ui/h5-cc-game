// package: holdem.pb
// file: protobuf/holdem/req_th_roomers.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageRoomers extends jspb.Message {
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
  toObject(includeInstance?: boolean): ClientMessageRoomers.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageRoomers): ClientMessageRoomers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageRoomers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageRoomers;
  static deserializeBinaryFromReader(message: ClientMessageRoomers, reader: jspb.BinaryReader): ClientMessageRoomers;
}

export namespace ClientMessageRoomers {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    history: boolean,
    historyOffset: number,
    historyLimit: number,
  }
}

export class ServerMessageRoomers extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getInsurance(): number;
  setInsurance(value: number): void;

  clearObserversList(): void;
  getObserversList(): Array<protobuf_holdem_define_pb.Roomer>;
  setObserversList(value: Array<protobuf_holdem_define_pb.Roomer>): void;
  addObservers(value?: protobuf_holdem_define_pb.Roomer, index?: number): protobuf_holdem_define_pb.Roomer;

  clearPlayersList(): void;
  getPlayersList(): Array<protobuf_holdem_define_pb.PlayerSummary>;
  setPlayersList(value: Array<protobuf_holdem_define_pb.PlayerSummary>): void;
  addPlayers(value?: protobuf_holdem_define_pb.PlayerSummary, index?: number): protobuf_holdem_define_pb.PlayerSummary;

  getHistoryOffset(): number;
  setHistoryOffset(value: number): void;

  getHistoryLimit(): number;
  setHistoryLimit(value: number): void;

  getTotal(): number;
  setTotal(value: number): void;

  getTotalPot(): number;
  setTotalPot(value: number): void;

  getTotalHand(): number;
  setTotalHand(value: number): void;

  getTotalBringin(): number;
  setTotalBringin(value: number): void;

  getStartTime(): number;
  setStartTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageRoomers.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageRoomers): ServerMessageRoomers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageRoomers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageRoomers;
  static deserializeBinaryFromReader(message: ServerMessageRoomers, reader: jspb.BinaryReader): ServerMessageRoomers;
}

export namespace ServerMessageRoomers {
  export type AsObject = {
    status: number,
    insurance: number,
    observersList: Array<protobuf_holdem_define_pb.Roomer.AsObject>,
    playersList: Array<protobuf_holdem_define_pb.PlayerSummary.AsObject>,
    historyOffset: number,
    historyLimit: number,
    total: number,
    totalPot: number,
    totalHand: number,
    totalBringin: number,
    startTime: number,
  }
}

