// package: holdem.pb
// file: protobuf/holdem/recv_g_notification_mtt_will_start.proto

import * as jspb from "google-protobuf";

export class ServerMessageNotificationMttWillStart extends jspb.Message {
  getMatchId(): number;
  setMatchId(value: number): void;

  getMatchName(): string;
  setMatchName(value: string): void;

  getStartTime(): number;
  setStartTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageNotificationMttWillStart.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageNotificationMttWillStart): ServerMessageNotificationMttWillStart.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageNotificationMttWillStart, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageNotificationMttWillStart;
  static deserializeBinaryFromReader(message: ServerMessageNotificationMttWillStart, reader: jspb.BinaryReader): ServerMessageNotificationMttWillStart;
}

export namespace ServerMessageNotificationMttWillStart {
  export type AsObject = {
    matchId: number,
    matchName: string,
    startTime: number,
  }
}

