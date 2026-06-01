// package: holdem.pb
// file: protobuf/holdem/req_th_chat_members.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageChatMembers extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getIsHaveObserver(): boolean;
  setIsHaveObserver(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageChatMembers.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageChatMembers): ClientMessageChatMembers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageChatMembers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageChatMembers;
  static deserializeBinaryFromReader(message: ClientMessageChatMembers, reader: jspb.BinaryReader): ClientMessageChatMembers;
}

export namespace ClientMessageChatMembers {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    isHaveObserver: boolean,
  }
}

export class ServerMessageChatMembers extends jspb.Message {
  clearMembersList(): void;
  getMembersList(): Array<protobuf_holdem_define_pb.Roomer>;
  setMembersList(value: Array<protobuf_holdem_define_pb.Roomer>): void;
  addMembers(value?: protobuf_holdem_define_pb.Roomer, index?: number): protobuf_holdem_define_pb.Roomer;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageChatMembers.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageChatMembers): ServerMessageChatMembers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageChatMembers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageChatMembers;
  static deserializeBinaryFromReader(message: ServerMessageChatMembers, reader: jspb.BinaryReader): ServerMessageChatMembers;
}

export namespace ServerMessageChatMembers {
  export type AsObject = {
    membersList: Array<protobuf_holdem_define_pb.Roomer.AsObject>,
  }
}

