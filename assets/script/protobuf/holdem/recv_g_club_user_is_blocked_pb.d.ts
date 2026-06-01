// package: holdem.pb
// file: protobuf/holdem/recv_g_club_user_is_blocked.proto

import * as jspb from "google-protobuf";

export class ServerMessageClubUserIsBlocked extends jspb.Message {
  getCode(): number;
  setCode(value: number): void;

  getData(): string;
  setData(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageClubUserIsBlocked.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageClubUserIsBlocked): ServerMessageClubUserIsBlocked.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageClubUserIsBlocked, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageClubUserIsBlocked;
  static deserializeBinaryFromReader(message: ServerMessageClubUserIsBlocked, reader: jspb.BinaryReader): ServerMessageClubUserIsBlocked;
}

export namespace ServerMessageClubUserIsBlocked {
  export type AsObject = {
    code: number,
    data: string,
  }
}

