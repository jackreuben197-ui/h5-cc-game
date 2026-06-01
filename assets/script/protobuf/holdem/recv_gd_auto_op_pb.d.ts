// package: holdem.pb
// file: protobuf/holdem/recv_gd_auto_op.proto

import * as jspb from "google-protobuf";

export class ServerMessageGdAutoOp extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getEnable(): boolean;
  setEnable(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdAutoOp.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdAutoOp): ServerMessageGdAutoOp.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdAutoOp, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdAutoOp;
  static deserializeBinaryFromReader(message: ServerMessageGdAutoOp, reader: jspb.BinaryReader): ServerMessageGdAutoOp;
}

export namespace ServerMessageGdAutoOp {
  export type AsObject = {
    seatId: number,
    enable: boolean,
  }
}

