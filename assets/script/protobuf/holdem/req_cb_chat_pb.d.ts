// package: holdem.pb
// file: protobuf/holdem/req_cb_chat.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_cb_pb from "../../protobuf/holdem/define_cb_pb";

export class ClientMessageCbChat extends jspb.Message {
  getConsume(): protobuf_holdem_define_cb_pb.DefCB.ConsumeTypeMap[keyof protobuf_holdem_define_cb_pb.DefCB.ConsumeTypeMap];
  setConsume(value: protobuf_holdem_define_cb_pb.DefCB.ConsumeTypeMap[keyof protobuf_holdem_define_cb_pb.DefCB.ConsumeTypeMap]): void;

  getMessage(): string;
  setMessage(value: string): void;

  getExtra(): Uint8Array | string;
  getExtra_asU8(): Uint8Array;
  getExtra_asB64(): string;
  setExtra(value: Uint8Array | string): void;

  getRoomId(): number;
  setRoomId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageCbChat.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageCbChat): ClientMessageCbChat.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageCbChat, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageCbChat;
  static deserializeBinaryFromReader(message: ClientMessageCbChat, reader: jspb.BinaryReader): ClientMessageCbChat;
}

export namespace ClientMessageCbChat {
  export type AsObject = {
    consume: protobuf_holdem_define_cb_pb.DefCB.ConsumeTypeMap[keyof protobuf_holdem_define_cb_pb.DefCB.ConsumeTypeMap],
    message: string,
    extra: Uint8Array | string,
    roomId: number,
  }
}

export class ServerMessageCbChat extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageCbChat.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageCbChat): ServerMessageCbChat.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageCbChat, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageCbChat;
  static deserializeBinaryFromReader(message: ServerMessageCbChat, reader: jspb.BinaryReader): ServerMessageCbChat;
}

export namespace ServerMessageCbChat {
  export type AsObject = {
    status: number,
  }
}

