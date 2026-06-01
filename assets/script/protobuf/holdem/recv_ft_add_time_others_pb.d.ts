// package: holdem.pb
// file: protobuf/holdem/recv_ft_add_time_others.proto

import * as jspb from "google-protobuf";

export class ServerMessageFtAddTimeOthers extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getDuration(): number;
  setDuration(value: number): void;

  getTimes(): number;
  setTimes(value: number): void;

  getDeadline(): number;
  setDeadline(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtAddTimeOthers.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtAddTimeOthers): ServerMessageFtAddTimeOthers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtAddTimeOthers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtAddTimeOthers;
  static deserializeBinaryFromReader(message: ServerMessageFtAddTimeOthers, reader: jspb.BinaryReader): ServerMessageFtAddTimeOthers;
}

export namespace ServerMessageFtAddTimeOthers {
  export type AsObject = {
    seatId: number,
    duration: number,
    times: number,
    deadline: number,
  }
}

