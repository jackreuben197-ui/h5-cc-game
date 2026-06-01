// package: holdem.pb
// file: protobuf/holdem/recv_th_force_video.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageForceVideo extends jspb.Message {
  getBuyComplete(): boolean;
  setBuyComplete(value: boolean): void;

  getFinalRoom(): boolean;
  setFinalRoom(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageForceVideo.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageForceVideo): ServerMessageForceVideo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageForceVideo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageForceVideo;
  static deserializeBinaryFromReader(message: ServerMessageForceVideo, reader: jspb.BinaryReader): ServerMessageForceVideo;
}

export namespace ServerMessageForceVideo {
  export type AsObject = {
    buyComplete: boolean,
    finalRoom: boolean,
  }
}

