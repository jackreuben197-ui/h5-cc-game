// package: holdem.pb
// file: protobuf/holdem/recv_gd_add_time_others.proto

import * as jspb from "google-protobuf";

export class ServerMessageGdAddTimeOthers extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getDuration(): number;
  setDuration(value: number): void;

  getTimes(): number;
  setTimes(value: number): void;

  getDeadline(): number;
  setDeadline(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdAddTimeOthers.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdAddTimeOthers): ServerMessageGdAddTimeOthers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdAddTimeOthers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdAddTimeOthers;
  static deserializeBinaryFromReader(message: ServerMessageGdAddTimeOthers, reader: jspb.BinaryReader): ServerMessageGdAddTimeOthers;
}

export namespace ServerMessageGdAddTimeOthers {
  export type AsObject = {
    seatId: number,
    duration: number,
    times: number,
    deadline: number,
  }
}

