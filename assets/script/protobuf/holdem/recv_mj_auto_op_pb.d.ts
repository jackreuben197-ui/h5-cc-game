// package: holdem.pb
// file: protobuf/holdem/recv_mj_auto_op.proto

import * as jspb from "google-protobuf";

export class ServerMessageMjAutoOp extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getEnable(): boolean;
  setEnable(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjAutoOp.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjAutoOp): ServerMessageMjAutoOp.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjAutoOp, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjAutoOp;
  static deserializeBinaryFromReader(message: ServerMessageMjAutoOp, reader: jspb.BinaryReader): ServerMessageMjAutoOp;
}

export namespace ServerMessageMjAutoOp {
  export type AsObject = {
    seatId: number,
    enable: boolean,
  }
}

