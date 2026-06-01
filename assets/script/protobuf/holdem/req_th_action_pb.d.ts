// package: holdem.pb
// file: protobuf/holdem/req_th_action.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageAction extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getAction(): protobuf_holdem_define_pb.Def.ActionMap[keyof protobuf_holdem_define_pb.Def.ActionMap];
  setAction(value: protobuf_holdem_define_pb.Def.ActionMap[keyof protobuf_holdem_define_pb.Def.ActionMap]): void;

  getAmount(): number;
  setAmount(value: number): void;

  getClubId(): number;
  setClubId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageAction.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageAction): ClientMessageAction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageAction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageAction;
  static deserializeBinaryFromReader(message: ClientMessageAction, reader: jspb.BinaryReader): ClientMessageAction;
}

export namespace ClientMessageAction {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    action: protobuf_holdem_define_pb.Def.ActionMap[keyof protobuf_holdem_define_pb.Def.ActionMap],
    amount: number,
    clubId: number,
  }
}

export class ServerMessageAction extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageAction.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageAction): ServerMessageAction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageAction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageAction;
  static deserializeBinaryFromReader(message: ServerMessageAction, reader: jspb.BinaryReader): ServerMessageAction;
}

export namespace ServerMessageAction {
  export type AsObject = {
    status: number,
  }
}

