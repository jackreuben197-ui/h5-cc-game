// package: holdem.pb
// file: protobuf/holdem/req_gd_enter_room.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";
import * as protobuf_holdem_define_gd_pb from "../../protobuf/holdem/define_gd_pb";

export class ClientMessageGdEnterRoom extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  hasGps(): boolean;
  clearGps(): void;
  getGps(): protobuf_holdem_define_pb.GPS | undefined;
  setGps(value?: protobuf_holdem_define_pb.GPS): void;

  getWantSeat(): protobuf_holdem_define_pb.Def.WantSeatTypeMap[keyof protobuf_holdem_define_pb.Def.WantSeatTypeMap];
  setWantSeat(value: protobuf_holdem_define_pb.Def.WantSeatTypeMap[keyof protobuf_holdem_define_pb.Def.WantSeatTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageGdEnterRoom.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageGdEnterRoom): ClientMessageGdEnterRoom.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageGdEnterRoom, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageGdEnterRoom;
  static deserializeBinaryFromReader(message: ClientMessageGdEnterRoom, reader: jspb.BinaryReader): ClientMessageGdEnterRoom;
}

export namespace ClientMessageGdEnterRoom {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    gps?: protobuf_holdem_define_pb.GPS.AsObject,
    wantSeat: protobuf_holdem_define_pb.Def.WantSeatTypeMap[keyof protobuf_holdem_define_pb.Def.WantSeatTypeMap],
  }
}

export class ServerMessageGdEnterRoom extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getGameStatus(): protobuf_holdem_define_pb.Def.GameStatusMap[keyof protobuf_holdem_define_pb.Def.GameStatusMap];
  setGameStatus(value: protobuf_holdem_define_pb.Def.GameStatusMap[keyof protobuf_holdem_define_pb.Def.GameStatusMap]): void;

  hasRoomInfo(): boolean;
  clearRoomInfo(): void;
  getRoomInfo(): protobuf_holdem_define_gd_pb.RoomInfoGD | undefined;
  setRoomInfo(value?: protobuf_holdem_define_gd_pb.RoomInfoGD): void;

  hasMatchInfo(): boolean;
  clearMatchInfo(): void;
  getMatchInfo(): protobuf_holdem_define_gd_pb.MatchInfoGD | undefined;
  setMatchInfo(value?: protobuf_holdem_define_gd_pb.MatchInfoGD): void;

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

  hasMyWheelInfo(): boolean;
  clearMyWheelInfo(): void;
  getMyWheelInfo(): protobuf_holdem_define_pb.MyWheelInfo | undefined;
  setMyWheelInfo(value?: protobuf_holdem_define_pb.MyWheelInfo): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdEnterRoom.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdEnterRoom): ServerMessageGdEnterRoom.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdEnterRoom, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdEnterRoom;
  static deserializeBinaryFromReader(message: ServerMessageGdEnterRoom, reader: jspb.BinaryReader): ServerMessageGdEnterRoom;
}

export namespace ServerMessageGdEnterRoom {
  export type AsObject = {
    status: number,
    gameStatus: protobuf_holdem_define_pb.Def.GameStatusMap[keyof protobuf_holdem_define_pb.Def.GameStatusMap],
    roomInfo?: protobuf_holdem_define_gd_pb.RoomInfoGD.AsObject,
    matchInfo?: protobuf_holdem_define_gd_pb.MatchInfoGD.AsObject,
    playersList: Array<protobuf_holdem_define_gd_pb.PlayerGD.AsObject>,
    myInfo?: protobuf_holdem_define_gd_pb.MyGameInfoGD.AsObject,
    operatorList: Array<protobuf_holdem_define_gd_pb.OperatorGD.AsObject>,
    muted: boolean,
    resultsList: Array<protobuf_holdem_define_gd_pb.ResultGD.AsObject>,
    myWheelInfo?: protobuf_holdem_define_pb.MyWheelInfo.AsObject,
  }
}

