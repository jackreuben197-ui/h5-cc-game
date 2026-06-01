// package: holdem.pb
// file: protobuf/holdem/recv_g_admin_room_user_standup.proto

import * as jspb from "google-protobuf";

export class ServerMessageAdminRoomUserStandup extends jspb.Message {
  getRoomId(): number;
  setRoomId(value: number): void;

  getUserId(): number;
  setUserId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageAdminRoomUserStandup.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageAdminRoomUserStandup): ServerMessageAdminRoomUserStandup.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageAdminRoomUserStandup, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageAdminRoomUserStandup;
  static deserializeBinaryFromReader(message: ServerMessageAdminRoomUserStandup, reader: jspb.BinaryReader): ServerMessageAdminRoomUserStandup;
}

export namespace ServerMessageAdminRoomUserStandup {
  export type AsObject = {
    roomId: number,
    userId: number,
  }
}

