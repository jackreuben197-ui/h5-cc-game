// package: holdem.pb
// file: protobuf/holdem/recv_th_start_info.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageStartInfo extends jspb.Message {
  hasHandInfo(): boolean;
  clearHandInfo(): void;
  getHandInfo(): protobuf_holdem_define_pb.HandInfo | undefined;
  setHandInfo(value?: protobuf_holdem_define_pb.HandInfo): void;

  hasNextOperator(): boolean;
  clearNextOperator(): void;
  getNextOperator(): protobuf_holdem_define_pb.Operator | undefined;
  setNextOperator(value?: protobuf_holdem_define_pb.Operator): void;

  clearPlayersList(): void;
  getPlayersList(): Array<protobuf_holdem_define_pb.PlayerStartInfo>;
  setPlayersList(value: Array<protobuf_holdem_define_pb.PlayerStartInfo>): void;
  addPlayers(value?: protobuf_holdem_define_pb.PlayerStartInfo, index?: number): protobuf_holdem_define_pb.PlayerStartInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageStartInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageStartInfo): ServerMessageStartInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageStartInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageStartInfo;
  static deserializeBinaryFromReader(message: ServerMessageStartInfo, reader: jspb.BinaryReader): ServerMessageStartInfo;
}

export namespace ServerMessageStartInfo {
  export type AsObject = {
    handInfo?: protobuf_holdem_define_pb.HandInfo.AsObject,
    nextOperator?: protobuf_holdem_define_pb.Operator.AsObject,
    playersList: Array<protobuf_holdem_define_pb.PlayerStartInfo.AsObject>,
  }
}

