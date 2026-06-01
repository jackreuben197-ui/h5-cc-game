// package: holdem.pb
// file: protobuf/holdem/req_mj_chat_members.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageMjChatMembers extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getIsHaveObserver(): boolean;
  setIsHaveObserver(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageMjChatMembers.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageMjChatMembers): ClientMessageMjChatMembers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageMjChatMembers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageMjChatMembers;
  static deserializeBinaryFromReader(message: ClientMessageMjChatMembers, reader: jspb.BinaryReader): ClientMessageMjChatMembers;
}

export namespace ClientMessageMjChatMembers {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    isHaveObserver: boolean,
  }
}

export class ServerMessageMjChatMembers extends jspb.Message {
  clearMembersList(): void;
  getMembersList(): Array<protobuf_holdem_define_pb.Roomer>;
  setMembersList(value: Array<protobuf_holdem_define_pb.Roomer>): void;
  addMembers(value?: protobuf_holdem_define_pb.Roomer, index?: number): protobuf_holdem_define_pb.Roomer;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjChatMembers.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjChatMembers): ServerMessageMjChatMembers.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjChatMembers, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjChatMembers;
  static deserializeBinaryFromReader(message: ServerMessageMjChatMembers, reader: jspb.BinaryReader): ServerMessageMjChatMembers;
}

export namespace ServerMessageMjChatMembers {
  export type AsObject = {
    membersList: Array<protobuf_holdem_define_pb.Roomer.AsObject>,
  }
}

