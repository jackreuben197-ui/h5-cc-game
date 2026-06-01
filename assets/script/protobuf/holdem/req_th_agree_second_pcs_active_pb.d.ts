// package: holdem.pb
// file: protobuf/holdem/req_th_agree_second_pcs_active.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageAgreeSecondPcsActive extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getAgree(): boolean;
  setAgree(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageAgreeSecondPcsActive.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageAgreeSecondPcsActive): ClientMessageAgreeSecondPcsActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageAgreeSecondPcsActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageAgreeSecondPcsActive;
  static deserializeBinaryFromReader(message: ClientMessageAgreeSecondPcsActive, reader: jspb.BinaryReader): ClientMessageAgreeSecondPcsActive;
}

export namespace ClientMessageAgreeSecondPcsActive {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    agree: boolean,
  }
}

export class ServerMessageAgreeSecondPcsActive extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageAgreeSecondPcsActive.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageAgreeSecondPcsActive): ServerMessageAgreeSecondPcsActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageAgreeSecondPcsActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageAgreeSecondPcsActive;
  static deserializeBinaryFromReader(message: ServerMessageAgreeSecondPcsActive, reader: jspb.BinaryReader): ServerMessageAgreeSecondPcsActive;
}

export namespace ServerMessageAgreeSecondPcsActive {
  export type AsObject = {
    status: number,
  }
}

