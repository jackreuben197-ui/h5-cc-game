// package: holdem.pb
// file: protobuf/holdem/recv_gd_chips_change.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_gd_pb from "../../protobuf/holdem/define_gd_pb";

export class ServerMessageGdChipsChange extends jspb.Message {
  clearChangesList(): void;
  getChangesList(): Array<protobuf_holdem_define_gd_pb.PlayerChipChangeGD>;
  setChangesList(value: Array<protobuf_holdem_define_gd_pb.PlayerChipChangeGD>): void;
  addChanges(value?: protobuf_holdem_define_gd_pb.PlayerChipChangeGD, index?: number): protobuf_holdem_define_gd_pb.PlayerChipChangeGD;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdChipsChange.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdChipsChange): ServerMessageGdChipsChange.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdChipsChange, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdChipsChange;
  static deserializeBinaryFromReader(message: ServerMessageGdChipsChange, reader: jspb.BinaryReader): ServerMessageGdChipsChange;
}

export namespace ServerMessageGdChipsChange {
  export type AsObject = {
    changesList: Array<protobuf_holdem_define_gd_pb.PlayerChipChangeGD.AsObject>,
  }
}

