// package: holdem.pb
// file: protobuf/holdem/recv_cb_room_close.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_cb_pb from "../../protobuf/holdem/define_cb_pb";

export class ServerMessageCbRoomClose extends jspb.Message {
  getReason(): protobuf_holdem_define_cb_pb.DefCB.RoomCloseReasonMap[keyof protobuf_holdem_define_cb_pb.DefCB.RoomCloseReasonMap];
  setReason(value: protobuf_holdem_define_cb_pb.DefCB.RoomCloseReasonMap[keyof protobuf_holdem_define_cb_pb.DefCB.RoomCloseReasonMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageCbRoomClose.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageCbRoomClose): ServerMessageCbRoomClose.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageCbRoomClose, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageCbRoomClose;
  static deserializeBinaryFromReader(message: ServerMessageCbRoomClose, reader: jspb.BinaryReader): ServerMessageCbRoomClose;
}

export namespace ServerMessageCbRoomClose {
  export type AsObject = {
    reason: protobuf_holdem_define_cb_pb.DefCB.RoomCloseReasonMap[keyof protobuf_holdem_define_cb_pb.DefCB.RoomCloseReasonMap],
  }
}

