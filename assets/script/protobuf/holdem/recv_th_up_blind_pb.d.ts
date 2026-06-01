// package: holdem.pb
// file: protobuf/holdem/recv_th_up_blind.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageUpBlind extends jspb.Message {
  getAnte(): number;
  setAnte(value: number): void;

  getSmallBlind(): number;
  setSmallBlind(value: number): void;

  hasMttProgress(): boolean;
  clearMttProgress(): void;
  getMttProgress(): protobuf_holdem_define_pb.MTTProgress | undefined;
  setMttProgress(value?: protobuf_holdem_define_pb.MTTProgress): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageUpBlind.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageUpBlind): ServerMessageUpBlind.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageUpBlind, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageUpBlind;
  static deserializeBinaryFromReader(message: ServerMessageUpBlind, reader: jspb.BinaryReader): ServerMessageUpBlind;
}

export namespace ServerMessageUpBlind {
  export type AsObject = {
    ante: number,
    smallBlind: number,
    mttProgress?: protobuf_holdem_define_pb.MTTProgress.AsObject,
  }
}

