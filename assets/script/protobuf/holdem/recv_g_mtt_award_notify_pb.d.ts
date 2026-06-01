// package: holdem.pb
// file: protobuf/holdem/recv_g_mtt_award_notify.proto

import * as jspb from "google-protobuf";

export class ServerMessageMttAwardNotify extends jspb.Message {
  getMatchId(): number;
  setMatchId(value: number): void;

  getMatchName(): string;
  setMatchName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMttAwardNotify.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMttAwardNotify): ServerMessageMttAwardNotify.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMttAwardNotify, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMttAwardNotify;
  static deserializeBinaryFromReader(message: ServerMessageMttAwardNotify, reader: jspb.BinaryReader): ServerMessageMttAwardNotify;
}

export namespace ServerMessageMttAwardNotify {
  export type AsObject = {
    matchId: number,
    matchName: string,
  }
}

