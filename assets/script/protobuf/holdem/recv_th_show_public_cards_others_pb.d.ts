// package: holdem.pb
// file: protobuf/holdem/recv_th_show_public_cards_others.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageShowPublicCardsOthers extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getRound(): protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap];
  setRound(value: protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageShowPublicCardsOthers.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageShowPublicCardsOthers): ServerMessageShowPublicCardsOthers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageShowPublicCardsOthers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageShowPublicCardsOthers;
  static deserializeBinaryFromReader(message: ServerMessageShowPublicCardsOthers, reader: jspb.BinaryReader): ServerMessageShowPublicCardsOthers;
}

export namespace ServerMessageShowPublicCardsOthers {
  export type AsObject = {
    seatId: number,
    round: protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap],
  }
}

