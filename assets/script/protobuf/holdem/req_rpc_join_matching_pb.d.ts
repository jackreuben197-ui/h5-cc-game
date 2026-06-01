// package: holdem.pb
// file: protobuf/holdem/req_rpc_join_matching.proto

import * as jspb from "google-protobuf";

export class ClientMessageJoinMatching extends jspb.Message {
  getRpcId(): number;
  setRpcId(value: number): void;

  getRoomId(): number;
  setRoomId(value: number): void;

  getClubId(): number;
  setClubId(value: number): void;

  getBringIn(): number;
  setBringIn(value: number): void;

  getDeposit(): number;
  setDeposit(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageJoinMatching.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageJoinMatching): ClientMessageJoinMatching.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageJoinMatching, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageJoinMatching;
  static deserializeBinaryFromReader(message: ClientMessageJoinMatching, reader: jspb.BinaryReader): ClientMessageJoinMatching;
}

export namespace ClientMessageJoinMatching {
  export type AsObject = {
    rpcId: number,
    roomId: number,
    clubId: number,
    bringIn: number,
    deposit: number,
  }
}

export class ServerMessageJoinMatching extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getRpcId(): number;
  setRpcId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageJoinMatching.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageJoinMatching): ServerMessageJoinMatching.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageJoinMatching, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageJoinMatching;
  static deserializeBinaryFromReader(message: ServerMessageJoinMatching, reader: jspb.BinaryReader): ServerMessageJoinMatching;
}

export namespace ServerMessageJoinMatching {
  export type AsObject = {
    status: number,
    rpcId: number,
  }
}

