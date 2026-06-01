// package: holdem.pb
// file: protobuf/holdem/req_mj_action.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";
import * as protobuf_holdem_define_mj_pb from "../../protobuf/holdem/define_mj_pb";

export class ClientMessageMjAction extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getAction(): protobuf_holdem_define_mj_pb.DefMJ.ActionMjMap[keyof protobuf_holdem_define_mj_pb.DefMJ.ActionMjMap];
  setAction(value: protobuf_holdem_define_mj_pb.DefMJ.ActionMjMap[keyof protobuf_holdem_define_mj_pb.DefMJ.ActionMjMap]): void;

  clearTilesList(): void;
  getTilesList(): Array<protobuf_holdem_define_mj_pb.Tile>;
  setTilesList(value: Array<protobuf_holdem_define_mj_pb.Tile>): void;
  addTiles(value?: protobuf_holdem_define_mj_pb.Tile, index?: number): protobuf_holdem_define_mj_pb.Tile;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageMjAction.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageMjAction): ClientMessageMjAction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageMjAction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageMjAction;
  static deserializeBinaryFromReader(message: ClientMessageMjAction, reader: jspb.BinaryReader): ClientMessageMjAction;
}

export namespace ClientMessageMjAction {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    action: protobuf_holdem_define_mj_pb.DefMJ.ActionMjMap[keyof protobuf_holdem_define_mj_pb.DefMJ.ActionMjMap],
    tilesList: Array<protobuf_holdem_define_mj_pb.Tile.AsObject>,
  }
}

export class ServerMessageMjAction extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjAction.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjAction): ServerMessageMjAction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjAction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjAction;
  static deserializeBinaryFromReader(message: ServerMessageMjAction, reader: jspb.BinaryReader): ServerMessageMjAction;
}

export namespace ServerMessageMjAction {
  export type AsObject = {
    status: number,
  }
}

