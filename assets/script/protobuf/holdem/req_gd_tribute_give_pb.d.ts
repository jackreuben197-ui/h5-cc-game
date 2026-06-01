// package: holdem.pb
// file: protobuf/holdem/req_gd_tribute_give.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";
import * as protobuf_holdem_define_gd_pb from "../../protobuf/holdem/define_gd_pb";

export class ClientMessageGdTributeGive extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  hasCard(): boolean;
  clearCard(): void;
  getCard(): protobuf_holdem_define_gd_pb.Card | undefined;
  setCard(value?: protobuf_holdem_define_gd_pb.Card): void;

  getRefuse(): boolean;
  setRefuse(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageGdTributeGive.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageGdTributeGive): ClientMessageGdTributeGive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageGdTributeGive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageGdTributeGive;
  static deserializeBinaryFromReader(message: ClientMessageGdTributeGive, reader: jspb.BinaryReader): ClientMessageGdTributeGive;
}

export namespace ClientMessageGdTributeGive {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    card?: protobuf_holdem_define_gd_pb.Card.AsObject,
    refuse: boolean,
  }
}

export class ServerMessageGdTributeGive extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdTributeGive.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdTributeGive): ServerMessageGdTributeGive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdTributeGive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdTributeGive;
  static deserializeBinaryFromReader(message: ServerMessageGdTributeGive, reader: jspb.BinaryReader): ServerMessageGdTributeGive;
}

export namespace ServerMessageGdTributeGive {
  export type AsObject = {
    status: number,
  }
}

