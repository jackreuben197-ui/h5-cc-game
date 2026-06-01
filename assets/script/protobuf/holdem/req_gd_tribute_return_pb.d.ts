// package: holdem.pb
// file: protobuf/holdem/req_gd_tribute_return.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";
import * as protobuf_holdem_define_gd_pb from "../../protobuf/holdem/define_gd_pb";

export class ClientMessageGdTributeReturn extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  hasCard(): boolean;
  clearCard(): void;
  getCard(): protobuf_holdem_define_gd_pb.Card | undefined;
  setCard(value?: protobuf_holdem_define_gd_pb.Card): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageGdTributeReturn.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageGdTributeReturn): ClientMessageGdTributeReturn.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageGdTributeReturn, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageGdTributeReturn;
  static deserializeBinaryFromReader(message: ClientMessageGdTributeReturn, reader: jspb.BinaryReader): ClientMessageGdTributeReturn;
}

export namespace ClientMessageGdTributeReturn {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    card?: protobuf_holdem_define_gd_pb.Card.AsObject,
  }
}

export class ServerMessageGdTributeReturn extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdTributeReturn.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdTributeReturn): ServerMessageGdTributeReturn.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdTributeReturn, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdTributeReturn;
  static deserializeBinaryFromReader(message: ServerMessageGdTributeReturn, reader: jspb.BinaryReader): ServerMessageGdTributeReturn;
}

export namespace ServerMessageGdTributeReturn {
  export type AsObject = {
    status: number,
  }
}

