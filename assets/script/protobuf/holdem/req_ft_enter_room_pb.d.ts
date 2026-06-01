// package: holdem.pb
// file: protobuf/holdem/req_ft_enter_room.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";
import * as protobuf_holdem_define_ft_pb from "../../protobuf/holdem/define_ft_pb";

export class ClientMessageFtEnterRoom extends jspb.Message {
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
  toObject(includeInstance?: boolean): ClientMessageFtEnterRoom.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageFtEnterRoom): ClientMessageFtEnterRoom.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageFtEnterRoom, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageFtEnterRoom;
  static deserializeBinaryFromReader(message: ClientMessageFtEnterRoom, reader: jspb.BinaryReader): ClientMessageFtEnterRoom;
}

export namespace ClientMessageFtEnterRoom {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    gps?: protobuf_holdem_define_pb.GPS.AsObject,
    wantSeat: protobuf_holdem_define_pb.Def.WantSeatTypeMap[keyof protobuf_holdem_define_pb.Def.WantSeatTypeMap],
  }
}

export class ServerMessageFtEnterRoom extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getGameStatus(): protobuf_holdem_define_pb.Def.GameStatusMap[keyof protobuf_holdem_define_pb.Def.GameStatusMap];
  setGameStatus(value: protobuf_holdem_define_pb.Def.GameStatusMap[keyof protobuf_holdem_define_pb.Def.GameStatusMap]): void;

  hasRoomInfo(): boolean;
  clearRoomInfo(): void;
  getRoomInfo(): protobuf_holdem_define_ft_pb.RoomInfoFT | undefined;
  setRoomInfo(value?: protobuf_holdem_define_ft_pb.RoomInfoFT): void;

  hasHandInfo(): boolean;
  clearHandInfo(): void;
  getHandInfo(): protobuf_holdem_define_ft_pb.HandInfoFT | undefined;
  setHandInfo(value?: protobuf_holdem_define_ft_pb.HandInfoFT): void;

  clearPlayersList(): void;
  getPlayersList(): Array<protobuf_holdem_define_ft_pb.PlayerFT>;
  setPlayersList(value: Array<protobuf_holdem_define_ft_pb.PlayerFT>): void;
  addPlayers(value?: protobuf_holdem_define_ft_pb.PlayerFT, index?: number): protobuf_holdem_define_ft_pb.PlayerFT;

  hasMyInfo(): boolean;
  clearMyInfo(): void;
  getMyInfo(): protobuf_holdem_define_ft_pb.MyGameInfoFT | undefined;
  setMyInfo(value?: protobuf_holdem_define_ft_pb.MyGameInfoFT): void;

  clearOperatorList(): void;
  getOperatorList(): Array<protobuf_holdem_define_ft_pb.OperatorFT>;
  setOperatorList(value: Array<protobuf_holdem_define_ft_pb.OperatorFT>): void;
  addOperator(value?: protobuf_holdem_define_ft_pb.OperatorFT, index?: number): protobuf_holdem_define_ft_pb.OperatorFT;

  getMuted(): boolean;
  setMuted(value: boolean): void;

  hasMyWheelInfo(): boolean;
  clearMyWheelInfo(): void;
  getMyWheelInfo(): protobuf_holdem_define_pb.MyWheelInfo | undefined;
  setMyWheelInfo(value?: protobuf_holdem_define_pb.MyWheelInfo): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtEnterRoom.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtEnterRoom): ServerMessageFtEnterRoom.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtEnterRoom, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtEnterRoom;
  static deserializeBinaryFromReader(message: ServerMessageFtEnterRoom, reader: jspb.BinaryReader): ServerMessageFtEnterRoom;
}

export namespace ServerMessageFtEnterRoom {
  export type AsObject = {
    status: number,
    gameStatus: protobuf_holdem_define_pb.Def.GameStatusMap[keyof protobuf_holdem_define_pb.Def.GameStatusMap],
    roomInfo?: protobuf_holdem_define_ft_pb.RoomInfoFT.AsObject,
    handInfo?: protobuf_holdem_define_ft_pb.HandInfoFT.AsObject,
    playersList: Array<protobuf_holdem_define_ft_pb.PlayerFT.AsObject>,
    myInfo?: protobuf_holdem_define_ft_pb.MyGameInfoFT.AsObject,
    operatorList: Array<protobuf_holdem_define_ft_pb.OperatorFT.AsObject>,
    muted: boolean,
    myWheelInfo?: protobuf_holdem_define_pb.MyWheelInfo.AsObject,
  }
}

