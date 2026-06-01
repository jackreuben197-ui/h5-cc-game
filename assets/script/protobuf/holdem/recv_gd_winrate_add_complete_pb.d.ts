// package: holdem.pb
// file: protobuf/holdem/recv_gd_winrate_add_complete.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_gd_pb from "../../protobuf/holdem/define_gd_pb";

export class ServerMessageGdWinrateAddComplete extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getAdd(): boolean;
  setAdd(value: boolean): void;

  getCurrentInitWinrate(): number;
  setCurrentInitWinrate(value: number): void;

  clearOpsList(): void;
  getOpsList(): Array<protobuf_holdem_define_gd_pb.OperatorGD>;
  setOpsList(value: Array<protobuf_holdem_define_gd_pb.OperatorGD>): void;
  addOps(value?: protobuf_holdem_define_gd_pb.OperatorGD, index?: number): protobuf_holdem_define_gd_pb.OperatorGD;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdWinrateAddComplete.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdWinrateAddComplete): ServerMessageGdWinrateAddComplete.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdWinrateAddComplete, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdWinrateAddComplete;
  static deserializeBinaryFromReader(message: ServerMessageGdWinrateAddComplete, reader: jspb.BinaryReader): ServerMessageGdWinrateAddComplete;
}

export namespace ServerMessageGdWinrateAddComplete {
  export type AsObject = {
    seatId: number,
    add: boolean,
    currentInitWinrate: number,
    opsList: Array<protobuf_holdem_define_gd_pb.OperatorGD.AsObject>,
  }
}

