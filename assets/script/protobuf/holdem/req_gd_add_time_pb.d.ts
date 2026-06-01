// package: holdem.pb
// file: protobuf/holdem/req_gd_add_time.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageGdAddTime extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getConsume(): protobuf_holdem_define_pb.Def.ConsumeTypeMap[keyof protobuf_holdem_define_pb.Def.ConsumeTypeMap];
  setConsume(value: protobuf_holdem_define_pb.Def.ConsumeTypeMap[keyof protobuf_holdem_define_pb.Def.ConsumeTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageGdAddTime.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageGdAddTime): ClientMessageGdAddTime.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageGdAddTime, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageGdAddTime;
  static deserializeBinaryFromReader(message: ClientMessageGdAddTime, reader: jspb.BinaryReader): ClientMessageGdAddTime;
}

export namespace ClientMessageGdAddTime {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    consume: protobuf_holdem_define_pb.Def.ConsumeTypeMap[keyof protobuf_holdem_define_pb.Def.ConsumeTypeMap],
  }
}

export class ServerMessageGdAddTime extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getTimes(): number;
  setTimes(value: number): void;

  getDuration(): number;
  setDuration(value: number): void;

  getDeadline(): number;
  setDeadline(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageGdAddTime.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageGdAddTime): ServerMessageGdAddTime.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageGdAddTime, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageGdAddTime;
  static deserializeBinaryFromReader(message: ServerMessageGdAddTime, reader: jspb.BinaryReader): ServerMessageGdAddTime;
}

export namespace ServerMessageGdAddTime {
  export type AsObject = {
    status: number,
    times: number,
    duration: number,
    deadline: number,
  }
}

