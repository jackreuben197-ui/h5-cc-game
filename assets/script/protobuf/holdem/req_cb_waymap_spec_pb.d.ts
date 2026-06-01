// package: holdem.pb
// file: protobuf/holdem/req_cb_waymap_spec.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_cb_pb from "../../protobuf/holdem/define_cb_pb";

export class ClientMessageCbWaymapSpec extends jspb.Message {
  getRoomId(): number;
  setRoomId(value: number): void;

  getBigMapStartIndex(): number;
  setBigMapStartIndex(value: number): void;

  getSmallMapStartIndex(): number;
  setSmallMapStartIndex(value: number): void;

  getPanMapStartIndex(): number;
  setPanMapStartIndex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageCbWaymapSpec.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageCbWaymapSpec): ClientMessageCbWaymapSpec.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageCbWaymapSpec, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageCbWaymapSpec;
  static deserializeBinaryFromReader(message: ClientMessageCbWaymapSpec, reader: jspb.BinaryReader): ClientMessageCbWaymapSpec;
}

export namespace ClientMessageCbWaymapSpec {
  export type AsObject = {
    roomId: number,
    bigMapStartIndex: number,
    smallMapStartIndex: number,
    panMapStartIndex: number,
  }
}

export class ServerMessageCbWaymapSpec extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  clearBigMapList(): void;
  getBigMapList(): Array<protobuf_holdem_define_cb_pb.CBWayPointMove>;
  setBigMapList(value: Array<protobuf_holdem_define_cb_pb.CBWayPointMove>): void;
  addBigMap(value?: protobuf_holdem_define_cb_pb.CBWayPointMove, index?: number): protobuf_holdem_define_cb_pb.CBWayPointMove;

  clearSmallMapList(): void;
  getSmallMapList(): Array<protobuf_holdem_define_cb_pb.CBWayPointMove>;
  setSmallMapList(value: Array<protobuf_holdem_define_cb_pb.CBWayPointMove>): void;
  addSmallMap(value?: protobuf_holdem_define_cb_pb.CBWayPointMove, index?: number): protobuf_holdem_define_cb_pb.CBWayPointMove;

  clearPanMapList(): void;
  getPanMapList(): Array<protobuf_holdem_define_cb_pb.CBWayPointMove>;
  setPanMapList(value: Array<protobuf_holdem_define_cb_pb.CBWayPointMove>): void;
  addPanMap(value?: protobuf_holdem_define_cb_pb.CBWayPointMove, index?: number): protobuf_holdem_define_cb_pb.CBWayPointMove;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageCbWaymapSpec.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageCbWaymapSpec): ServerMessageCbWaymapSpec.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageCbWaymapSpec, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageCbWaymapSpec;
  static deserializeBinaryFromReader(message: ServerMessageCbWaymapSpec, reader: jspb.BinaryReader): ServerMessageCbWaymapSpec;
}

export namespace ServerMessageCbWaymapSpec {
  export type AsObject = {
    status: number,
    bigMapList: Array<protobuf_holdem_define_cb_pb.CBWayPointMove.AsObject>,
    smallMapList: Array<protobuf_holdem_define_cb_pb.CBWayPointMove.AsObject>,
    panMapList: Array<protobuf_holdem_define_cb_pb.CBWayPointMove.AsObject>,
  }
}

