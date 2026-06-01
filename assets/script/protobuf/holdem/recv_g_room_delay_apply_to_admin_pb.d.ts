// package: holdem.pb
// file: protobuf/holdem/recv_g_room_delay_apply_to_admin.proto

import * as jspb from "google-protobuf";

export class ServerMessageRoomDelayApplyToAdmin extends jspb.Message {
  getRoomId(): number;
  setRoomId(value: number): void;

  getUserId(): number;
  setUserId(value: number): void;

  getStatus(): number;
  setStatus(value: number): void;

  getOriginType(): number;
  setOriginType(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageRoomDelayApplyToAdmin.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageRoomDelayApplyToAdmin): ServerMessageRoomDelayApplyToAdmin.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageRoomDelayApplyToAdmin, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageRoomDelayApplyToAdmin;
  static deserializeBinaryFromReader(message: ServerMessageRoomDelayApplyToAdmin, reader: jspb.BinaryReader): ServerMessageRoomDelayApplyToAdmin;
}

export namespace ServerMessageRoomDelayApplyToAdmin {
  export type AsObject = {
    roomId: number,
    userId: number,
    status: number,
    originType: number,
  }
}

