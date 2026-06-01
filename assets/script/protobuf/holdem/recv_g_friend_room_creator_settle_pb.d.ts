// package: holdem.pb
// file: protobuf/holdem/recv_g_friend_room_creator_settle.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageFriendRoomCreatorSettle extends jspb.Message {
  getRoomId(): number;
  setRoomId(value: number): void;

  getMatchId(): number;
  setMatchId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFriendRoomCreatorSettle.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFriendRoomCreatorSettle): ServerMessageFriendRoomCreatorSettle.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFriendRoomCreatorSettle, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFriendRoomCreatorSettle;
  static deserializeBinaryFromReader(message: ServerMessageFriendRoomCreatorSettle, reader: jspb.BinaryReader): ServerMessageFriendRoomCreatorSettle;
}

export namespace ServerMessageFriendRoomCreatorSettle {
  export type AsObject = {
    roomId: number,
    matchId: number,
  }
}

