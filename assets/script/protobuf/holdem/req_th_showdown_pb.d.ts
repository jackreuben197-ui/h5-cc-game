// package: holdem.pb
// file: protobuf/holdem/req_th_showdown.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageShowdown extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  clearShowCardsList(): void;
  getShowCardsList(): Array<number>;
  setShowCardsList(value: Array<number>): void;
  addShowCards(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageShowdown.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageShowdown): ClientMessageShowdown.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageShowdown, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageShowdown;
  static deserializeBinaryFromReader(message: ClientMessageShowdown, reader: jspb.BinaryReader): ClientMessageShowdown;
}

export namespace ClientMessageShowdown {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    showCardsList: Array<number>,
  }
}

export class ServerMessageShowdown extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageShowdown.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageShowdown): ServerMessageShowdown.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageShowdown, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageShowdown;
  static deserializeBinaryFromReader(message: ServerMessageShowdown, reader: jspb.BinaryReader): ServerMessageShowdown;
}

export namespace ServerMessageShowdown {
  export type AsObject = {
    status: number,
  }
}

