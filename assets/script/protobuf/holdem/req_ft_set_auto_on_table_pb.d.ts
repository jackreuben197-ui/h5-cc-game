// package: holdem.pb
// file: protobuf/holdem/req_ft_set_auto_on_table.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageFtSetAutoOnTable extends jspb.Message {
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
  toObject(includeInstance?: boolean): ClientMessageFtSetAutoOnTable.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageFtSetAutoOnTable): ClientMessageFtSetAutoOnTable.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageFtSetAutoOnTable, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageFtSetAutoOnTable;
  static deserializeBinaryFromReader(message: ClientMessageFtSetAutoOnTable, reader: jspb.BinaryReader): ClientMessageFtSetAutoOnTable;
}

export namespace ClientMessageFtSetAutoOnTable {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    autoOnTable: number,
    autoUseWallet: boolean,
    autoOnTableFix: number,
  }
}

export class ServerMessageFtSetAutoOnTable extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtSetAutoOnTable.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtSetAutoOnTable): ServerMessageFtSetAutoOnTable.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtSetAutoOnTable, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtSetAutoOnTable;
  static deserializeBinaryFromReader(message: ServerMessageFtSetAutoOnTable, reader: jspb.BinaryReader): ServerMessageFtSetAutoOnTable;
}

export namespace ServerMessageFtSetAutoOnTable {
  export type AsObject = {
    status: number,
  }
}

