// package: holdem.pb
// file: protobuf/holdem/recv_mj_follow_dealer.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_mj_pb from "../../protobuf/holdem/define_mj_pb";

export class ServerMessageMjFollowDealer extends jspb.Message {
  getSeat(): number;
  setSeat(value: number): void;

  hasTile(): boolean;
  clearTile(): void;
  getTile(): protobuf_holdem_define_mj_pb.Tile | undefined;
  setTile(value?: protobuf_holdem_define_mj_pb.Tile): void;

  clearErjsList(): void;
  getErjsList(): Array<protobuf_holdem_define_mj_pb.ExternalResultMJ>;
  setErjsList(value: Array<protobuf_holdem_define_mj_pb.ExternalResultMJ>): void;
  addErjs(value?: protobuf_holdem_define_mj_pb.ExternalResultMJ, index?: number): protobuf_holdem_define_mj_pb.ExternalResultMJ;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjFollowDealer.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjFollowDealer): ServerMessageMjFollowDealer.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjFollowDealer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjFollowDealer;
  static deserializeBinaryFromReader(message: ServerMessageMjFollowDealer, reader: jspb.BinaryReader): ServerMessageMjFollowDealer;
}

export namespace ServerMessageMjFollowDealer {
  export type AsObject = {
    seat: number,
    tile?: protobuf_holdem_define_mj_pb.Tile.AsObject,
    erjsList: Array<protobuf_holdem_define_mj_pb.ExternalResultMJ.AsObject>,
  }
}

