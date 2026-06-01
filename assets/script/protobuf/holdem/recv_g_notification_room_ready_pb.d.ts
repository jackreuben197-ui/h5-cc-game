// package: holdem.pb
// file: protobuf/holdem/recv_g_notification_room_ready.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageNotificationRoomReady extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageNotificationRoomReady.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageNotificationRoomReady): ServerMessageNotificationRoomReady.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageNotificationRoomReady, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageNotificationRoomReady;
  static deserializeBinaryFromReader(message: ServerMessageNotificationRoomReady, reader: jspb.BinaryReader): ServerMessageNotificationRoomReady;
}

export namespace ServerMessageNotificationRoomReady {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
  }
}

