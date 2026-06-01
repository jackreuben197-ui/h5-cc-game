// package: holdem.pb
// file: protobuf/holdem/recv_util_anti_cheat_room_video.proto

import * as jspb from "google-protobuf";

export class ServerMessageUtilAntiCheatRoomVideo extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getRoomType(): number;
  setRoomType(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageUtilAntiCheatRoomVideo.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageUtilAntiCheatRoomVideo): ServerMessageUtilAntiCheatRoomVideo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageUtilAntiCheatRoomVideo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageUtilAntiCheatRoomVideo;
  static deserializeBinaryFromReader(message: ServerMessageUtilAntiCheatRoomVideo, reader: jspb.BinaryReader): ServerMessageUtilAntiCheatRoomVideo;
}

export namespace ServerMessageUtilAntiCheatRoomVideo {
  export type AsObject = {
    status: number,
    roomType: number,
  }
}

