// package: holdem.pb
// file: protobuf/holdem/recv_gd_start_info.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_gd_pb from "../../protobuf/holdem/define_gd_pb";

export class ServerMessageGdStartInfo extends jspb.Message {
  hasMatchInfo(): boolean;
  clearMatchInfo(): void;
  getMatchInfo(): protobuf_holdem_define_gd_pb.MatchInfoGD | undefined;
  setMatchInfo(value?: protobuf_holdem_define_gd_pb.MatchInfoGD): void;

  clearPlayersList(): void;
  getPlayersList(): Array<protobuf_holdem_define_gd_pb.PlayerStartInfoGD>;
  setPlayersList(value: Array<protobuf_holdem_define_gd_pb.PlayerStartInfoGD>): void;
  addPlayers(value?: protobuf_holdem_define_gd_pb.PlayerStartInfoGD, index?: number): protobuf_holdem_define_gd_pb.PlayerStartInfoGD;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdStartInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdStartInfo): ServerMessageGdStartInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdStartInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdStartInfo;
  static deserializeBinaryFromReader(message: ServerMessageGdStartInfo, reader: jspb.BinaryReader): ServerMessageGdStartInfo;
}

export namespace ServerMessageGdStartInfo {
  export type AsObject = {
    matchInfo?: protobuf_holdem_define_gd_pb.MatchInfoGD.AsObject,
    playersList: Array<protobuf_holdem_define_gd_pb.PlayerStartInfoGD.AsObject>,
  }
}

