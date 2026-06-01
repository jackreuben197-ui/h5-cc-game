// package: holdem.pb
// file: protobuf/holdem/req_th_add_on.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageAddOn extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getUseProp(): boolean;
  setUseProp(value: boolean): void;

  getRatio(): number;
  setRatio(value: number): void;

  getMode(): protobuf_holdem_define_pb.Def.AddOnModeMap[keyof protobuf_holdem_define_pb.Def.AddOnModeMap];
  setMode(value: protobuf_holdem_define_pb.Def.AddOnModeMap[keyof protobuf_holdem_define_pb.Def.AddOnModeMap]): void;

  getUsedPropId(): number;
  setUsedPropId(value: number): void;

  getPropType(): number;
  setPropType(value: number): void;

  getUseFree(): boolean;
  setUseFree(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageAddOn.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageAddOn): ClientMessageAddOn.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageAddOn, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageAddOn;
  static deserializeBinaryFromReader(message: ClientMessageAddOn, reader: jspb.BinaryReader): ClientMessageAddOn;
}

export namespace ClientMessageAddOn {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    useProp: boolean,
    ratio: number,
    mode: protobuf_holdem_define_pb.Def.AddOnModeMap[keyof protobuf_holdem_define_pb.Def.AddOnModeMap],
    usedPropId: number,
    propType: number,
    useFree: boolean,
  }
}

export class ServerMessageAddOn extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getChips(): number;
  setChips(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageAddOn.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageAddOn): ServerMessageAddOn.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageAddOn, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageAddOn;
  static deserializeBinaryFromReader(message: ServerMessageAddOn, reader: jspb.BinaryReader): ServerMessageAddOn;
}

export namespace ServerMessageAddOn {
  export type AsObject = {
    status: number,
    chips: number,
  }
}

