// package: holdem.pb
// file: protobuf/holdem/req_mj_add_time.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageMjAddTime extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getConsume(): protobuf_holdem_define_pb.Def.ConsumeTypeMap[keyof protobuf_holdem_define_pb.Def.ConsumeTypeMap];
  setConsume(value: protobuf_holdem_define_pb.Def.ConsumeTypeMap[keyof protobuf_holdem_define_pb.Def.ConsumeTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageMjAddTime.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageMjAddTime): ClientMessageMjAddTime.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageMjAddTime, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageMjAddTime;
  static deserializeBinaryFromReader(message: ClientMessageMjAddTime, reader: jspb.BinaryReader): ClientMessageMjAddTime;
}

export namespace ClientMessageMjAddTime {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    consume: protobuf_holdem_define_pb.Def.ConsumeTypeMap[keyof protobuf_holdem_define_pb.Def.ConsumeTypeMap],
  }
}

export class ServerMessageMjAddTime extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getTimes(): number;
  setTimes(value: number): void;

  getDuration(): number;
  setDuration(value: number): void;

  getDeadline(): number;
  setDeadline(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjAddTime.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjAddTime): ServerMessageMjAddTime.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjAddTime, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjAddTime;
  static deserializeBinaryFromReader(message: ServerMessageMjAddTime, reader: jspb.BinaryReader): ServerMessageMjAddTime;
}

export namespace ServerMessageMjAddTime {
  export type AsObject = {
    status: number,
    times: number,
    duration: number,
    deadline: number,
  }
}

