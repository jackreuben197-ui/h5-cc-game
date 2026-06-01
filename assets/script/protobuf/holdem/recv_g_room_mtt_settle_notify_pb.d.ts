// package: holdem.pb
// file: protobuf/holdem/recv_g_room_mtt_settle_notify.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageRoomMttSettleNotify extends jspb.Message {
  getRoomId(): number;
  setRoomId(value: number): void;

  getMatchId(): number;
  setMatchId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageRoomMttSettleNotify.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageRoomMttSettleNotify): ServerMessageRoomMttSettleNotify.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageRoomMttSettleNotify, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageRoomMttSettleNotify;
  static deserializeBinaryFromReader(message: ServerMessageRoomMttSettleNotify, reader: jspb.BinaryReader): ServerMessageRoomMttSettleNotify;
}

export namespace ServerMessageRoomMttSettleNotify {
  export type AsObject = {
    roomId: number,
    matchId: number,
  }
}

