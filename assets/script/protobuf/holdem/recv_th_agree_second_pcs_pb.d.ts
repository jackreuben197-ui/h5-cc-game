// package: holdem.pb
// file: protobuf/holdem/recv_th_agree_second_pcs.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageAgreeSecondPcs extends jspb.Message {
  getRound(): protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap];
  setRound(value: protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap]): void;

  getSeatId(): number;
  setSeatId(value: number): void;

  getResult(): boolean;
  setResult(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageAgreeSecondPcs.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageAgreeSecondPcs): ServerMessageAgreeSecondPcs.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageAgreeSecondPcs, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageAgreeSecondPcs;
  static deserializeBinaryFromReader(message: ServerMessageAgreeSecondPcs, reader: jspb.BinaryReader): ServerMessageAgreeSecondPcs;
}

export namespace ServerMessageAgreeSecondPcs {
  export type AsObject = {
    round: protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap],
    seatId: number,
    result: boolean,
  }
}

