// package: holdem.pb
// file: protobuf/holdem/req_th_sync_enter.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageSyncEnter extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageSyncEnter.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageSyncEnter): ClientMessageSyncEnter.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageSyncEnter, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageSyncEnter;
  static deserializeBinaryFromReader(message: ClientMessageSyncEnter, reader: jspb.BinaryReader): ClientMessageSyncEnter;
}

export namespace ClientMessageSyncEnter {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
  }
}

export class ServerMessageSyncEnter extends jspb.Message {
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

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageSyncEnter.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageSyncEnter): ServerMessageSyncEnter.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageSyncEnter, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageSyncEnter;
  static deserializeBinaryFromReader(message: ServerMessageSyncEnter, reader: jspb.BinaryReader): ServerMessageSyncEnter;
}

export namespace ServerMessageSyncEnter {
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
  }
}

