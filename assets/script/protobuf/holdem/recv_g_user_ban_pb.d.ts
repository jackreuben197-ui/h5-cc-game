// package: holdem.pb
// file: protobuf/holdem/recv_g_user_ban.proto

import * as jspb from "google-protobuf";

export class ServerMessageUserBan extends jspb.Message {
  getStartTime(): number;
  setStartTime(value: number): void;

  getScheduleEndTime(): number;
  setScheduleEndTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageUserBan.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageUserBan): ServerMessageUserBan.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageUserBan, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageUserBan;
  static deserializeBinaryFromReader(message: ServerMessageUserBan, reader: jspb.BinaryReader): ServerMessageUserBan;
}

export namespace ServerMessageUserBan {
  export type AsObject = {
    startTime: number,
    scheduleEndTime: number,
  }
}

