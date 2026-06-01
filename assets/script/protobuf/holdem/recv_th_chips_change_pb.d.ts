// package: holdem.pb
// file: protobuf/holdem/recv_th_chips_change.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageChipsChange extends jspb.Message {
  clearChangesList(): void;
  getChangesList(): Array<protobuf_holdem_define_pb.PlayerChipChange>;
  setChangesList(value: Array<protobuf_holdem_define_pb.PlayerChipChange>): void;
  addChanges(value?: protobuf_holdem_define_pb.PlayerChipChange, index?: number): protobuf_holdem_define_pb.PlayerChipChange;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageChipsChange.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageChipsChange): ServerMessageChipsChange.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageChipsChange, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageChipsChange;
  static deserializeBinaryFromReader(message: ServerMessageChipsChange, reader: jspb.BinaryReader): ServerMessageChipsChange;
}

export namespace ServerMessageChipsChange {
  export type AsObject = {
    changesList: Array<protobuf_holdem_define_pb.PlayerChipChange.AsObject>,
  }
}

