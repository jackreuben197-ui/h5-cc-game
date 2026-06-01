// package: holdem.pb
// file: protobuf/holdem/req_mj_enter_room.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";
import * as protobuf_holdem_define_mj_pb from "../../protobuf/holdem/define_mj_pb";

export class ClientMessageMjEnterRoom extends jspb.Message {
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

  getObserver(): boolean;
  setObserver(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageMjEnterRoom.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageMjEnterRoom): ClientMessageMjEnterRoom.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageMjEnterRoom, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageMjEnterRoom;
  static deserializeBinaryFromReader(message: ClientMessageMjEnterRoom, reader: jspb.BinaryReader): ClientMessageMjEnterRoom;
}

export namespace ClientMessageMjEnterRoom {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    gps?: protobuf_holdem_define_pb.GPS.AsObject,
    wantSeat: protobuf_holdem_define_pb.Def.WantSeatTypeMap[keyof protobuf_holdem_define_pb.Def.WantSeatTypeMap],
    observer: boolean,
  }
}

export class ServerMessageMjEnterRoom extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getGameStatus(): protobuf_holdem_define_pb.Def.GameStatusMap[keyof protobuf_holdem_define_pb.Def.GameStatusMap];
  setGameStatus(value: protobuf_holdem_define_pb.Def.GameStatusMap[keyof protobuf_holdem_define_pb.Def.GameStatusMap]): void;

  hasRoomInfo(): boolean;
  clearRoomInfo(): void;
  getRoomInfo(): protobuf_holdem_define_mj_pb.RoomInfoMJ | undefined;
  setRoomInfo(value?: protobuf_holdem_define_mj_pb.RoomInfoMJ): void;

  hasMatchInfo(): boolean;
  clearMatchInfo(): void;
  getMatchInfo(): protobuf_holdem_define_mj_pb.MatchInfoMJ | undefined;
  setMatchInfo(value?: protobuf_holdem_define_mj_pb.MatchInfoMJ): void;

  clearPlayersList(): void;
  getPlayersList(): Array<protobuf_holdem_define_mj_pb.PlayerMJ>;
  setPlayersList(value: Array<protobuf_holdem_define_mj_pb.PlayerMJ>): void;
  addPlayers(value?: protobuf_holdem_define_mj_pb.PlayerMJ, index?: number): protobuf_holdem_define_mj_pb.PlayerMJ;

  hasMyInfo(): boolean;
  clearMyInfo(): void;
  getMyInfo(): protobuf_holdem_define_mj_pb.MyGameInfoMJ | undefined;
  setMyInfo(value?: protobuf_holdem_define_mj_pb.MyGameInfoMJ): void;

  clearOperatorList(): void;
  getOperatorList(): Array<protobuf_holdem_define_mj_pb.OperatorMJ>;
  setOperatorList(value: Array<protobuf_holdem_define_mj_pb.OperatorMJ>): void;
  addOperator(value?: protobuf_holdem_define_mj_pb.OperatorMJ, index?: number): protobuf_holdem_define_mj_pb.OperatorMJ;

  getMuted(): boolean;
  setMuted(value: boolean): void;

  hasMyWheelInfo(): boolean;
  clearMyWheelInfo(): void;
  getMyWheelInfo(): protobuf_holdem_define_pb.MyWheelInfo | undefined;
  setMyWheelInfo(value?: protobuf_holdem_define_pb.MyWheelInfo): void;

  hasMttRoom(): boolean;
  clearMttRoom(): void;
  getMttRoom(): protobuf_holdem_define_pb.Room | undefined;
  setMttRoom(value?: protobuf_holdem_define_pb.Room): void;

  hasMttInfo(): boolean;
  clearMttInfo(): void;
  getMttInfo(): protobuf_holdem_define_pb.MTTInfo | undefined;
  setMttInfo(value?: protobuf_holdem_define_pb.MTTInfo): void;

  getPayTimes(): number;
  setPayTimes(value: number): void;

  hasBlackInfo(): boolean;
  clearBlackInfo(): void;
  getBlackInfo(): protobuf_holdem_define_pb.BlackInfo | undefined;
  setBlackInfo(value?: protobuf_holdem_define_pb.BlackInfo): void;

  hasMttProgress(): boolean;
  clearMttProgress(): void;
  getMttProgress(): protobuf_holdem_define_pb.MTTProgress | undefined;
  setMttProgress(value?: protobuf_holdem_define_pb.MTTProgress): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjEnterRoom.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjEnterRoom): ServerMessageMjEnterRoom.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjEnterRoom, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjEnterRoom;
  static deserializeBinaryFromReader(message: ServerMessageMjEnterRoom, reader: jspb.BinaryReader): ServerMessageMjEnterRoom;
}

export namespace ServerMessageMjEnterRoom {
  export type AsObject = {
    status: number,
    gameStatus: protobuf_holdem_define_pb.Def.GameStatusMap[keyof protobuf_holdem_define_pb.Def.GameStatusMap],
    roomInfo?: protobuf_holdem_define_mj_pb.RoomInfoMJ.AsObject,
    matchInfo?: protobuf_holdem_define_mj_pb.MatchInfoMJ.AsObject,
    playersList: Array<protobuf_holdem_define_mj_pb.PlayerMJ.AsObject>,
    myInfo?: protobuf_holdem_define_mj_pb.MyGameInfoMJ.AsObject,
    operatorList: Array<protobuf_holdem_define_mj_pb.OperatorMJ.AsObject>,
    muted: boolean,
    myWheelInfo?: protobuf_holdem_define_pb.MyWheelInfo.AsObject,
    mttRoom?: protobuf_holdem_define_pb.Room.AsObject,
    mttInfo?: protobuf_holdem_define_pb.MTTInfo.AsObject,
    payTimes: number,
    blackInfo?: protobuf_holdem_define_pb.BlackInfo.AsObject,
    mttProgress?: protobuf_holdem_define_pb.MTTProgress.AsObject,
  }
}

