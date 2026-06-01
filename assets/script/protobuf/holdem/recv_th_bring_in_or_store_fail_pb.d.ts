// package: holdem.pb
// file: protobuf/holdem/recv_th_bring_in_or_store_fail.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageBringInOrStoreFail extends jspb.Message {
  getIsBringIn(): boolean;
  setIsBringIn(value: boolean): void;

  getCurrentChip(): number;
  setCurrentChip(value: number): void;

  getSrc(): protobuf_holdem_define_pb.Def.ChipChangeReasonMap[keyof protobuf_holdem_define_pb.Def.ChipChangeReasonMap];
  setSrc(value: protobuf_holdem_define_pb.Def.ChipChangeReasonMap[keyof protobuf_holdem_define_pb.Def.ChipChangeReasonMap]): void;

  getExtErrcode(): number;
  setExtErrcode(value: number): void;

  getExtNotice(): string;
  setExtNotice(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageBringInOrStoreFail.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageBringInOrStoreFail): ServerMessageBringInOrStoreFail.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageBringInOrStoreFail, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageBringInOrStoreFail;
  static deserializeBinaryFromReader(message: ServerMessageBringInOrStoreFail, reader: jspb.BinaryReader): ServerMessageBringInOrStoreFail;
}

export namespace ServerMessageBringInOrStoreFail {
  export type AsObject = {
    isBringIn: boolean,
    currentChip: number,
    src: protobuf_holdem_define_pb.Def.ChipChangeReasonMap[keyof protobuf_holdem_define_pb.Def.ChipChangeReasonMap],
    extErrcode: number,
    extNotice: string,
  }
}

