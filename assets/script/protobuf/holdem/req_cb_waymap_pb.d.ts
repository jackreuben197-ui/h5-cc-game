// package: holdem.pb
// file: protobuf/holdem/req_cb_waymap.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_cb_pb from "../../protobuf/holdem/define_cb_pb";

export class ClientMessageCbWaymap extends jspb.Message {
  getRoomId(): number;
  setRoomId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageCbWaymap.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageCbWaymap): ClientMessageCbWaymap.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageCbWaymap, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageCbWaymap;
  static deserializeBinaryFromReader(message: ClientMessageCbWaymap, reader: jspb.BinaryReader): ClientMessageCbWaymap;
}

export namespace ClientMessageCbWaymap {
  export type AsObject = {
    roomId: number,
  }
}

export class ServerMessageCbWaymap extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  hasBigMap(): boolean;
  clearBigMap(): void;
  getBigMap(): protobuf_holdem_define_cb_pb.CBWayPointMap | undefined;
  setBigMap(value?: protobuf_holdem_define_cb_pb.CBWayPointMap): void;

  hasSmallMap(): boolean;
  clearSmallMap(): void;
  getSmallMap(): protobuf_holdem_define_cb_pb.CBWayPointMap | undefined;
  setSmallMap(value?: protobuf_holdem_define_cb_pb.CBWayPointMap): void;

  hasPanMap(): boolean;
  clearPanMap(): void;
  getPanMap(): protobuf_holdem_define_cb_pb.CBWayPointMap | undefined;
  setPanMap(value?: protobuf_holdem_define_cb_pb.CBWayPointMap): void;

  clearPreviewList(): void;
  getPreviewList(): Array<protobuf_holdem_define_cb_pb.CBWayPointPreview>;
  setPreviewList(value: Array<protobuf_holdem_define_cb_pb.CBWayPointPreview>): void;
  addPreview(value?: protobuf_holdem_define_cb_pb.CBWayPointPreview, index?: number): protobuf_holdem_define_cb_pb.CBWayPointPreview;

  clearItemsList(): void;
  getItemsList(): Array<protobuf_holdem_define_cb_pb.CBHistorySimpleItem>;
  setItemsList(value: Array<protobuf_holdem_define_cb_pb.CBHistorySimpleItem>): void;
  addItems(value?: protobuf_holdem_define_cb_pb.CBHistorySimpleItem, index?: number): protobuf_holdem_define_cb_pb.CBHistorySimpleItem;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageCbWaymap.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageCbWaymap): ServerMessageCbWaymap.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageCbWaymap, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageCbWaymap;
  static deserializeBinaryFromReader(message: ServerMessageCbWaymap, reader: jspb.BinaryReader): ServerMessageCbWaymap;
}

export namespace ServerMessageCbWaymap {
  export type AsObject = {
    status: number,
    bigMap?: protobuf_holdem_define_cb_pb.CBWayPointMap.AsObject,
    smallMap?: protobuf_holdem_define_cb_pb.CBWayPointMap.AsObject,
    panMap?: protobuf_holdem_define_cb_pb.CBWayPointMap.AsObject,
    previewList: Array<protobuf_holdem_define_cb_pb.CBWayPointPreview.AsObject>,
    itemsList: Array<protobuf_holdem_define_cb_pb.CBHistorySimpleItem.AsObject>,
  }
}

