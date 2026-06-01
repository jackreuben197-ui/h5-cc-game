// package: holdem.pb
// file: protobuf/holdem/recv_cb_standup_notification.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_cb_pb from "../../protobuf/holdem/define_cb_pb";

export class ServerMessageCbStandupNotification extends jspb.Message {
  getReason(): protobuf_holdem_define_cb_pb.DefCB.LeaveReasonMap[keyof protobuf_holdem_define_cb_pb.DefCB.LeaveReasonMap];
  setReason(value: protobuf_holdem_define_cb_pb.DefCB.LeaveReasonMap[keyof protobuf_holdem_define_cb_pb.DefCB.LeaveReasonMap]): void;

  getBringOut(): number;
  setBringOut(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageCbStandupNotification.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageCbStandupNotification): ServerMessageCbStandupNotification.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageCbStandupNotification, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageCbStandupNotification;
  static deserializeBinaryFromReader(message: ServerMessageCbStandupNotification, reader: jspb.BinaryReader): ServerMessageCbStandupNotification;
}

export namespace ServerMessageCbStandupNotification {
  export type AsObject = {
    reason: protobuf_holdem_define_cb_pb.DefCB.LeaveReasonMap[keyof protobuf_holdem_define_cb_pb.DefCB.LeaveReasonMap],
    bringOut: number,
  }
}

