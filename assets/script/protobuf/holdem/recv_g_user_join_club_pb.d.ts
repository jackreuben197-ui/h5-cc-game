// package: holdem.pb
// file: protobuf/holdem/recv_g_user_join_club.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageUserJoinClub extends jspb.Message {
  getUserId(): number;
  setUserId(value: number): void;

  getClubId(): number;
  setClubId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageUserJoinClub.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageUserJoinClub): ServerMessageUserJoinClub.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageUserJoinClub, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageUserJoinClub;
  static deserializeBinaryFromReader(message: ServerMessageUserJoinClub, reader: jspb.BinaryReader): ServerMessageUserJoinClub;
}

export namespace ServerMessageUserJoinClub {
  export type AsObject = {
    userId: number,
    clubId: number,
  }
}

