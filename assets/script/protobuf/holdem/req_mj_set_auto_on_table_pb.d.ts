// package: holdem.pb
// file: protobuf/holdem/req_mj_set_auto_on_table.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageMjSetAutoOnTable extends jspb.Message {
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
  toObject(includeInstance?: boolean): ClientMessageMjSetAutoOnTable.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageMjSetAutoOnTable): ClientMessageMjSetAutoOnTable.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageMjSetAutoOnTable, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageMjSetAutoOnTable;
  static deserializeBinaryFromReader(message: ClientMessageMjSetAutoOnTable, reader: jspb.BinaryReader): ClientMessageMjSetAutoOnTable;
}

export namespace ClientMessageMjSetAutoOnTable {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    autoOnTable: number,
    autoUseWallet: boolean,
    autoOnTableFix: number,
  }
}

export class ServerMessageMjSetAutoOnTable extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjSetAutoOnTable.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjSetAutoOnTable): ServerMessageMjSetAutoOnTable.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjSetAutoOnTable, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjSetAutoOnTable;
  static deserializeBinaryFromReader(message: ServerMessageMjSetAutoOnTable, reader: jspb.BinaryReader): ServerMessageMjSetAutoOnTable;
}

export namespace ServerMessageMjSetAutoOnTable {
  export type AsObject = {
    status: number,
  }
}

