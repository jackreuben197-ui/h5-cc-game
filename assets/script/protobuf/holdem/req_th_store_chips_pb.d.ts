// package: holdem.pb
// file: protobuf/holdem/req_th_store_chips.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageStoreChips extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getStore(): number;
  setStore(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageStoreChips.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageStoreChips): ClientMessageStoreChips.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageStoreChips, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageStoreChips;
  static deserializeBinaryFromReader(message: ClientMessageStoreChips, reader: jspb.BinaryReader): ClientMessageStoreChips;
}

export namespace ClientMessageStoreChips {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    store: number,
  }
}

export class ServerMessageStoreChips extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getChips(): number;
  setChips(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageStoreChips.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageStoreChips): ServerMessageStoreChips.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageStoreChips, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageStoreChips;
  static deserializeBinaryFromReader(message: ServerMessageStoreChips, reader: jspb.BinaryReader): ServerMessageStoreChips;
}

export namespace ServerMessageStoreChips {
  export type AsObject = {
    status: number,
    chips: number,
  }
}

