// package: holdem.pb
// file: protobuf/holdem/recv_gd_bring_in_fail.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageGdBringInFail extends jspb.Message {
  getCurrentChip(): number;
  setCurrentChip(value: number): void;

  getSrc(): protobuf_holdem_define_pb.Def.ChipChangeReasonMap[keyof protobuf_holdem_define_pb.Def.ChipChangeReasonMap];
  setSrc(value: protobuf_holdem_define_pb.Def.ChipChangeReasonMap[keyof protobuf_holdem_define_pb.Def.ChipChangeReasonMap]): void;

  getExtErrcode(): number;
  setExtErrcode(value: number): void;

  getExtNotice(): string;
  setExtNotice(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdBringInFail.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdBringInFail): ServerMessageGdBringInFail.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdBringInFail, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdBringInFail;
  static deserializeBinaryFromReader(message: ServerMessageGdBringInFail, reader: jspb.BinaryReader): ServerMessageGdBringInFail;
}

export namespace ServerMessageGdBringInFail {
  export type AsObject = {
    currentChip: number,
    src: protobuf_holdem_define_pb.Def.ChipChangeReasonMap[keyof protobuf_holdem_define_pb.Def.ChipChangeReasonMap],
    extErrcode: number,
    extNotice: string,
  }
}

