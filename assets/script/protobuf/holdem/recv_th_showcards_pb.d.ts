// package: holdem.pb
// file: protobuf/holdem/recv_th_showcards.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageShowcards extends jspb.Message {
  clearPlayerCardsList(): void;
  getPlayerCardsList(): Array<protobuf_holdem_define_pb.PlayerCards>;
  setPlayerCardsList(value: Array<protobuf_holdem_define_pb.PlayerCards>): void;
  addPlayerCards(value?: protobuf_holdem_define_pb.PlayerCards, index?: number): protobuf_holdem_define_pb.PlayerCards;

  getIsAll(): boolean;
  setIsAll(value: boolean): void;

  clearAllinUsersList(): void;
  getAllinUsersList(): Array<protobuf_holdem_define_pb.PlayerAllInShowCardWinCardsLength>;
  setAllinUsersList(value: Array<protobuf_holdem_define_pb.PlayerAllInShowCardWinCardsLength>): void;
  addAllinUsers(value?: protobuf_holdem_define_pb.PlayerAllInShowCardWinCardsLength, index?: number): protobuf_holdem_define_pb.PlayerAllInShowCardWinCardsLength;

  clearAllinUsers2List(): void;
  getAllinUsers2List(): Array<protobuf_holdem_define_pb.PlayerAllInShowCardWinCardsLength>;
  setAllinUsers2List(value: Array<protobuf_holdem_define_pb.PlayerAllInShowCardWinCardsLength>): void;
  addAllinUsers2(value?: protobuf_holdem_define_pb.PlayerAllInShowCardWinCardsLength, index?: number): protobuf_holdem_define_pb.PlayerAllInShowCardWinCardsLength;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageShowcards.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageShowcards): ServerMessageShowcards.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageShowcards, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageShowcards;
  static deserializeBinaryFromReader(message: ServerMessageShowcards, reader: jspb.BinaryReader): ServerMessageShowcards;
}

export namespace ServerMessageShowcards {
  export type AsObject = {
    playerCardsList: Array<protobuf_holdem_define_pb.PlayerCards.AsObject>,
    isAll: boolean,
    allinUsersList: Array<protobuf_holdem_define_pb.PlayerAllInShowCardWinCardsLength.AsObject>,
    allinUsers2List: Array<protobuf_holdem_define_pb.PlayerAllInShowCardWinCardsLength.AsObject>,
  }
}

