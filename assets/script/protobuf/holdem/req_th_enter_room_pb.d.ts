// package: holdem.pb
// file: protobuf/holdem/req_th_enter_room.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageEnterRoom extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  hasGps(): boolean;
  clearGps(): void;
  getGps(): protobuf_holdem_define_pb.GPS | undefined;
  setGps(value?: protobuf_holdem_define_pb.GPS): void;

  getMttPartialBringIn(): number;
  setMttPartialBringIn(value: number): void;

  getObserver(): boolean;
  setObserver(value: boolean): void;

  getWantSeat(): protobuf_holdem_define_pb.Def.WantSeatTypeMap[keyof protobuf_holdem_define_pb.Def.WantSeatTypeMap];
  setWantSeat(value: protobuf_holdem_define_pb.Def.WantSeatTypeMap[keyof protobuf_holdem_define_pb.Def.WantSeatTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageEnterRoom.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageEnterRoom): ClientMessageEnterRoom.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageEnterRoom, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageEnterRoom;
  static deserializeBinaryFromReader(message: ClientMessageEnterRoom, reader: jspb.BinaryReader): ClientMessageEnterRoom;
}

export namespace ClientMessageEnterRoom {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    gps?: protobuf_holdem_define_pb.GPS.AsObject,
    mttPartialBringIn: number,
    observer: boolean,
    wantSeat: protobuf_holdem_define_pb.Def.WantSeatTypeMap[keyof protobuf_holdem_define_pb.Def.WantSeatTypeMap],
  }
}

export class ServerMessageEnterRoom extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getGameStatus(): protobuf_holdem_define_pb.Def.GameStatusMap[keyof protobuf_holdem_define_pb.Def.GameStatusMap];
  setGameStatus(value: protobuf_holdem_define_pb.Def.GameStatusMap[keyof protobuf_holdem_define_pb.Def.GameStatusMap]): void;

  hasRoomInfo(): boolean;
  clearRoomInfo(): void;
  getRoomInfo(): protobuf_holdem_define_pb.RoomInfo | undefined;
  setRoomInfo(value?: protobuf_holdem_define_pb.RoomInfo): void;

  hasHandInfo(): boolean;
  clearHandInfo(): void;
  getHandInfo(): protobuf_holdem_define_pb.HandInfo | undefined;
  setHandInfo(value?: protobuf_holdem_define_pb.HandInfo): void;

  clearPlayersList(): void;
  getPlayersList(): Array<protobuf_holdem_define_pb.Player>;
  setPlayersList(value: Array<protobuf_holdem_define_pb.Player>): void;
  addPlayers(value?: protobuf_holdem_define_pb.Player, index?: number): protobuf_holdem_define_pb.Player;

  hasMyInfo(): boolean;
  clearMyInfo(): void;
  getMyInfo(): protobuf_holdem_define_pb.MyGameInfo | undefined;
  setMyInfo(value?: protobuf_holdem_define_pb.MyGameInfo): void;

  clearOperatorList(): void;
  getOperatorList(): Array<protobuf_holdem_define_pb.Operator>;
  setOperatorList(value: Array<protobuf_holdem_define_pb.Operator>): void;
  addOperator(value?: protobuf_holdem_define_pb.Operator, index?: number): protobuf_holdem_define_pb.Operator;

  hasMttInfo(): boolean;
  clearMttInfo(): void;
  getMttInfo(): protobuf_holdem_define_pb.MTTInfo | undefined;
  setMttInfo(value?: protobuf_holdem_define_pb.MTTInfo): void;

  hasMttProgress(): boolean;
  clearMttProgress(): void;
  getMttProgress(): protobuf_holdem_define_pb.MTTProgress | undefined;
  setMttProgress(value?: protobuf_holdem_define_pb.MTTProgress): void;

  hasMttRoom(): boolean;
  clearMttRoom(): void;
  getMttRoom(): protobuf_holdem_define_pb.Room | undefined;
  setMttRoom(value?: protobuf_holdem_define_pb.Room): void;

  getMuted(): boolean;
  setMuted(value: boolean): void;

  getPayTimes(): number;
  setPayTimes(value: number): void;

  hasMyWheelInfo(): boolean;
  clearMyWheelInfo(): void;
  getMyWheelInfo(): protobuf_holdem_define_pb.MyWheelInfo | undefined;
  setMyWheelInfo(value?: protobuf_holdem_define_pb.MyWheelInfo): void;

  hasBlackInfo(): boolean;
  clearBlackInfo(): void;
  getBlackInfo(): protobuf_holdem_define_pb.BlackInfo | undefined;
  setBlackInfo(value?: protobuf_holdem_define_pb.BlackInfo): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageEnterRoom.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageEnterRoom): ServerMessageEnterRoom.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageEnterRoom, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageEnterRoom;
  static deserializeBinaryFromReader(message: ServerMessageEnterRoom, reader: jspb.BinaryReader): ServerMessageEnterRoom;
}

export namespace ServerMessageEnterRoom {
  export type AsObject = {
    status: number,
    gameStatus: protobuf_holdem_define_pb.Def.GameStatusMap[keyof protobuf_holdem_define_pb.Def.GameStatusMap],
    roomInfo?: protobuf_holdem_define_pb.RoomInfo.AsObject,
    handInfo?: protobuf_holdem_define_pb.HandInfo.AsObject,
    playersList: Array<protobuf_holdem_define_pb.Player.AsObject>,
    myInfo?: protobuf_holdem_define_pb.MyGameInfo.AsObject,
    operatorList: Array<protobuf_holdem_define_pb.Operator.AsObject>,
    mttInfo?: protobuf_holdem_define_pb.MTTInfo.AsObject,
    mttProgress?: protobuf_holdem_define_pb.MTTProgress.AsObject,
    mttRoom?: protobuf_holdem_define_pb.Room.AsObject,
    muted: boolean,
    payTimes: number,
    myWheelInfo?: protobuf_holdem_define_pb.MyWheelInfo.AsObject,
    blackInfo?: protobuf_holdem_define_pb.BlackInfo.AsObject,
  }
}

