// package: holdem.pb
// file: protobuf/holdem/recv_g_club_room_mtt_settle_notify.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageClubRoomMttSettleNotify extends jspb.Message {
  getRoomId(): number;
  setRoomId(value: number): void;

  getMatchId(): number;
  setMatchId(value: number): void;

  getClubId(): number;
  setClubId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageClubRoomMttSettleNotify.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageClubRoomMttSettleNotify): ServerMessageClubRoomMttSettleNotify.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageClubRoomMttSettleNotify, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageClubRoomMttSettleNotify;
  static deserializeBinaryFromReader(message: ServerMessageClubRoomMttSettleNotify, reader: jspb.BinaryReader): ServerMessageClubRoomMttSettleNotify;
}

export namespace ServerMessageClubRoomMttSettleNotify {
  export type AsObject = {
    roomId: number,
    matchId: number,
    clubId: number,
  }
}

