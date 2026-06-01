// package: holdem.pb
// file: protobuf/holdem/req_ft_observers.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageFtObservers extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getOffset(): number;
  setOffset(value: number): void;

  getLimit(): number;
  setLimit(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageFtObservers.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageFtObservers): ClientMessageFtObservers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageFtObservers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageFtObservers;
  static deserializeBinaryFromReader(message: ClientMessageFtObservers, reader: jspb.BinaryReader): ClientMessageFtObservers;
}

export namespace ClientMessageFtObservers {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    offset: number,
    limit: number,
  }
}

export class ServerMessageFtObservers extends jspb.Message {
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
  toObject(includeInstance?: boolean): ServerMessageFtObservers.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtObservers): ServerMessageFtObservers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtObservers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtObservers;
  static deserializeBinaryFromReader(message: ServerMessageFtObservers, reader: jspb.BinaryReader): ServerMessageFtObservers;
}

export namespace ServerMessageFtObservers {
  export type AsObject = {
    status: number,
    observersList: Array<protobuf_holdem_define_pb.Roomer.AsObject>,
    offset: number,
    limit: number,
    total: number,
  }
}

