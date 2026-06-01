// package: holdem.pb
// file: protobuf/holdem/recv_g_mtt_ready_for_apply.proto

import * as jspb from "google-protobuf";

export class ServerMessageMttReadyForApply extends jspb.Message {
  getMatchId(): number;
  setMatchId(value: number): void;

  getMatchName(): string;
  setMatchName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMttReadyForApply.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMttReadyForApply): ServerMessageMttReadyForApply.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMttReadyForApply, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMttReadyForApply;
  static deserializeBinaryFromReader(message: ServerMessageMttReadyForApply, reader: jspb.BinaryReader): ServerMessageMttReadyForApply;
}

export namespace ServerMessageMttReadyForApply {
  export type AsObject = {
    matchId: number,
    matchName: string,
  }
}

