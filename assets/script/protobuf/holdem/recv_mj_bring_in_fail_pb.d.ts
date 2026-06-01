// package: holdem.pb
// file: protobuf/holdem/recv_mj_bring_in_fail.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageMjBringInFail extends jspb.Message {
  getCurrentChip(): number;
  setCurrentChip(value: number): void;

  getSrc(): protobuf_holdem_define_pb.Def.ChipChangeReasonMap[keyof protobuf_holdem_define_pb.Def.ChipChangeReasonMap];
  setSrc(value: protobuf_holdem_define_pb.Def.ChipChangeReasonMap[keyof protobuf_holdem_define_pb.Def.ChipChangeReasonMap]): void;

  getExtErrcode(): number;
  setExtErrcode(value: number): void;

  getExtNotice(): string;
  setExtNotice(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjBringInFail.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjBringInFail): ServerMessageMjBringInFail.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjBringInFail, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjBringInFail;
  static deserializeBinaryFromReader(message: ServerMessageMjBringInFail, reader: jspb.BinaryReader): ServerMessageMjBringInFail;
}

export namespace ServerMessageMjBringInFail {
  export type AsObject = {
    currentChip: number,
    src: protobuf_holdem_define_pb.Def.ChipChangeReasonMap[keyof protobuf_holdem_define_pb.Def.ChipChangeReasonMap],
    extErrcode: number,
    extNotice: string,
  }
}

