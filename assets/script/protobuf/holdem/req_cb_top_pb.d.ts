// package: holdem.pb
// file: protobuf/holdem/req_cb_top.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_cb_pb from "../../protobuf/holdem/define_cb_pb";

export class ClientMessageCbTop extends jspb.Message {
  getOffset(): number;
  setOffset(value: number): void;

  getLimit(): number;
  setLimit(value: number): void;

  getRoomId(): number;
  setRoomId(value: number): void;

  getOrderbyType(): protobuf_holdem_define_cb_pb.DefCB.OrderByTypeMap[keyof protobuf_holdem_define_cb_pb.DefCB.OrderByTypeMap];
  setOrderbyType(value: protobuf_holdem_define_cb_pb.DefCB.OrderByTypeMap[keyof protobuf_holdem_define_cb_pb.DefCB.OrderByTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageCbTop.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageCbTop): ClientMessageCbTop.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageCbTop, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageCbTop;
  static deserializeBinaryFromReader(message: ClientMessageCbTop, reader: jspb.BinaryReader): ClientMessageCbTop;
}

export namespace ClientMessageCbTop {
  export type AsObject = {
    offset: number,
    limit: number,
    roomId: number,
    orderbyType: protobuf_holdem_define_cb_pb.DefCB.OrderByTypeMap[keyof protobuf_holdem_define_cb_pb.DefCB.OrderByTypeMap],
  }
}

export class ServerMessageCbTop extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getOffset(): number;
  setOffset(value: number): void;

  getLimit(): number;
  setLimit(value: number): void;

  clearUsersList(): void;
  getUsersList(): Array<protobuf_holdem_define_cb_pb.CBUserPlay>;
  setUsersList(value: Array<protobuf_holdem_define_cb_pb.CBUserPlay>): void;
  addUsers(value?: protobuf_holdem_define_cb_pb.CBUserPlay, index?: number): protobuf_holdem_define_cb_pb.CBUserPlay;

  getOrderbyType(): protobuf_holdem_define_cb_pb.DefCB.OrderByTypeMap[keyof protobuf_holdem_define_cb_pb.DefCB.OrderByTypeMap];
  setOrderbyType(value: protobuf_holdem_define_cb_pb.DefCB.OrderByTypeMap[keyof protobuf_holdem_define_cb_pb.DefCB.OrderByTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageCbTop.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageCbTop): ServerMessageCbTop.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageCbTop, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageCbTop;
  static deserializeBinaryFromReader(message: ServerMessageCbTop, reader: jspb.BinaryReader): ServerMessageCbTop;
}

export namespace ServerMessageCbTop {
  export type AsObject = {
    status: number,
    offset: number,
    limit: number,
    usersList: Array<protobuf_holdem_define_cb_pb.CBUserPlay.AsObject>,
    orderbyType: protobuf_holdem_define_cb_pb.DefCB.OrderByTypeMap[keyof protobuf_holdem_define_cb_pb.DefCB.OrderByTypeMap],
  }
}

