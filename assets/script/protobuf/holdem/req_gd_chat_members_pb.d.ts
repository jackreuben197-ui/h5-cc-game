// package: holdem.pb
// file: protobuf/holdem/req_gd_chat_members.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageGdChatMembers extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getIsHaveObserver(): boolean;
  setIsHaveObserver(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageGdChatMembers.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageGdChatMembers): ClientMessageGdChatMembers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageGdChatMembers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageGdChatMembers;
  static deserializeBinaryFromReader(message: ClientMessageGdChatMembers, reader: jspb.BinaryReader): ClientMessageGdChatMembers;
}

export namespace ClientMessageGdChatMembers {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    isHaveObserver: boolean,
  }
}

export class ServerMessageGdChatMembers extends jspb.Message {
  clearMembersList(): void;
  getMembersList(): Array<protobuf_holdem_define_pb.Roomer>;
  setMembersList(value: Array<protobuf_holdem_define_pb.Roomer>): void;
  addMembers(value?: protobuf_holdem_define_pb.Roomer, index?: number): protobuf_holdem_define_pb.Roomer;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdChatMembers.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdChatMembers): ServerMessageGdChatMembers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdChatMembers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdChatMembers;
  static deserializeBinaryFromReader(message: ServerMessageGdChatMembers, reader: jspb.BinaryReader): ServerMessageGdChatMembers;
}

export namespace ServerMessageGdChatMembers {
  export type AsObject = {
    membersList: Array<protobuf_holdem_define_pb.Roomer.AsObject>,
  }
}

