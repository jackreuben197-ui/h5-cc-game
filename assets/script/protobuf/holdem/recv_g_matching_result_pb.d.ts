// package: holdem.pb
// file: protobuf/holdem/recv_g_matching_result.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageMatchingResult extends jspb.Message {
  getStatus(): protobuf_holdem_define_pb.Def.MatchingResultStatusMap[keyof protobuf_holdem_define_pb.Def.MatchingResultStatusMap];
  setStatus(value: protobuf_holdem_define_pb.Def.MatchingResultStatusMap[keyof protobuf_holdem_define_pb.Def.MatchingResultStatusMap]): void;

  getRoomId(): number;
  setRoomId(value: number): void;

  hasToRoom(): boolean;
  clearToRoom(): void;
  getToRoom(): protobuf_holdem_define_pb.RoomWithType | undefined;
  setToRoom(value?: protobuf_holdem_define_pb.RoomWithType): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMatchingResult.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMatchingResult): ServerMessageMatchingResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMatchingResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMatchingResult;
  static deserializeBinaryFromReader(message: ServerMessageMatchingResult, reader: jspb.BinaryReader): ServerMessageMatchingResult;
}

export namespace ServerMessageMatchingResult {
  export type AsObject = {
    status: protobuf_holdem_define_pb.Def.MatchingResultStatusMap[keyof protobuf_holdem_define_pb.Def.MatchingResultStatusMap],
    roomId: number,
    toRoom?: protobuf_holdem_define_pb.RoomWithType.AsObject,
  }
}

