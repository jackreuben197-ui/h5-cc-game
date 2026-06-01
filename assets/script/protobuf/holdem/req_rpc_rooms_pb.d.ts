// package: holdem.pb
// file: protobuf/holdem/req_rpc_rooms.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageRooms extends jspb.Message {
  clearRoomIdList(): void;
  getRoomIdList(): Array<number>;
  setRoomIdList(value: Array<number>): void;
  addRoomId(value: number, index?: number): number;

  getRpcId(): number;
  setRpcId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageRooms.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageRooms): ClientMessageRooms.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageRooms, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageRooms;
  static deserializeBinaryFromReader(message: ClientMessageRooms, reader: jspb.BinaryReader): ClientMessageRooms;
}

export namespace ClientMessageRooms {
  export type AsObject = {
    roomIdList: Array<number>,
    rpcId: number,
  }
}

export class ServerMessageRooms extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getRpcId(): number;
  setRpcId(value: number): void;

  clearRoomsList(): void;
  getRoomsList(): Array<protobuf_holdem_define_pb.RoomRecord>;
  setRoomsList(value: Array<protobuf_holdem_define_pb.RoomRecord>): void;
  addRooms(value?: protobuf_holdem_define_pb.RoomRecord, index?: number): protobuf_holdem_define_pb.RoomRecord;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageRooms.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageRooms): ServerMessageRooms.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageRooms, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageRooms;
  static deserializeBinaryFromReader(message: ServerMessageRooms, reader: jspb.BinaryReader): ServerMessageRooms;
}

export namespace ServerMessageRooms {
  export type AsObject = {
    status: number,
    rpcId: number,
    roomsList: Array<protobuf_holdem_define_pb.RoomRecord.AsObject>,
  }
}

