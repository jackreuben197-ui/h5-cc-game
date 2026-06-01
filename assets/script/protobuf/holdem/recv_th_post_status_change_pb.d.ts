// package: holdem.pb
// file: protobuf/holdem/recv_th_post_status_change.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessagePostStatusChange extends jspb.Message {
  clearChangesList(): void;
  getChangesList(): Array<protobuf_holdem_define_pb.PostStatusChange>;
  setChangesList(value: Array<protobuf_holdem_define_pb.PostStatusChange>): void;
  addChanges(value?: protobuf_holdem_define_pb.PostStatusChange, index?: number): protobuf_holdem_define_pb.PostStatusChange;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessagePostStatusChange.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessagePostStatusChange): ServerMessagePostStatusChange.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessagePostStatusChange, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessagePostStatusChange;
  static deserializeBinaryFromReader(message: ServerMessagePostStatusChange, reader: jspb.BinaryReader): ServerMessagePostStatusChange;
}

export namespace ServerMessagePostStatusChange {
  export type AsObject = {
    changesList: Array<protobuf_holdem_define_pb.PostStatusChange.AsObject>,
  }
}

