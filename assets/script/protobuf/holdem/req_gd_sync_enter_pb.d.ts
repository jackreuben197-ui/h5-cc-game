// package: holdem.pb
// file: protobuf/holdem/req_gd_sync_enter.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";
import * as protobuf_holdem_define_gd_pb from "../../protobuf/holdem/define_gd_pb";

export class ClientMessageGdSyncEnter extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageGdSyncEnter.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageGdSyncEnter): ClientMessageGdSyncEnter.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageGdSyncEnter, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageGdSyncEnter;
  static deserializeBinaryFromReader(message: ClientMessageGdSyncEnter, reader: jspb.BinaryReader): ClientMessageGdSyncEnter;
}

export namespace ClientMessageGdSyncEnter {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
  }
}

export class ServerMessageGdSyncEnter extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getGameStatus(): protobuf_holdem_define_pb.Def.GameStatusMap[keyof protobuf_holdem_define_pb.Def.GameStatusMap];
  setGameStatus(value: protobuf_holdem_define_pb.Def.GameStatusMap[keyof protobuf_holdem_define_pb.Def.GameStatusMap]): void;

  hasRoomInfo(): boolean;
  clearRoomInfo(): void;
  getRoomInfo(): protobuf_holdem_define_gd_pb.RoomInfoGD | undefined;
  setRoomInfo(value?: protobuf_holdem_define_gd_pb.RoomInfoGD): void;

  hasHandInfo(): boolean;
  clearHandInfo(): void;
  getHandInfo(): protobuf_holdem_define_gd_pb.MatchInfoGD | undefined;
  setHandInfo(value?: protobuf_holdem_define_gd_pb.MatchInfoGD): void;

  clearPlayersList(): void;
  getPlayersList(): Array<protobuf_holdem_define_gd_pb.PlayerGD>;
  setPlayersList(value: Array<protobuf_holdem_define_gd_pb.PlayerGD>): void;
  addPlayers(value?: protobuf_holdem_define_gd_pb.PlayerGD, index?: number): protobuf_holdem_define_gd_pb.PlayerGD;

  hasMyInfo(): boolean;
  clearMyInfo(): void;
  getMyInfo(): protobuf_holdem_define_gd_pb.MyGameInfoGD | undefined;
  setMyInfo(value?: protobuf_holdem_define_gd_pb.MyGameInfoGD): void;

  clearOperatorList(): void;
  getOperatorList(): Array<protobuf_holdem_define_gd_pb.OperatorGD>;
  setOperatorList(value: Array<protobuf_holdem_define_gd_pb.OperatorGD>): void;
  addOperator(value?: protobuf_holdem_define_gd_pb.OperatorGD, index?: number): protobuf_holdem_define_gd_pb.OperatorGD;

  getMuted(): boolean;
  setMuted(value: boolean): void;

  clearResultsList(): void;
  getResultsList(): Array<protobuf_holdem_define_gd_pb.ResultGD>;
  setResultsList(value: Array<protobuf_holdem_define_gd_pb.ResultGD>): void;
  addResults(value?: protobuf_holdem_define_gd_pb.ResultGD, index?: number): protobuf_holdem_define_gd_pb.ResultGD;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdSyncEnter.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdSyncEnter): ServerMessageGdSyncEnter.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdSyncEnter, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdSyncEnter;
  static deserializeBinaryFromReader(message: ServerMessageGdSyncEnter, reader: jspb.BinaryReader): ServerMessageGdSyncEnter;
}

export namespace ServerMessageGdSyncEnter {
  export type AsObject = {
    status: number,
    gameStatus: protobuf_holdem_define_pb.Def.GameStatusMap[keyof protobuf_holdem_define_pb.Def.GameStatusMap],
    roomInfo?: protobuf_holdem_define_gd_pb.RoomInfoGD.AsObject,
    handInfo?: protobuf_holdem_define_gd_pb.MatchInfoGD.AsObject,
    playersList: Array<protobuf_holdem_define_gd_pb.PlayerGD.AsObject>,
    myInfo?: protobuf_holdem_define_gd_pb.MyGameInfoGD.AsObject,
    operatorList: Array<protobuf_holdem_define_gd_pb.OperatorGD.AsObject>,
    muted: boolean,
    resultsList: Array<protobuf_holdem_define_gd_pb.ResultGD.AsObject>,
  }
}

