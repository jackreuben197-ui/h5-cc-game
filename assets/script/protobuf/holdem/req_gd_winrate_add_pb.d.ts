// package: holdem.pb
// file: protobuf/holdem/req_gd_winrate_add.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageGdWinrateAdd extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getAdd(): boolean;
  setAdd(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageGdWinrateAdd.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageGdWinrateAdd): ClientMessageGdWinrateAdd.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageGdWinrateAdd, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageGdWinrateAdd;
  static deserializeBinaryFromReader(message: ClientMessageGdWinrateAdd, reader: jspb.BinaryReader): ClientMessageGdWinrateAdd;
}

export namespace ClientMessageGdWinrateAdd {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    add: boolean,
  }
}

export class ServerMessageGdWinrateAdd extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdWinrateAdd.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdWinrateAdd): ServerMessageGdWinrateAdd.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdWinrateAdd, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdWinrateAdd;
  static deserializeBinaryFromReader(message: ServerMessageGdWinrateAdd, reader: jspb.BinaryReader): ServerMessageGdWinrateAdd;
}

export namespace ServerMessageGdWinrateAdd {
  export type AsObject = {
    status: number,
  }
}

