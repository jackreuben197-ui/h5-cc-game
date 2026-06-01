// package: holdem.pb
// file: protobuf/holdem/recv_th_add_time_others.proto

import * as jspb from "google-protobuf";

export class ServerMessageAddTimeOthers extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getDuration(): number;
  setDuration(value: number): void;

  getTimes(): number;
  setTimes(value: number): void;

  getDeadline(): number;
  setDeadline(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageAddTimeOthers.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageAddTimeOthers): ServerMessageAddTimeOthers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageAddTimeOthers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageAddTimeOthers;
  static deserializeBinaryFromReader(message: ServerMessageAddTimeOthers, reader: jspb.BinaryReader): ServerMessageAddTimeOthers;
}

export namespace ServerMessageAddTimeOthers {
  export type AsObject = {
    seatId: number,
    duration: number,
    times: number,
    deadline: number,
  }
}

