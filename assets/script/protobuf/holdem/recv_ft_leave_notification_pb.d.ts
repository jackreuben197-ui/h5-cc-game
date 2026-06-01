// package: holdem.pb
// file: protobuf/holdem/recv_ft_leave_notification.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageFtLeaveNotification extends jspb.Message {
  getReason(): protobuf_holdem_define_pb.Def.LeaveReasonMap[keyof protobuf_holdem_define_pb.Def.LeaveReasonMap];
  setReason(value: protobuf_holdem_define_pb.Def.LeaveReasonMap[keyof protobuf_holdem_define_pb.Def.LeaveReasonMap]): void;

  getChip(): number;
  setChip(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtLeaveNotification.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtLeaveNotification): ServerMessageFtLeaveNotification.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtLeaveNotification, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtLeaveNotification;
  static deserializeBinaryFromReader(message: ServerMessageFtLeaveNotification, reader: jspb.BinaryReader): ServerMessageFtLeaveNotification;
}

export namespace ServerMessageFtLeaveNotification {
  export type AsObject = {
    reason: protobuf_holdem_define_pb.Def.LeaveReasonMap[keyof protobuf_holdem_define_pb.Def.LeaveReasonMap],
    chip: number,
  }
}

