// package: holdem.pb
// file: protobuf/holdem/recv_th_auto_op.proto

import * as jspb from "google-protobuf";

export class ServerMessageAutoOp extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getEnable(): boolean;
  setEnable(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageAutoOp.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageAutoOp): ServerMessageAutoOp.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageAutoOp, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageAutoOp;
  static deserializeBinaryFromReader(message: ServerMessageAutoOp, reader: jspb.BinaryReader): ServerMessageAutoOp;
}

export namespace ServerMessageAutoOp {
  export type AsObject = {
    seatId: number,
    enable: boolean,
  }
}

