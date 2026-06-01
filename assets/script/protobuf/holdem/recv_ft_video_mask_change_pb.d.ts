// package: holdem.pb
// file: protobuf/holdem/recv_ft_video_mask_change.proto

import * as jspb from "google-protobuf";

export class ServerMessageFtVideoMaskChange extends jspb.Message {
  getUserId(): number;
  setUserId(value: number): void;

  getUserRid(): number;
  setUserRid(value: number): void;

  getVideoMaskId(): number;
  setVideoMaskId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtVideoMaskChange.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtVideoMaskChange): ServerMessageFtVideoMaskChange.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtVideoMaskChange, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtVideoMaskChange;
  static deserializeBinaryFromReader(message: ServerMessageFtVideoMaskChange, reader: jspb.BinaryReader): ServerMessageFtVideoMaskChange;
}

export namespace ServerMessageFtVideoMaskChange {
  export type AsObject = {
    userId: number,
    userRid: number,
    videoMaskId: number,
  }
}

