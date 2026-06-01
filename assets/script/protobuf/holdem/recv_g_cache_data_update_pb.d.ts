// package: holdem.pb
// file: protobuf/holdem/recv_g_cache_data_update.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageCacheDataUpdate extends jspb.Message {
  hasRtInfo(): boolean;
  clearRtInfo(): void;
  getRtInfo(): protobuf_holdem_define_pb.RoomTemplateUpdateInfo | undefined;
  setRtInfo(value?: protobuf_holdem_define_pb.RoomTemplateUpdateInfo): void;

  hasJtInfo(): boolean;
  clearJtInfo(): void;
  getJtInfo(): protobuf_holdem_define_pb.JackpotTemplateUpdateInfo | undefined;
  setJtInfo(value?: protobuf_holdem_define_pb.JackpotTemplateUpdateInfo): void;

  hasWtInfo(): boolean;
  clearWtInfo(): void;
  getWtInfo(): protobuf_holdem_define_pb.WheelTemplateUpdateInfo | undefined;
  setWtInfo(value?: protobuf_holdem_define_pb.WheelTemplateUpdateInfo): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageCacheDataUpdate.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageCacheDataUpdate): ServerMessageCacheDataUpdate.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageCacheDataUpdate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageCacheDataUpdate;
  static deserializeBinaryFromReader(message: ServerMessageCacheDataUpdate, reader: jspb.BinaryReader): ServerMessageCacheDataUpdate;
}

export namespace ServerMessageCacheDataUpdate {
  export type AsObject = {
    rtInfo?: protobuf_holdem_define_pb.RoomTemplateUpdateInfo.AsObject,
    jtInfo?: protobuf_holdem_define_pb.JackpotTemplateUpdateInfo.AsObject,
    wtInfo?: protobuf_holdem_define_pb.WheelTemplateUpdateInfo.AsObject,
  }
}

