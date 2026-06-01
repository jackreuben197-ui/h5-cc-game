// package: holdem.pb
// file: protobuf/holdem/req_gd_action.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";
import * as protobuf_holdem_define_gd_pb from "../../protobuf/holdem/define_gd_pb";

export class ClientMessageGdAction extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getAction(): protobuf_holdem_define_gd_pb.DefGD.ActionGdMap[keyof protobuf_holdem_define_gd_pb.DefGD.ActionGdMap];
  setAction(value: protobuf_holdem_define_gd_pb.DefGD.ActionGdMap[keyof protobuf_holdem_define_gd_pb.DefGD.ActionGdMap]): void;

  hasDiscardCards(): boolean;
  clearDiscardCards(): void;
  getDiscardCards(): protobuf_holdem_define_gd_pb.ValidCards | undefined;
  setDiscardCards(value?: protobuf_holdem_define_gd_pb.ValidCards): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageGdAction.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageGdAction): ClientMessageGdAction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageGdAction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageGdAction;
  static deserializeBinaryFromReader(message: ClientMessageGdAction, reader: jspb.BinaryReader): ClientMessageGdAction;
}

export namespace ClientMessageGdAction {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    action: protobuf_holdem_define_gd_pb.DefGD.ActionGdMap[keyof protobuf_holdem_define_gd_pb.DefGD.ActionGdMap],
    discardCards?: protobuf_holdem_define_gd_pb.ValidCards.AsObject,
  }
}

export class ServerMessageGdAction extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdAction.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdAction): ServerMessageGdAction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdAction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdAction;
  static deserializeBinaryFromReader(message: ServerMessageGdAction, reader: jspb.BinaryReader): ServerMessageGdAction;
}

export namespace ServerMessageGdAction {
  export type AsObject = {
    status: number,
  }
}

