// package: holdem.pb
// file: protobuf/holdem/req_mj_exchange_tiles.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";
import * as protobuf_holdem_define_mj_pb from "../../protobuf/holdem/define_mj_pb";

export class ClientMessageMjExchangeTiles extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  clearExchangeTilesList(): void;
  getExchangeTilesList(): Array<protobuf_holdem_define_mj_pb.Tile>;
  setExchangeTilesList(value: Array<protobuf_holdem_define_mj_pb.Tile>): void;
  addExchangeTiles(value?: protobuf_holdem_define_mj_pb.Tile, index?: number): protobuf_holdem_define_mj_pb.Tile;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageMjExchangeTiles.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageMjExchangeTiles): ClientMessageMjExchangeTiles.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageMjExchangeTiles, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageMjExchangeTiles;
  static deserializeBinaryFromReader(message: ClientMessageMjExchangeTiles, reader: jspb.BinaryReader): ClientMessageMjExchangeTiles;
}

export namespace ClientMessageMjExchangeTiles {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    exchangeTilesList: Array<protobuf_holdem_define_mj_pb.Tile.AsObject>,
  }
}

export class ServerMessageMjExchangeTiles extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjExchangeTiles.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjExchangeTiles): ServerMessageMjExchangeTiles.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjExchangeTiles, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjExchangeTiles;
  static deserializeBinaryFromReader(message: ServerMessageMjExchangeTiles, reader: jspb.BinaryReader): ServerMessageMjExchangeTiles;
}

export namespace ServerMessageMjExchangeTiles {
  export type AsObject = {
    status: number,
  }
}

