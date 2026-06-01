// package: holdem.pb
// file: protobuf/holdem/recv_mj_raise_complete.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_mj_pb from "../../protobuf/holdem/define_mj_pb";

export class ServerMessageMjRaiseComplete extends jspb.Message {
  clearPlayersList(): void;
  getPlayersList(): Array<protobuf_holdem_define_mj_pb.PlayerRaise>;
  setPlayersList(value: Array<protobuf_holdem_define_mj_pb.PlayerRaise>): void;
  addPlayers(value?: protobuf_holdem_define_mj_pb.PlayerRaise, index?: number): protobuf_holdem_define_mj_pb.PlayerRaise;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjRaiseComplete.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjRaiseComplete): ServerMessageMjRaiseComplete.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjRaiseComplete, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjRaiseComplete;
  static deserializeBinaryFromReader(message: ServerMessageMjRaiseComplete, reader: jspb.BinaryReader): ServerMessageMjRaiseComplete;
}

export namespace ServerMessageMjRaiseComplete {
  export type AsObject = {
    playersList: Array<protobuf_holdem_define_mj_pb.PlayerRaise.AsObject>,
  }
}

