// package: holdem.pb
// file: protobuf/holdem/recv_g_notification_system_maintain.proto

import * as jspb from "google-protobuf";

export class ServerMessageNotificationSystemMaintain extends jspb.Message {
  getStartTime(): number;
  setStartTime(value: number): void;

  getScheduleEndTime(): number;
  setScheduleEndTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageNotificationSystemMaintain.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageNotificationSystemMaintain): ServerMessageNotificationSystemMaintain.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageNotificationSystemMaintain, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageNotificationSystemMaintain;
  static deserializeBinaryFromReader(message: ServerMessageNotificationSystemMaintain, reader: jspb.BinaryReader): ServerMessageNotificationSystemMaintain;
}

export namespace ServerMessageNotificationSystemMaintain {
  export type AsObject = {
    startTime: number,
    scheduleEndTime: number,
  }
}

