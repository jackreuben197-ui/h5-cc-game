// package: holdem.pb
// file: protobuf/holdem/req_ft_chat_members.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageFtChatMembers extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getIsHaveObserver(): boolean;
  setIsHaveObserver(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageFtChatMembers.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageFtChatMembers): ClientMessageFtChatMembers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageFtChatMembers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageFtChatMembers;
  static deserializeBinaryFromReader(message: ClientMessageFtChatMembers, reader: jspb.BinaryReader): ClientMessageFtChatMembers;
}

export namespace ClientMessageFtChatMembers {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    isHaveObserver: boolean,
  }
}

export class ServerMessageFtChatMembers extends jspb.Message {
  clearMembersList(): void;
  getMembersList(): Array<protobuf_holdem_define_pb.Roomer>;
  setMembersList(value: Array<protobuf_holdem_define_pb.Roomer>): void;
  addMembers(value?: protobuf_holdem_define_pb.Roomer, index?: number): protobuf_holdem_define_pb.Roomer;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtChatMembers.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtChatMembers): ServerMessageFtChatMembers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtChatMembers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtChatMembers;
  static deserializeBinaryFromReader(message: ServerMessageFtChatMembers, reader: jspb.BinaryReader): ServerMessageFtChatMembers;
}

export namespace ServerMessageFtChatMembers {
  export type AsObject = {
    membersList: Array<protobuf_holdem_define_pb.Roomer.AsObject>,
  }
}

