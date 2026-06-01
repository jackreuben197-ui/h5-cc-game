// package: holdem.pb
// file: protobuf/holdem/req_th_agree_post.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageAgreePost extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageAgreePost.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageAgreePost): ClientMessageAgreePost.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageAgreePost, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageAgreePost;
  static deserializeBinaryFromReader(message: ClientMessageAgreePost, reader: jspb.BinaryReader): ClientMessageAgreePost;
}

export namespace ClientMessageAgreePost {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
  }
}

export class ServerMessageAgreePost extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageAgreePost.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageAgreePost): ServerMessageAgreePost.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageAgreePost, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageAgreePost;
  static deserializeBinaryFromReader(message: ServerMessageAgreePost, reader: jspb.BinaryReader): ServerMessageAgreePost;
}

export namespace ServerMessageAgreePost {
  export type AsObject = {
    status: number,
  }
}

