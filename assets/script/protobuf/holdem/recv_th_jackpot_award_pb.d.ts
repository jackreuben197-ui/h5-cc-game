// package: holdem.pb
// file: protobuf/holdem/recv_th_jackpot_award.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageJackpotAward extends jspb.Message {
  getHandNum(): number;
  setHandNum(value: number): void;

  clearAwardUsersList(): void;
  getAwardUsersList(): Array<protobuf_holdem_define_pb.JackpotAward>;
  setAwardUsersList(value: Array<protobuf_holdem_define_pb.JackpotAward>): void;
  addAwardUsers(value?: protobuf_holdem_define_pb.JackpotAward, index?: number): protobuf_holdem_define_pb.JackpotAward;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageJackpotAward.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageJackpotAward): ServerMessageJackpotAward.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageJackpotAward, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageJackpotAward;
  static deserializeBinaryFromReader(message: ServerMessageJackpotAward, reader: jspb.BinaryReader): ServerMessageJackpotAward;
}

export namespace ServerMessageJackpotAward {
  export type AsObject = {
    handNum: number,
    awardUsersList: Array<protobuf_holdem_define_pb.JackpotAward.AsObject>,
  }
}

