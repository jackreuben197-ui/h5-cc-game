// package: holdem.pb
// file: protobuf/holdem/recv_mj_up_blind.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_mj_pb from "../../protobuf/holdem/define_mj_pb";

export class ServerMessageMjUpBlind extends jspb.Message {
  getPtLevel(): number;
  setPtLevel(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjUpBlind.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjUpBlind): ServerMessageMjUpBlind.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjUpBlind, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjUpBlind;
  static deserializeBinaryFromReader(message: ServerMessageMjUpBlind, reader: jspb.BinaryReader): ServerMessageMjUpBlind;
}

export namespace ServerMessageMjUpBlind {
  export type AsObject = {
    ptLevel: number,
  }
}

