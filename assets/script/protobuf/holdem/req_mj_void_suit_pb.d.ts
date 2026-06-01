// package: holdem.pb
// file: protobuf/holdem/req_mj_void_suit.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";
import * as protobuf_holdem_define_mj_pb from "../../protobuf/holdem/define_mj_pb";

export class ClientMessageMjVoidSuit extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getTileType(): protobuf_holdem_define_mj_pb.DefMJ.TileTypeMap[keyof protobuf_holdem_define_mj_pb.DefMJ.TileTypeMap];
  setTileType(value: protobuf_holdem_define_mj_pb.DefMJ.TileTypeMap[keyof protobuf_holdem_define_mj_pb.DefMJ.TileTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageMjVoidSuit.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageMjVoidSuit): ClientMessageMjVoidSuit.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageMjVoidSuit, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageMjVoidSuit;
  static deserializeBinaryFromReader(message: ClientMessageMjVoidSuit, reader: jspb.BinaryReader): ClientMessageMjVoidSuit;
}

export namespace ClientMessageMjVoidSuit {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    tileType: protobuf_holdem_define_mj_pb.DefMJ.TileTypeMap[keyof protobuf_holdem_define_mj_pb.DefMJ.TileTypeMap],
  }
}

export class ServerMessageMjVoidSuit extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjVoidSuit.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjVoidSuit): ServerMessageMjVoidSuit.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjVoidSuit, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjVoidSuit;
  static deserializeBinaryFromReader(message: ServerMessageMjVoidSuit, reader: jspb.BinaryReader): ServerMessageMjVoidSuit;
}

export namespace ServerMessageMjVoidSuit {
  export type AsObject = {
    status: number,
  }
}

