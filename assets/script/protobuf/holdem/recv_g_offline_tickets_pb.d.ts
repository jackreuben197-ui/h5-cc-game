// package: holdem.pb
// file: protobuf/holdem/recv_g_offline_tickets.proto

import * as jspb from "google-protobuf";

export class ServerMessageOfflineTickets extends jspb.Message {
  getCode(): number;
  setCode(value: number): void;

  getData(): string;
  setData(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageOfflineTickets.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageOfflineTickets): ServerMessageOfflineTickets.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageOfflineTickets, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageOfflineTickets;
  static deserializeBinaryFromReader(message: ServerMessageOfflineTickets, reader: jspb.BinaryReader): ServerMessageOfflineTickets;
}

export namespace ServerMessageOfflineTickets {
  export type AsObject = {
    code: number,
    data: string,
  }
}

