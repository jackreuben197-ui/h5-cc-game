// package: holdem.pb
// file: protobuf/holdem/recv_g_friend_room_bring_in_apply_to_user.proto

import * as jspb from "google-protobuf";

export class ServerMessageFriendRoomBringInApplyToUser extends jspb.Message {
  getRoomId(): number;
  setRoomId(value: number): void;

  getUserId(): number;
  setUserId(value: number): void;

  getBringIn(): number;
  setBringIn(value: number): void;

  getStatus(): number;
  setStatus(value: number): void;

  getClubId(): number;
  setClubId(value: number): void;

  getOriginType(): number;
  setOriginType(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFriendRoomBringInApplyToUser.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFriendRoomBringInApplyToUser): ServerMessageFriendRoomBringInApplyToUser.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFriendRoomBringInApplyToUser, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFriendRoomBringInApplyToUser;
  static deserializeBinaryFromReader(message: ServerMessageFriendRoomBringInApplyToUser, reader: jspb.BinaryReader): ServerMessageFriendRoomBringInApplyToUser;
}

export namespace ServerMessageFriendRoomBringInApplyToUser {
  export type AsObject = {
    roomId: number,
    userId: number,
    bringIn: number,
    status: number,
    clubId: number,
    originType: number,
  }
}

