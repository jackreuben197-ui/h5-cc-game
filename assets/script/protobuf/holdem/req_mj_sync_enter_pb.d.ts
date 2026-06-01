// package: holdem.pb
// file: protobuf/holdem/req_mj_sync_enter.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";
import * as protobuf_holdem_define_mj_pb from "../../protobuf/holdem/define_mj_pb";

export class ClientMessageMjSyncEnter extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageMjSyncEnter.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageMjSyncEnter): ClientMessageMjSyncEnter.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageMjSyncEnter, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageMjSyncEnter;
  static deserializeBinaryFromReader(message: ClientMessageMjSyncEnter, reader: jspb.BinaryReader): ClientMessageMjSyncEnter;
}

export namespace ClientMessageMjSyncEnter {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
  }
}

export class ServerMessageMjSyncEnter extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getGameStatus(): protobuf_holdem_define_pb.Def.GameStatusMap[keyof protobuf_holdem_define_pb.Def.GameStatusMap];
  setGameStatus(value: protobuf_holdem_define_pb.Def.GameStatusMap[keyof protobuf_holdem_define_pb.Def.GameStatusMap]): void;

  hasRoomInfo(): boolean;
  clearRoomInfo(): void;
  getRoomInfo(): protobuf_holdem_define_mj_pb.RoomInfoMJ | undefined;
  setRoomInfo(value?: protobuf_holdem_define_mj_pb.RoomInfoMJ): void;

  hasHandInfo(): boolean;
  clearHandInfo(): void;
  getHandInfo(): protobuf_holdem_define_mj_pb.MatchInfoMJ | undefined;
  setHandInfo(value?: protobuf_holdem_define_mj_pb.MatchInfoMJ): void;

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
  toObject(includeInstance?: boolean): ServerMessageMjSyncEnter.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjSyncEnter): ServerMessageMjSyncEnter.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjSyncEnter, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjSyncEnter;
  static deserializeBinaryFromReader(message: ServerMessageMjSyncEnter, reader: jspb.BinaryReader): ServerMessageMjSyncEnter;
}

export namespace ServerMessageMjSyncEnter {
  export type AsObject = {
    status: number,
    gameStatus: protobuf_holdem_define_pb.Def.GameStatusMap[keyof protobuf_holdem_define_pb.Def.GameStatusMap],
    roomInfo?: protobuf_holdem_define_mj_pb.RoomInfoMJ.AsObject,
    handInfo?: protobuf_holdem_define_mj_pb.MatchInfoMJ.AsObject,
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

