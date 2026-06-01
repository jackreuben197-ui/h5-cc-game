// package: holdem.pb
// file: protobuf/holdem/recv_th_show_view_cards.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageShowViewCards extends jspb.Message {
  clearPlayerCardsList(): void;
  getPlayerCardsList(): Array<protobuf_holdem_define_pb.PlayerCards>;
  setPlayerCardsList(value: Array<protobuf_holdem_define_pb.PlayerCards>): void;
  addPlayerCards(value?: protobuf_holdem_define_pb.PlayerCards, index?: number): protobuf_holdem_define_pb.PlayerCards;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageShowViewCards.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageShowViewCards): ServerMessageShowViewCards.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageShowViewCards, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageShowViewCards;
  static deserializeBinaryFromReader(message: ServerMessageShowViewCards, reader: jspb.BinaryReader): ServerMessageShowViewCards;
}

export namespace ServerMessageShowViewCards {
  export type AsObject = {
    playerCardsList: Array<protobuf_holdem_define_pb.PlayerCards.AsObject>,
  }
}

