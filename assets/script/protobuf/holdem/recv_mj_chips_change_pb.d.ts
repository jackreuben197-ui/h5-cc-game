// package: holdem.pb
// file: protobuf/holdem/recv_mj_chips_change.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_mj_pb from "../../protobuf/holdem/define_mj_pb";

export class ServerMessageMjChipsChange extends jspb.Message {
  clearChangesList(): void;
  getChangesList(): Array<protobuf_holdem_define_mj_pb.PlayerChipChangeMJ>;
  setChangesList(value: Array<protobuf_holdem_define_mj_pb.PlayerChipChangeMJ>): void;
  addChanges(value?: protobuf_holdem_define_mj_pb.PlayerChipChangeMJ, index?: number): protobuf_holdem_define_mj_pb.PlayerChipChangeMJ;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjChipsChange.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjChipsChange): ServerMessageMjChipsChange.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjChipsChange, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjChipsChange;
  static deserializeBinaryFromReader(message: ServerMessageMjChipsChange, reader: jspb.BinaryReader): ServerMessageMjChipsChange;
}

export namespace ServerMessageMjChipsChange {
  export type AsObject = {
    changesList: Array<protobuf_holdem_define_mj_pb.PlayerChipChangeMJ.AsObject>,
  }
}

