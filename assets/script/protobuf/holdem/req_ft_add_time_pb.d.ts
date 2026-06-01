// package: holdem.pb
// file: protobuf/holdem/req_ft_add_time.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageFtAddTime extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getConsume(): protobuf_holdem_define_pb.Def.ConsumeTypeMap[keyof protobuf_holdem_define_pb.Def.ConsumeTypeMap];
  setConsume(value: protobuf_holdem_define_pb.Def.ConsumeTypeMap[keyof protobuf_holdem_define_pb.Def.ConsumeTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageFtAddTime.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageFtAddTime): ClientMessageFtAddTime.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageFtAddTime, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageFtAddTime;
  static deserializeBinaryFromReader(message: ClientMessageFtAddTime, reader: jspb.BinaryReader): ClientMessageFtAddTime;
}

export namespace ClientMessageFtAddTime {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    consume: protobuf_holdem_define_pb.Def.ConsumeTypeMap[keyof protobuf_holdem_define_pb.Def.ConsumeTypeMap],
  }
}

export class ServerMessageFtAddTime extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getTimes(): number;
  setTimes(value: number): void;

  getDuration(): number;
  setDuration(value: number): void;

  getDeadline(): number;
  setDeadline(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtAddTime.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtAddTime): ServerMessageFtAddTime.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtAddTime, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtAddTime;
  static deserializeBinaryFromReader(message: ServerMessageFtAddTime, reader: jspb.BinaryReader): ServerMessageFtAddTime;
}

export namespace ServerMessageFtAddTime {
  export type AsObject = {
    status: number,
    times: number,
    duration: number,
    deadline: number,
  }
}

