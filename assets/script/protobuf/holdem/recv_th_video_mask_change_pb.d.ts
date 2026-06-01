// package: holdem.pb
// file: protobuf/holdem/recv_th_video_mask_change.proto

import * as jspb from "google-protobuf";

export class ServerMessageVideoMaskChange extends jspb.Message {
  getUserId(): number;
  setUserId(value: number): void;

  getUserRid(): number;
  setUserRid(value: number): void;

  getVideoMaskId(): number;
  setVideoMaskId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageVideoMaskChange.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageVideoMaskChange): ServerMessageVideoMaskChange.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageVideoMaskChange, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageVideoMaskChange;
  static deserializeBinaryFromReader(message: ServerMessageVideoMaskChange, reader: jspb.BinaryReader): ServerMessageVideoMaskChange;
}

export namespace ServerMessageVideoMaskChange {
  export type AsObject = {
    userId: number,
    userRid: number,
    videoMaskId: number,
  }
}

