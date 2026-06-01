// package: holdem.pb
// file: protobuf/holdem/recv_th_leave_notification.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageLeaveNotification extends jspb.Message {
  getReason(): protobuf_holdem_define_pb.Def.LeaveReasonMap[keyof protobuf_holdem_define_pb.Def.LeaveReasonMap];
  setReason(value: protobuf_holdem_define_pb.Def.LeaveReasonMap[keyof protobuf_holdem_define_pb.Def.LeaveReasonMap]): void;

  getChip(): number;
  setChip(value: number): void;

  getAccountChips(): number;
  setAccountChips(value: number): void;

  getStoreChips(): number;
  setStoreChips(value: number): void;

  getRebuyTimes(): number;
  setRebuyTimes(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageLeaveNotification.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageLeaveNotification): ServerMessageLeaveNotification.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageLeaveNotification, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageLeaveNotification;
  static deserializeBinaryFromReader(message: ServerMessageLeaveNotification, reader: jspb.BinaryReader): ServerMessageLeaveNotification;
}

export namespace ServerMessageLeaveNotification {
  export type AsObject = {
    reason: protobuf_holdem_define_pb.Def.LeaveReasonMap[keyof protobuf_holdem_define_pb.Def.LeaveReasonMap],
    chip: number,
    accountChips: number,
    storeChips: number,
    rebuyTimes: number,
  }
}

