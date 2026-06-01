// package: holdem.pb
// file: protobuf/holdem/recv_th_wait_check_auto_add_time.proto

import * as jspb from "google-protobuf";

export class ServerMessageWaitCheckAutoAddTime extends jspb.Message {
  getUserId(): number;
  setUserId(value: number): void;

  getSeatId(): number;
  setSeatId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageWaitCheckAutoAddTime.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageWaitCheckAutoAddTime): ServerMessageWaitCheckAutoAddTime.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageWaitCheckAutoAddTime, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageWaitCheckAutoAddTime;
  static deserializeBinaryFromReader(message: ServerMessageWaitCheckAutoAddTime, reader: jspb.BinaryReader): ServerMessageWaitCheckAutoAddTime;
}

export namespace ServerMessageWaitCheckAutoAddTime {
  export type AsObject = {
    userId: number,
    seatId: number,
  }
}

