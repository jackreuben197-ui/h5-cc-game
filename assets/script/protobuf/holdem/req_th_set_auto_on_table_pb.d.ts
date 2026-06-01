// package: holdem.pb
// file: protobuf/holdem/req_th_set_auto_on_table.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageSetAutoOnTable extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getAutoOnTable(): number;
  setAutoOnTable(value: number): void;

  getAutoUseWallet(): boolean;
  setAutoUseWallet(value: boolean): void;

  getAutoOnTableNoStore(): boolean;
  setAutoOnTableNoStore(value: boolean): void;

  getAutoOnTableFix(): number;
  setAutoOnTableFix(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageSetAutoOnTable.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageSetAutoOnTable): ClientMessageSetAutoOnTable.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageSetAutoOnTable, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageSetAutoOnTable;
  static deserializeBinaryFromReader(message: ClientMessageSetAutoOnTable, reader: jspb.BinaryReader): ClientMessageSetAutoOnTable;
}

export namespace ClientMessageSetAutoOnTable {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    autoOnTable: number,
    autoUseWallet: boolean,
    autoOnTableNoStore: boolean,
    autoOnTableFix: number,
  }
}

export class ServerMessageSetAutoOnTable extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageSetAutoOnTable.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageSetAutoOnTable): ServerMessageSetAutoOnTable.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageSetAutoOnTable, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageSetAutoOnTable;
  static deserializeBinaryFromReader(message: ServerMessageSetAutoOnTable, reader: jspb.BinaryReader): ServerMessageSetAutoOnTable;
}

export namespace ServerMessageSetAutoOnTable {
  export type AsObject = {
    status: number,
  }
}

