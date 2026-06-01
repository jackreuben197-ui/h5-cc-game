// package: holdem.pb
// file: protobuf/holdem/recv_gd_keep_seat.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageGdKeepSeat extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getKeep(): boolean;
  setKeep(value: boolean): void;

  getTimes(): number;
  setTimes(value: number): void;

  getLeftTime(): number;
  setLeftTime(value: number): void;

  getKeepSeatReason(): protobuf_holdem_define_pb.Def.KeepSeatReasonMap[keyof protobuf_holdem_define_pb.Def.KeepSeatReasonMap];
  setKeepSeatReason(value: protobuf_holdem_define_pb.Def.KeepSeatReasonMap[keyof protobuf_holdem_define_pb.Def.KeepSeatReasonMap]): void;

  getDeadline(): number;
  setDeadline(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdKeepSeat.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdKeepSeat): ServerMessageGdKeepSeat.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdKeepSeat, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdKeepSeat;
  static deserializeBinaryFromReader(message: ServerMessageGdKeepSeat, reader: jspb.BinaryReader): ServerMessageGdKeepSeat;
}

export namespace ServerMessageGdKeepSeat {
  export type AsObject = {
    seatId: number,
    keep: boolean,
    times: number,
    leftTime: number,
    keepSeatReason: protobuf_holdem_define_pb.Def.KeepSeatReasonMap[keyof protobuf_holdem_define_pb.Def.KeepSeatReasonMap],
    deadline: number,
  }
}

