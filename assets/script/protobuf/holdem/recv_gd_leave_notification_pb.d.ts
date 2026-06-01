// package: holdem.pb
// file: protobuf/holdem/recv_gd_leave_notification.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageGdLeaveNotification extends jspb.Message {
  getReason(): protobuf_holdem_define_pb.Def.LeaveReasonMap[keyof protobuf_holdem_define_pb.Def.LeaveReasonMap];
  setReason(value: protobuf_holdem_define_pb.Def.LeaveReasonMap[keyof protobuf_holdem_define_pb.Def.LeaveReasonMap]): void;

  getChip(): number;
  setChip(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdLeaveNotification.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdLeaveNotification): ServerMessageGdLeaveNotification.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdLeaveNotification, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdLeaveNotification;
  static deserializeBinaryFromReader(message: ServerMessageGdLeaveNotification, reader: jspb.BinaryReader): ServerMessageGdLeaveNotification;
}

export namespace ServerMessageGdLeaveNotification {
  export type AsObject = {
    reason: protobuf_holdem_define_pb.Def.LeaveReasonMap[keyof protobuf_holdem_define_pb.Def.LeaveReasonMap],
    chip: number,
  }
}

