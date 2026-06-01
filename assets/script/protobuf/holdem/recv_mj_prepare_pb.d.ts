// package: holdem.pb
// file: protobuf/holdem/recv_mj_prepare.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_mj_pb from "../../protobuf/holdem/define_mj_pb";

export class ServerMessageMjPrepare extends jspb.Message {
  hasMatchInfo(): boolean;
  clearMatchInfo(): void;
  getMatchInfo(): protobuf_holdem_define_mj_pb.MatchInfoMJ | undefined;
  setMatchInfo(value?: protobuf_holdem_define_mj_pb.MatchInfoMJ): void;

  clearPlayersList(): void;
  getPlayersList(): Array<protobuf_holdem_define_mj_pb.PlayerPrepareMJ>;
  setPlayersList(value: Array<protobuf_holdem_define_mj_pb.PlayerPrepareMJ>): void;
  addPlayers(value?: protobuf_holdem_define_mj_pb.PlayerPrepareMJ, index?: number): protobuf_holdem_define_mj_pb.PlayerPrepareMJ;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjPrepare.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjPrepare): ServerMessageMjPrepare.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjPrepare, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjPrepare;
  static deserializeBinaryFromReader(message: ServerMessageMjPrepare, reader: jspb.BinaryReader): ServerMessageMjPrepare;
}

export namespace ServerMessageMjPrepare {
  export type AsObject = {
    matchInfo?: protobuf_holdem_define_mj_pb.MatchInfoMJ.AsObject,
    playersList: Array<protobuf_holdem_define_mj_pb.PlayerPrepareMJ.AsObject>,
  }
}

