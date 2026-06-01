// package: holdem.pb
// file: protobuf/holdem/recv_mj_need_bring_in.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_mj_pb from "../../protobuf/holdem/define_mj_pb";

export class ServerMessageMjNeedBringIn extends jspb.Message {
  clearPlayersList(): void;
  getPlayersList(): Array<protobuf_holdem_define_mj_pb.NeedBringInPlayer>;
  setPlayersList(value: Array<protobuf_holdem_define_mj_pb.NeedBringInPlayer>): void;
  addPlayers(value?: protobuf_holdem_define_mj_pb.NeedBringInPlayer, index?: number): protobuf_holdem_define_mj_pb.NeedBringInPlayer;

  getDeadline(): number;
  setDeadline(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjNeedBringIn.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjNeedBringIn): ServerMessageMjNeedBringIn.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjNeedBringIn, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjNeedBringIn;
  static deserializeBinaryFromReader(message: ServerMessageMjNeedBringIn, reader: jspb.BinaryReader): ServerMessageMjNeedBringIn;
}

export namespace ServerMessageMjNeedBringIn {
  export type AsObject = {
    playersList: Array<protobuf_holdem_define_mj_pb.NeedBringInPlayer.AsObject>,
    deadline: number,
  }
}

