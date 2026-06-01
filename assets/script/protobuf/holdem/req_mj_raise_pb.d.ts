// package: holdem.pb
// file: protobuf/holdem/req_mj_raise.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageMjRaise extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getRaise(): number;
  setRaise(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageMjRaise.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageMjRaise): ClientMessageMjRaise.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageMjRaise, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageMjRaise;
  static deserializeBinaryFromReader(message: ClientMessageMjRaise, reader: jspb.BinaryReader): ClientMessageMjRaise;
}

export namespace ClientMessageMjRaise {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    raise: number,
  }
}

export class ServerMessageMjRaise extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjRaise.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjRaise): ServerMessageMjRaise.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjRaise, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjRaise;
  static deserializeBinaryFromReader(message: ServerMessageMjRaise, reader: jspb.BinaryReader): ServerMessageMjRaise;
}

export namespace ServerMessageMjRaise {
  export type AsObject = {
    status: number,
  }
}

