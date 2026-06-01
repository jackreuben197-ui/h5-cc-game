// package: holdem.pb
// file: protobuf/holdem/recv_mj_add_time_others.proto

import * as jspb from "google-protobuf";

export class ServerMessageMjAddTimeOthers extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getDuration(): number;
  setDuration(value: number): void;

  getTimes(): number;
  setTimes(value: number): void;

  getDeadline(): number;
  setDeadline(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjAddTimeOthers.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjAddTimeOthers): ServerMessageMjAddTimeOthers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjAddTimeOthers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjAddTimeOthers;
  static deserializeBinaryFromReader(message: ServerMessageMjAddTimeOthers, reader: jspb.BinaryReader): ServerMessageMjAddTimeOthers;
}

export namespace ServerMessageMjAddTimeOthers {
  export type AsObject = {
    seatId: number,
    duration: number,
    times: number,
    deadline: number,
  }
}

