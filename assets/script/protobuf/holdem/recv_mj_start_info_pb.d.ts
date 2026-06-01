// package: holdem.pb
// file: protobuf/holdem/recv_mj_start_info.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_mj_pb from "../../protobuf/holdem/define_mj_pb";

export class ServerMessageMjStartInfo extends jspb.Message {
  hasMatchInfo(): boolean;
  clearMatchInfo(): void;
  getMatchInfo(): protobuf_holdem_define_mj_pb.MatchInfoMJ | undefined;
  setMatchInfo(value?: protobuf_holdem_define_mj_pb.MatchInfoMJ): void;

  clearPlayersList(): void;
  getPlayersList(): Array<protobuf_holdem_define_mj_pb.PlayerStartInfoMJ>;
  setPlayersList(value: Array<protobuf_holdem_define_mj_pb.PlayerStartInfoMJ>): void;
  addPlayers(value?: protobuf_holdem_define_mj_pb.PlayerStartInfoMJ, index?: number): protobuf_holdem_define_mj_pb.PlayerStartInfoMJ;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjStartInfo.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjStartInfo): ServerMessageMjStartInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjStartInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjStartInfo;
  static deserializeBinaryFromReader(message: ServerMessageMjStartInfo, reader: jspb.BinaryReader): ServerMessageMjStartInfo;
}

export namespace ServerMessageMjStartInfo {
  export type AsObject = {
    matchInfo?: protobuf_holdem_define_mj_pb.MatchInfoMJ.AsObject,
    playersList: Array<protobuf_holdem_define_mj_pb.PlayerStartInfoMJ.AsObject>,
  }
}

