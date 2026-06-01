// package: holdem.pb
// file: protobuf/holdem/req_rpc_rooms_simple.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageRoomsSimple extends jspb.Message {
  clearRoomIdList(): void;
  getRoomIdList(): Array<number>;
  setRoomIdList(value: Array<number>): void;
  addRoomId(value: number, index?: number): number;

  getRpcId(): number;
  setRpcId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageRoomsSimple.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageRoomsSimple): ClientMessageRoomsSimple.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageRoomsSimple, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageRoomsSimple;
  static deserializeBinaryFromReader(message: ClientMessageRoomsSimple, reader: jspb.BinaryReader): ClientMessageRoomsSimple;
}

export namespace ClientMessageRoomsSimple {
  export type AsObject = {
    roomIdList: Array<number>,
    rpcId: number,
  }
}

export class ServerMessageRoomsSimple extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getRpcId(): number;
  setRpcId(value: number): void;

  clearRoomsList(): void;
  getRoomsList(): Array<protobuf_holdem_define_pb.RoomRecordSimple>;
  setRoomsList(value: Array<protobuf_holdem_define_pb.RoomRecordSimple>): void;
  addRooms(value?: protobuf_holdem_define_pb.RoomRecordSimple, index?: number): protobuf_holdem_define_pb.RoomRecordSimple;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageRoomsSimple.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageRoomsSimple): ServerMessageRoomsSimple.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageRoomsSimple, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageRoomsSimple;
  static deserializeBinaryFromReader(message: ServerMessageRoomsSimple, reader: jspb.BinaryReader): ServerMessageRoomsSimple;
}

export namespace ServerMessageRoomsSimple {
  export type AsObject = {
    status: number,
    rpcId: number,
    roomsList: Array<protobuf_holdem_define_pb.RoomRecordSimple.AsObject>,
  }
}

