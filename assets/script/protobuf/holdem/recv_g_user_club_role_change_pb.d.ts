// package: holdem.pb
// file: protobuf/holdem/recv_g_user_club_role_change.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageUserClubRoleChange extends jspb.Message {
  getUserId(): number;
  setUserId(value: number): void;

  getClubId(): number;
  setClubId(value: number): void;

  getUserLevel(): number;
  setUserLevel(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageUserClubRoleChange.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageUserClubRoleChange): ServerMessageUserClubRoleChange.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageUserClubRoleChange, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageUserClubRoleChange;
  static deserializeBinaryFromReader(message: ServerMessageUserClubRoleChange, reader: jspb.BinaryReader): ServerMessageUserClubRoleChange;
}

export namespace ServerMessageUserClubRoleChange {
  export type AsObject = {
    userId: number,
    clubId: number,
    userLevel: number,
  }
}

