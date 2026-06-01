// package: holdem.pb
// file: protobuf/holdem/recv_mj_need_bring_in_complete.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_mj_pb from "../../protobuf/holdem/define_mj_pb";

export class ServerMessageMjNeedBringInComplete extends jspb.Message {
  clearPlayersList(): void;
  getPlayersList(): Array<protobuf_holdem_define_mj_pb.NeedBringInResult>;
  setPlayersList(value: Array<protobuf_holdem_define_mj_pb.NeedBringInResult>): void;
  addPlayers(value?: protobuf_holdem_define_mj_pb.NeedBringInResult, index?: number): protobuf_holdem_define_mj_pb.NeedBringInResult;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjNeedBringInComplete.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjNeedBringInComplete): ServerMessageMjNeedBringInComplete.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjNeedBringInComplete, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjNeedBringInComplete;
  static deserializeBinaryFromReader(message: ServerMessageMjNeedBringInComplete, reader: jspb.BinaryReader): ServerMessageMjNeedBringInComplete;
}

export namespace ServerMessageMjNeedBringInComplete {
  export type AsObject = {
    playersList: Array<protobuf_holdem_define_mj_pb.NeedBringInResult.AsObject>,
  }
}

