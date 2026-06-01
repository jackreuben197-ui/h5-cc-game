// package: holdem.pb
// file: protobuf/holdem/recv_g_admin_room_user_leave.proto

import * as jspb from "google-protobuf";

export class ServerMessageAdminRoomUserLeave extends jspb.Message {
  getRoomId(): number;
  setRoomId(value: number): void;

  getUserId(): number;
  setUserId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageAdminRoomUserLeave.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageAdminRoomUserLeave): ServerMessageAdminRoomUserLeave.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageAdminRoomUserLeave, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageAdminRoomUserLeave;
  static deserializeBinaryFromReader(message: ServerMessageAdminRoomUserLeave, reader: jspb.BinaryReader): ServerMessageAdminRoomUserLeave;
}

export namespace ServerMessageAdminRoomUserLeave {
  export type AsObject = {
    roomId: number,
    userId: number,
  }
}

