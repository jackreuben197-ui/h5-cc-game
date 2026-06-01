// package: holdem.pb
// file: protobuf/holdem/req_mj_observers.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageMjObservers extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getOffset(): number;
  setOffset(value: number): void;

  getLimit(): number;
  setLimit(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageMjObservers.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageMjObservers): ClientMessageMjObservers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageMjObservers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageMjObservers;
  static deserializeBinaryFromReader(message: ClientMessageMjObservers, reader: jspb.BinaryReader): ClientMessageMjObservers;
}

export namespace ClientMessageMjObservers {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    offset: number,
    limit: number,
  }
}

export class ServerMessageMjObservers extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  clearObserversList(): void;
  getObserversList(): Array<protobuf_holdem_define_pb.Roomer>;
  setObserversList(value: Array<protobuf_holdem_define_pb.Roomer>): void;
  addObservers(value?: protobuf_holdem_define_pb.Roomer, index?: number): protobuf_holdem_define_pb.Roomer;

  getOffset(): number;
  setOffset(value: number): void;

  getLimit(): number;
  setLimit(value: number): void;

  getTotal(): number;
  setTotal(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjObservers.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjObservers): ServerMessageMjObservers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjObservers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjObservers;
  static deserializeBinaryFromReader(message: ServerMessageMjObservers, reader: jspb.BinaryReader): ServerMessageMjObservers;
}

export namespace ServerMessageMjObservers {
  export type AsObject = {
    status: number,
    observersList: Array<protobuf_holdem_define_pb.Roomer.AsObject>,
    offset: number,
    limit: number,
    total: number,
  }
}

