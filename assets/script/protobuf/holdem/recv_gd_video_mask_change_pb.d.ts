// package: holdem.pb
// file: protobuf/holdem/recv_gd_video_mask_change.proto

import * as jspb from "google-protobuf";

export class ServerMessageGdVideoMaskChange extends jspb.Message {
  getUserId(): number;
  setUserId(value: number): void;

  getUserRid(): number;
  setUserRid(value: number): void;

  getVideoMaskId(): number;
  setVideoMaskId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdVideoMaskChange.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdVideoMaskChange): ServerMessageGdVideoMaskChange.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdVideoMaskChange, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdVideoMaskChange;
  static deserializeBinaryFromReader(message: ServerMessageGdVideoMaskChange, reader: jspb.BinaryReader): ServerMessageGdVideoMaskChange;
}

export namespace ServerMessageGdVideoMaskChange {
  export type AsObject = {
    userId: number,
    userRid: number,
    videoMaskId: number,
  }
}

