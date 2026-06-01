// package: holdem.pb
// file: protobuf/holdem/recv_g_club_room_delay_apply_audit.proto

import * as jspb from "google-protobuf";

export class ServerMessageClubRoomDelayApplyAudit extends jspb.Message {
  getRoomId(): number;
  setRoomId(value: number): void;

  getStatus(): number;
  setStatus(value: number): void;

  getOriginType(): number;
  setOriginType(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageClubRoomDelayApplyAudit.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageClubRoomDelayApplyAudit): ServerMessageClubRoomDelayApplyAudit.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageClubRoomDelayApplyAudit, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageClubRoomDelayApplyAudit;
  static deserializeBinaryFromReader(message: ServerMessageClubRoomDelayApplyAudit, reader: jspb.BinaryReader): ServerMessageClubRoomDelayApplyAudit;
}

export namespace ServerMessageClubRoomDelayApplyAudit {
  export type AsObject = {
    roomId: number,
    status: number,
    originType: number,
  }
}

