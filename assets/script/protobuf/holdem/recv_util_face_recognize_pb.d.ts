// package: holdem.pb
// file: protobuf/holdem/recv_util_face_recognize.proto

import * as jspb from "google-protobuf";

export class ServerMessageUtilFaceRecognize extends jspb.Message {
  getId(): number;
  setId(value: number): void;

  getRequestUserRid(): number;
  setRequestUserRid(value: number): void;

  getRequestUserName(): string;
  setRequestUserName(value: string): void;

  getRecogUserRid(): number;
  setRecogUserRid(value: number): void;

  getRecogUserName(): string;
  setRecogUserName(value: string): void;

  getStatus(): number;
  setStatus(value: number): void;

  getRecogTime(): number;
  setRecogTime(value: number): void;

  getCreateTime(): number;
  setCreateTime(value: number): void;

  getTimeoutStamp(): number;
  setTimeoutStamp(value: number): void;

  getRoomType(): number;
  setRoomType(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageUtilFaceRecognize.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageUtilFaceRecognize): ServerMessageUtilFaceRecognize.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageUtilFaceRecognize, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageUtilFaceRecognize;
  static deserializeBinaryFromReader(message: ServerMessageUtilFaceRecognize, reader: jspb.BinaryReader): ServerMessageUtilFaceRecognize;
}

export namespace ServerMessageUtilFaceRecognize {
  export type AsObject = {
    id: number,
    requestUserRid: number,
    requestUserName: string,
    recogUserRid: number,
    recogUserName: string,
    status: number,
    recogTime: number,
    createTime: number,
    timeoutStamp: number,
    roomType: number,
  }
}

