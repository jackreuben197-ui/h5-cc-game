// package: holdem.pb
// file: protobuf/holdem/req_th_view_player_cards_num.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageViewPlayerCardsNum extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageViewPlayerCardsNum.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageViewPlayerCardsNum): ClientMessageViewPlayerCardsNum.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageViewPlayerCardsNum, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageViewPlayerCardsNum;
  static deserializeBinaryFromReader(message: ClientMessageViewPlayerCardsNum, reader: jspb.BinaryReader): ClientMessageViewPlayerCardsNum;
}

export namespace ClientMessageViewPlayerCardsNum {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
  }
}

export class ServerMessageViewPlayerCardsNum extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getPayTimes(): number;
  setPayTimes(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageViewPlayerCardsNum.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageViewPlayerCardsNum): ServerMessageViewPlayerCardsNum.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageViewPlayerCardsNum, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageViewPlayerCardsNum;
  static deserializeBinaryFromReader(message: ServerMessageViewPlayerCardsNum, reader: jspb.BinaryReader): ServerMessageViewPlayerCardsNum;
}

export namespace ServerMessageViewPlayerCardsNum {
  export type AsObject = {
    status: number,
    payTimes: number,
  }
}

