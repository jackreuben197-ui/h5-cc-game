// package: holdem.pb
// file: protobuf/holdem/recv_gd_tribute_return_complete.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_gd_pb from "../../protobuf/holdem/define_gd_pb";

export class ServerMessageGdTributeReturnComplete extends jspb.Message {
  clearOpsList(): void;
  getOpsList(): Array<protobuf_holdem_define_gd_pb.OperatorGD>;
  setOpsList(value: Array<protobuf_holdem_define_gd_pb.OperatorGD>): void;
  addOps(value?: protobuf_holdem_define_gd_pb.OperatorGD, index?: number): protobuf_holdem_define_gd_pb.OperatorGD;

  clearTributeCardsList(): void;
  getTributeCardsList(): Array<protobuf_holdem_define_gd_pb.TributeCard>;
  setTributeCardsList(value: Array<protobuf_holdem_define_gd_pb.TributeCard>): void;
  addTributeCards(value?: protobuf_holdem_define_gd_pb.TributeCard, index?: number): protobuf_holdem_define_gd_pb.TributeCard;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdTributeReturnComplete.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdTributeReturnComplete): ServerMessageGdTributeReturnComplete.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdTributeReturnComplete, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdTributeReturnComplete;
  static deserializeBinaryFromReader(message: ServerMessageGdTributeReturnComplete, reader: jspb.BinaryReader): ServerMessageGdTributeReturnComplete;
}

export namespace ServerMessageGdTributeReturnComplete {
  export type AsObject = {
    opsList: Array<protobuf_holdem_define_gd_pb.OperatorGD.AsObject>,
    tributeCardsList: Array<protobuf_holdem_define_gd_pb.TributeCard.AsObject>,
  }
}

