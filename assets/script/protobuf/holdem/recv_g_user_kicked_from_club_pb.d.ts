// package: holdem.pb
// file: protobuf/holdem/recv_g_user_kicked_from_club.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageUserKickedFromClub extends jspb.Message {
  getKickedTime(): number;
  setKickedTime(value: number): void;

  getClubId(): number;
  setClubId(value: number): void;

  getReason(): protobuf_holdem_define_pb.Def.UserQuitClubReasonMap[keyof protobuf_holdem_define_pb.Def.UserQuitClubReasonMap];
  setReason(value: protobuf_holdem_define_pb.Def.UserQuitClubReasonMap[keyof protobuf_holdem_define_pb.Def.UserQuitClubReasonMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageUserKickedFromClub.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageUserKickedFromClub): ServerMessageUserKickedFromClub.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageUserKickedFromClub, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageUserKickedFromClub;
  static deserializeBinaryFromReader(message: ServerMessageUserKickedFromClub, reader: jspb.BinaryReader): ServerMessageUserKickedFromClub;
}

export namespace ServerMessageUserKickedFromClub {
  export type AsObject = {
    kickedTime: number,
    clubId: number,
    reason: protobuf_holdem_define_pb.Def.UserQuitClubReasonMap[keyof protobuf_holdem_define_pb.Def.UserQuitClubReasonMap],
  }
}

