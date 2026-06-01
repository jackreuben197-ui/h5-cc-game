// package: holdem.pb
// file: protobuf/holdem/req_cb_online.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_cb_pb from "../../protobuf/holdem/define_cb_pb";

export class ClientMessageCbOnline extends jspb.Message {
  getOffset(): number;
  setOffset(value: number): void;

  getLimit(): number;
  setLimit(value: number): void;

  getRoomId(): number;
  setRoomId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageCbOnline.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageCbOnline): ClientMessageCbOnline.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageCbOnline, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageCbOnline;
  static deserializeBinaryFromReader(message: ClientMessageCbOnline, reader: jspb.BinaryReader): ClientMessageCbOnline;
}

export namespace ClientMessageCbOnline {
  export type AsObject = {
    offset: number,
    limit: number,
    roomId: number,
  }
}

export class ServerMessageCbOnline extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getOffset(): number;
  setOffset(value: number): void;

  getLimit(): number;
  setLimit(value: number): void;

  clearUsersList(): void;
  getUsersList(): Array<protobuf_holdem_define_cb_pb.CBUser>;
  setUsersList(value: Array<protobuf_holdem_define_cb_pb.CBUser>): void;
  addUsers(value?: protobuf_holdem_define_cb_pb.CBUser, index?: number): protobuf_holdem_define_cb_pb.CBUser;

  getOnline(): number;
  setOnline(value: number): void;

  getGuestCount(): number;
  setGuestCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageCbOnline.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageCbOnline): ServerMessageCbOnline.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageCbOnline, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageCbOnline;
  static deserializeBinaryFromReader(message: ServerMessageCbOnline, reader: jspb.BinaryReader): ServerMessageCbOnline;
}

export namespace ServerMessageCbOnline {
  export type AsObject = {
    status: number,
    offset: number,
    limit: number,
    usersList: Array<protobuf_holdem_define_cb_pb.CBUser.AsObject>,
    online: number,
    guestCount: number,
  }
}

