// package: holdem.pb
// file: protobuf/holdem/req_ft_action.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";
import * as protobuf_holdem_define_ft_pb from "../../protobuf/holdem/define_ft_pb";

export class ClientMessageFtAction extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  clearCardIndexGroupsList(): void;
  getCardIndexGroupsList(): Array<protobuf_holdem_define_ft_pb.HandCardIndexGroup>;
  setCardIndexGroupsList(value: Array<protobuf_holdem_define_ft_pb.HandCardIndexGroup>): void;
  addCardIndexGroups(value?: protobuf_holdem_define_ft_pb.HandCardIndexGroup, index?: number): protobuf_holdem_define_ft_pb.HandCardIndexGroup;

  getConfirm(): boolean;
  setConfirm(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageFtAction.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageFtAction): ClientMessageFtAction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageFtAction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageFtAction;
  static deserializeBinaryFromReader(message: ClientMessageFtAction, reader: jspb.BinaryReader): ClientMessageFtAction;
}

export namespace ClientMessageFtAction {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    cardIndexGroupsList: Array<protobuf_holdem_define_ft_pb.HandCardIndexGroup.AsObject>,
    confirm: boolean,
  }
}

export class ServerMessageFtAction extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtAction.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtAction): ServerMessageFtAction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtAction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtAction;
  static deserializeBinaryFromReader(message: ServerMessageFtAction, reader: jspb.BinaryReader): ServerMessageFtAction;
}

export namespace ServerMessageFtAction {
  export type AsObject = {
    status: number,
  }
}

