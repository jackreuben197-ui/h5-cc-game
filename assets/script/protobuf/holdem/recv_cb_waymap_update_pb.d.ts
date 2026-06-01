// package: holdem.pb
// file: protobuf/holdem/recv_cb_waymap_update.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_cb_pb from "../../protobuf/holdem/define_cb_pb";

export class ServerMessageCbWaymapUpdate extends jspb.Message {
  hasBmUpdate(): boolean;
  clearBmUpdate(): void;
  getBmUpdate(): protobuf_holdem_define_cb_pb.CBWayPointMove | undefined;
  setBmUpdate(value?: protobuf_holdem_define_cb_pb.CBWayPointMove): void;

  hasSmUpdate(): boolean;
  clearSmUpdate(): void;
  getSmUpdate(): protobuf_holdem_define_cb_pb.CBWayPointMove | undefined;
  setSmUpdate(value?: protobuf_holdem_define_cb_pb.CBWayPointMove): void;

  hasPmUpdate(): boolean;
  clearPmUpdate(): void;
  getPmUpdate(): protobuf_holdem_define_cb_pb.CBWayPointMove | undefined;
  setPmUpdate(value?: protobuf_holdem_define_cb_pb.CBWayPointMove): void;

  clearPreviewList(): void;
  getPreviewList(): Array<protobuf_holdem_define_cb_pb.CBWayPointPreview>;
  setPreviewList(value: Array<protobuf_holdem_define_cb_pb.CBWayPointPreview>): void;
  addPreview(value?: protobuf_holdem_define_cb_pb.CBWayPointPreview, index?: number): protobuf_holdem_define_cb_pb.CBWayPointPreview;

  clearResultSlotsList(): void;
  getResultSlotsList(): Array<protobuf_holdem_define_cb_pb.DefCB.PlaySlotMap[keyof protobuf_holdem_define_cb_pb.DefCB.PlaySlotMap]>;
  setResultSlotsList(value: Array<protobuf_holdem_define_cb_pb.DefCB.PlaySlotMap[keyof protobuf_holdem_define_cb_pb.DefCB.PlaySlotMap]>): void;
  addResultSlots(value: protobuf_holdem_define_cb_pb.DefCB.PlaySlotMap[keyof protobuf_holdem_define_cb_pb.DefCB.PlaySlotMap], index?: number): protobuf_holdem_define_cb_pb.DefCB.PlaySlotMap[keyof protobuf_holdem_define_cb_pb.DefCB.PlaySlotMap];

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageCbWaymapUpdate.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageCbWaymapUpdate): ServerMessageCbWaymapUpdate.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageCbWaymapUpdate, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageCbWaymapUpdate;
  static deserializeBinaryFromReader(message: ServerMessageCbWaymapUpdate, reader: jspb.BinaryReader): ServerMessageCbWaymapUpdate;
}

export namespace ServerMessageCbWaymapUpdate {
  export type AsObject = {
    bmUpdate?: protobuf_holdem_define_cb_pb.CBWayPointMove.AsObject,
    smUpdate?: protobuf_holdem_define_cb_pb.CBWayPointMove.AsObject,
    pmUpdate?: protobuf_holdem_define_cb_pb.CBWayPointMove.AsObject,
    previewList: Array<protobuf_holdem_define_cb_pb.CBWayPointPreview.AsObject>,
    resultSlotsList: Array<protobuf_holdem_define_cb_pb.DefCB.PlaySlotMap[keyof protobuf_holdem_define_cb_pb.DefCB.PlaySlotMap]>,
  }
}

