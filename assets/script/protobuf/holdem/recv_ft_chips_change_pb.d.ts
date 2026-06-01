// package: holdem.pb
// file: protobuf/holdem/recv_ft_chips_change.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_ft_pb from "../../protobuf/holdem/define_ft_pb";

export class ServerMessageFtChipsChange extends jspb.Message {
  clearChangesList(): void;
  getChangesList(): Array<protobuf_holdem_define_ft_pb.PlayerChipChangeFT>;
  setChangesList(value: Array<protobuf_holdem_define_ft_pb.PlayerChipChangeFT>): void;
  addChanges(value?: protobuf_holdem_define_ft_pb.PlayerChipChangeFT, index?: number): protobuf_holdem_define_ft_pb.PlayerChipChangeFT;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtChipsChange.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtChipsChange): ServerMessageFtChipsChange.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtChipsChange, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtChipsChange;
  static deserializeBinaryFromReader(message: ServerMessageFtChipsChange, reader: jspb.BinaryReader): ServerMessageFtChipsChange;
}

export namespace ServerMessageFtChipsChange {
  export type AsObject = {
    changesList: Array<protobuf_holdem_define_ft_pb.PlayerChipChangeFT.AsObject>,
  }
}

