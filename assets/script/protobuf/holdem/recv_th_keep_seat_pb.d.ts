// package: holdem.pb
// file: protobuf/holdem/recv_th_keep_seat.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageKeepSeat extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getKeep(): boolean;
  setKeep(value: boolean): void;

  getTimes(): number;
  setTimes(value: number): void;

  getLeftTime(): number;
  setLeftTime(value: number): void;

  getPostStatus(): protobuf_holdem_define_pb.Def.CanPlayStatusMap[keyof protobuf_holdem_define_pb.Def.CanPlayStatusMap];
  setPostStatus(value: protobuf_holdem_define_pb.Def.CanPlayStatusMap[keyof protobuf_holdem_define_pb.Def.CanPlayStatusMap]): void;

  getKeepSeatReason(): protobuf_holdem_define_pb.Def.KeepSeatReasonMap[keyof protobuf_holdem_define_pb.Def.KeepSeatReasonMap];
  setKeepSeatReason(value: protobuf_holdem_define_pb.Def.KeepSeatReasonMap[keyof protobuf_holdem_define_pb.Def.KeepSeatReasonMap]): void;

  getDeadline(): number;
  setDeadline(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageKeepSeat.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageKeepSeat): ServerMessageKeepSeat.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageKeepSeat, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageKeepSeat;
  static deserializeBinaryFromReader(message: ServerMessageKeepSeat, reader: jspb.BinaryReader): ServerMessageKeepSeat;
}

export namespace ServerMessageKeepSeat {
  export type AsObject = {
    seatId: number,
    keep: boolean,
    times: number,
    leftTime: number,
    postStatus: protobuf_holdem_define_pb.Def.CanPlayStatusMap[keyof protobuf_holdem_define_pb.Def.CanPlayStatusMap],
    keepSeatReason: protobuf_holdem_define_pb.Def.KeepSeatReasonMap[keyof protobuf_holdem_define_pb.Def.KeepSeatReasonMap],
    deadline: number,
  }
}

