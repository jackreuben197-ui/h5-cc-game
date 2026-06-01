// package: holdem.pb
// file: protobuf/holdem/recv_ft_auto_op.proto

import * as jspb from "google-protobuf";

export class ServerMessageFtAutoOp extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getEnable(): boolean;
  setEnable(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtAutoOp.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtAutoOp): ServerMessageFtAutoOp.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtAutoOp, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtAutoOp;
  static deserializeBinaryFromReader(message: ServerMessageFtAutoOp, reader: jspb.BinaryReader): ServerMessageFtAutoOp;
}

export namespace ServerMessageFtAutoOp {
  export type AsObject = {
    seatId: number,
    enable: boolean,
  }
}

