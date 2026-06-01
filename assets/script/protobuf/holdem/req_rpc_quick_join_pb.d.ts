// package: holdem.pb
// file: protobuf/holdem/req_rpc_quick_join.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageQuickJoin extends jspb.Message {
  getRpcId(): number;
  setRpcId(value: number): void;

  getRoomId(): number;
  setRoomId(value: number): void;

  getShowVoice(): boolean;
  setShowVoice(value: boolean): void;

  getShowVideo(): boolean;
  setShowVideo(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageQuickJoin.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageQuickJoin): ClientMessageQuickJoin.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageQuickJoin, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageQuickJoin;
  static deserializeBinaryFromReader(message: ClientMessageQuickJoin, reader: jspb.BinaryReader): ClientMessageQuickJoin;
}

export namespace ClientMessageQuickJoin {
  export type AsObject = {
    rpcId: number,
    roomId: number,
    showVoice: boolean,
    showVideo: boolean,
  }
}

export class ServerMessageQuickJoin extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getRpcId(): number;
  setRpcId(value: number): void;

  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.RoomWithType | undefined;
  setRoom(value?: protobuf_holdem_define_pb.RoomWithType): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageQuickJoin.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageQuickJoin): ServerMessageQuickJoin.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageQuickJoin, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageQuickJoin;
  static deserializeBinaryFromReader(message: ServerMessageQuickJoin, reader: jspb.BinaryReader): ServerMessageQuickJoin;
}

export namespace ServerMessageQuickJoin {
  export type AsObject = {
    status: number,
    rpcId: number,
    room?: protobuf_holdem_define_pb.RoomWithType.AsObject,
  }
}

