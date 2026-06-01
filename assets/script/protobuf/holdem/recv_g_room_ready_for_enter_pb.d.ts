// package: holdem.pb
// file: protobuf/holdem/recv_g_room_ready_for_enter.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageRoomReadyForEnter extends jspb.Message {
  getRoomId(): number;
  setRoomId(value: number): void;

  getAnte(): number;
  setAnte(value: number): void;

  getSmallBlind(): number;
  setSmallBlind(value: number): void;

  getGameType(): protobuf_holdem_define_pb.Def.GameTypeMap[keyof protobuf_holdem_define_pb.Def.GameTypeMap];
  setGameType(value: protobuf_holdem_define_pb.Def.GameTypeMap[keyof protobuf_holdem_define_pb.Def.GameTypeMap]): void;

  getPokerType(): protobuf_holdem_define_pb.Def.PokerTypeMap[keyof protobuf_holdem_define_pb.Def.PokerTypeMap];
  setPokerType(value: protobuf_holdem_define_pb.Def.PokerTypeMap[keyof protobuf_holdem_define_pb.Def.PokerTypeMap]): void;

  getLimitBetType(): protobuf_holdem_define_pb.Def.LimitBetTypeMap[keyof protobuf_holdem_define_pb.Def.LimitBetTypeMap];
  setLimitBetType(value: protobuf_holdem_define_pb.Def.LimitBetTypeMap[keyof protobuf_holdem_define_pb.Def.LimitBetTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageRoomReadyForEnter.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageRoomReadyForEnter): ServerMessageRoomReadyForEnter.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageRoomReadyForEnter, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageRoomReadyForEnter;
  static deserializeBinaryFromReader(message: ServerMessageRoomReadyForEnter, reader: jspb.BinaryReader): ServerMessageRoomReadyForEnter;
}

export namespace ServerMessageRoomReadyForEnter {
  export type AsObject = {
    roomId: number,
    ante: number,
    smallBlind: number,
    gameType: protobuf_holdem_define_pb.Def.GameTypeMap[keyof protobuf_holdem_define_pb.Def.GameTypeMap],
    pokerType: protobuf_holdem_define_pb.Def.PokerTypeMap[keyof protobuf_holdem_define_pb.Def.PokerTypeMap],
    limitBetType: protobuf_holdem_define_pb.Def.LimitBetTypeMap[keyof protobuf_holdem_define_pb.Def.LimitBetTypeMap],
  }
}

