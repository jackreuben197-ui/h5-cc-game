// package: holdem.pb
// file: protobuf/holdem/recv_ft_start_info.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_ft_pb from "../../protobuf/holdem/define_ft_pb";

export class ServerMessageFtStartInfo extends jspb.Message {
  hasHandInfo(): boolean;
  clearHandInfo(): void;
  getHandInfo(): protobuf_holdem_define_ft_pb.HandInfoFT | undefined;
  setHandInfo(value?: protobuf_holdem_define_ft_pb.HandInfoFT): void;

  clearPlayersList(): void;
  getPlayersList(): Array<protobuf_holdem_define_ft_pb.PlayerStartInfoFT>;
  setPlayersList(value: Array<protobuf_holdem_define_ft_pb.PlayerStartInfoFT>): void;
  addPlayers(value?: protobuf_holdem_define_ft_pb.PlayerStartInfoFT, index?: number): protobuf_holdem_define_ft_pb.PlayerStartInfoFT;

  getWaitDeadline(): number;
  setWaitDeadline(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtStartInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtStartInfo): ServerMessageFtStartInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtStartInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtStartInfo;
  static deserializeBinaryFromReader(message: ServerMessageFtStartInfo, reader: jspb.BinaryReader): ServerMessageFtStartInfo;
}

export namespace ServerMessageFtStartInfo {
  export type AsObject = {
    handInfo?: protobuf_holdem_define_ft_pb.HandInfoFT.AsObject,
    playersList: Array<protobuf_holdem_define_ft_pb.PlayerStartInfoFT.AsObject>,
    waitDeadline: number,
  }
}

