// package: holdem.pb
// file: protobuf/holdem/req_gd_observers.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageGdObservers extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getOffset(): number;
  setOffset(value: number): void;

  getLimit(): number;
  setLimit(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageGdObservers.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageGdObservers): ClientMessageGdObservers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageGdObservers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageGdObservers;
  static deserializeBinaryFromReader(message: ClientMessageGdObservers, reader: jspb.BinaryReader): ClientMessageGdObservers;
}

export namespace ClientMessageGdObservers {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    offset: number,
    limit: number,
  }
}

export class ServerMessageGdObservers extends jspb.Message {
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
  toObject(includeInstance?: boolean): ServerMessageGdObservers.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdObservers): ServerMessageGdObservers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdObservers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdObservers;
  static deserializeBinaryFromReader(message: ServerMessageGdObservers, reader: jspb.BinaryReader): ServerMessageGdObservers;
}

export namespace ServerMessageGdObservers {
  export type AsObject = {
    status: number,
    observersList: Array<protobuf_holdem_define_pb.Roomer.AsObject>,
    offset: number,
    limit: number,
    total: number,
  }
}

