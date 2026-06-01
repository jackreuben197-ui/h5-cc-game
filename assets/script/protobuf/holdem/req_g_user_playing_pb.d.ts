// package: holdem.pb
// file: protobuf/holdem/req_g_user_playing.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageUserPlaying extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageUserPlaying.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageUserPlaying): ClientMessageUserPlaying.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageUserPlaying, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageUserPlaying;
  static deserializeBinaryFromReader(message: ClientMessageUserPlaying, reader: jspb.BinaryReader): ClientMessageUserPlaying;
}

export namespace ClientMessageUserPlaying {
  export type AsObject = {
  }
}

export class ServerMessageUserPlaying extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  clearRoomsMttsList(): void;
  getRoomsMttsList(): Array<protobuf_holdem_define_pb.RoomWithType>;
  setRoomsMttsList(value: Array<protobuf_holdem_define_pb.RoomWithType>): void;
  addRoomsMtts(value?: protobuf_holdem_define_pb.RoomWithType, index?: number): protobuf_holdem_define_pb.RoomWithType;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageUserPlaying.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageUserPlaying): ServerMessageUserPlaying.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageUserPlaying, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageUserPlaying;
  static deserializeBinaryFromReader(message: ServerMessageUserPlaying, reader: jspb.BinaryReader): ServerMessageUserPlaying;
}

export namespace ServerMessageUserPlaying {
  export type AsObject = {
    status: number,
    roomsMttsList: Array<protobuf_holdem_define_pb.RoomWithType.AsObject>,
  }
}

