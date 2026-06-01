// package: holdem.pb
// file: protobuf/holdem/req_th_show_public_cards.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageShowPublicCards extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getRound(): protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap];
  setRound(value: protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap]): void;

  getConsume(): protobuf_holdem_define_pb.Def.ConsumeTypeMap[keyof protobuf_holdem_define_pb.Def.ConsumeTypeMap];
  setConsume(value: protobuf_holdem_define_pb.Def.ConsumeTypeMap[keyof protobuf_holdem_define_pb.Def.ConsumeTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageShowPublicCards.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageShowPublicCards): ClientMessageShowPublicCards.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageShowPublicCards, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageShowPublicCards;
  static deserializeBinaryFromReader(message: ClientMessageShowPublicCards, reader: jspb.BinaryReader): ClientMessageShowPublicCards;
}

export namespace ClientMessageShowPublicCards {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    round: protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap],
    consume: protobuf_holdem_define_pb.Def.ConsumeTypeMap[keyof protobuf_holdem_define_pb.Def.ConsumeTypeMap],
  }
}

export class ServerMessageShowPublicCards extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  clearPublicCardsList(): void;
  getPublicCardsList(): Array<number>;
  setPublicCardsList(value: Array<number>): void;
  addPublicCards(value: number, index?: number): number;

  getRound(): protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap];
  setRound(value: protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap]): void;

  clearPublicCards2List(): void;
  getPublicCards2List(): Array<number>;
  setPublicCards2List(value: Array<number>): void;
  addPublicCards2(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageShowPublicCards.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageShowPublicCards): ServerMessageShowPublicCards.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageShowPublicCards, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageShowPublicCards;
  static deserializeBinaryFromReader(message: ServerMessageShowPublicCards, reader: jspb.BinaryReader): ServerMessageShowPublicCards;
}

export namespace ServerMessageShowPublicCards {
  export type AsObject = {
    status: number,
    publicCardsList: Array<number>,
    round: protobuf_holdem_define_pb.Def.RoundMap[keyof protobuf_holdem_define_pb.Def.RoundMap],
    publicCards2List: Array<number>,
  }
}

