// package: holdem.pb
// file: protobuf/holdem/req_gd_set_auto_on_table.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageGdSetAutoOnTable extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getAutoOnTable(): number;
  setAutoOnTable(value: number): void;

  getAutoUseWallet(): boolean;
  setAutoUseWallet(value: boolean): void;

  getAutoOnTableFix(): number;
  setAutoOnTableFix(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageGdSetAutoOnTable.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageGdSetAutoOnTable): ClientMessageGdSetAutoOnTable.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageGdSetAutoOnTable, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageGdSetAutoOnTable;
  static deserializeBinaryFromReader(message: ClientMessageGdSetAutoOnTable, reader: jspb.BinaryReader): ClientMessageGdSetAutoOnTable;
}

export namespace ClientMessageGdSetAutoOnTable {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    autoOnTable: number,
    autoUseWallet: boolean,
    autoOnTableFix: number,
  }
}

export class ServerMessageGdSetAutoOnTable extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdSetAutoOnTable.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdSetAutoOnTable): ServerMessageGdSetAutoOnTable.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdSetAutoOnTable, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdSetAutoOnTable;
  static deserializeBinaryFromReader(message: ServerMessageGdSetAutoOnTable, reader: jspb.BinaryReader): ServerMessageGdSetAutoOnTable;
}

export namespace ServerMessageGdSetAutoOnTable {
  export type AsObject = {
    status: number,
  }
}

