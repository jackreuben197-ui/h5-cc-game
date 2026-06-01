// package: holdem.pb
// file: protobuf/holdem/recv_mj_video_mask_change.proto.proto

import * as jspb from "google-protobuf";

export class ServerMessageMjVideoMaskChange extends jspb.Message {
  getUserId(): number;
  setUserId(value: number): void;

  getUserRid(): number;
  setUserRid(value: number): void;

  getVideoMaskId(): number;
  setVideoMaskId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjVideoMaskChange.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjVideoMaskChange): ServerMessageMjVideoMaskChange.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjVideoMaskChange, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjVideoMaskChange;
  static deserializeBinaryFromReader(message: ServerMessageMjVideoMaskChange, reader: jspb.BinaryReader): ServerMessageMjVideoMaskChange;
}

export namespace ServerMessageMjVideoMaskChange {
  export type AsObject = {
    userId: number,
    userRid: number,
    videoMaskId: number,
  }
}

