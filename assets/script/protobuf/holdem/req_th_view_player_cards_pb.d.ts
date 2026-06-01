// package: holdem.pb
// file: protobuf/holdem/req_th_view_player_cards.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageViewPlayerCards extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getTargetSeatId(): number;
  setTargetSeatId(value: number): void;

  getTargetUserRid(): number;
  setTargetUserRid(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageViewPlayerCards.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageViewPlayerCards): ClientMessageViewPlayerCards.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageViewPlayerCards, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageViewPlayerCards;
  static deserializeBinaryFromReader(message: ClientMessageViewPlayerCards, reader: jspb.BinaryReader): ClientMessageViewPlayerCards;
}

export namespace ClientMessageViewPlayerCards {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    targetSeatId: number,
    targetUserRid: number,
  }
}

export class ServerMessageViewPlayerCards extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageViewPlayerCards.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageViewPlayerCards): ServerMessageViewPlayerCards.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageViewPlayerCards, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageViewPlayerCards;
  static deserializeBinaryFromReader(message: ServerMessageViewPlayerCards, reader: jspb.BinaryReader): ServerMessageViewPlayerCards;
}

export namespace ServerMessageViewPlayerCards {
  export type AsObject = {
    status: number,
  }
}

