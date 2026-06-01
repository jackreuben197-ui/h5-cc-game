// package: holdem.pb
// file: protobuf/holdem/req_rpc_mtt_detail.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageMttDetail extends jspb.Message {
  getMatchId(): number;
  setMatchId(value: number): void;

  getRpcId(): number;
  setRpcId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageMttDetail.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageMttDetail): ClientMessageMttDetail.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageMttDetail, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageMttDetail;
  static deserializeBinaryFromReader(message: ClientMessageMttDetail, reader: jspb.BinaryReader): ClientMessageMttDetail;
}

export namespace ClientMessageMttDetail {
  export type AsObject = {
    matchId: number,
    rpcId: number,
  }
}

export class ServerMessageMttDetail extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getRpcId(): number;
  setRpcId(value: number): void;

  hasMtt(): boolean;
  clearMtt(): void;
  getMtt(): protobuf_holdem_define_pb.MTTRecord | undefined;
  setMtt(value?: protobuf_holdem_define_pb.MTTRecord): void;

  hasMore(): boolean;
  clearMore(): void;
  getMore(): protobuf_holdem_define_pb.MTTMore | undefined;
  setMore(value?: protobuf_holdem_define_pb.MTTMore): void;

  getAlive(): number;
  setAlive(value: number): void;

  getStateCode(): number;
  setStateCode(value: number): void;

  getTop(): number;
  setTop(value: number): void;

  hasState(): boolean;
  clearState(): void;
  getState(): protobuf_holdem_define_pb.MTTUserStatus | undefined;
  setState(value?: protobuf_holdem_define_pb.MTTUserStatus): void;

  getIsAdmin(): boolean;
  setIsAdmin(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMttDetail.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMttDetail): ServerMessageMttDetail.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMttDetail, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMttDetail;
  static deserializeBinaryFromReader(message: ServerMessageMttDetail, reader: jspb.BinaryReader): ServerMessageMttDetail;
}

export namespace ServerMessageMttDetail {
  export type AsObject = {
    status: number,
    rpcId: number,
    mtt?: protobuf_holdem_define_pb.MTTRecord.AsObject,
    more?: protobuf_holdem_define_pb.MTTMore.AsObject,
    alive: number,
    stateCode: number,
    top: number,
    state?: protobuf_holdem_define_pb.MTTUserStatus.AsObject,
    isAdmin: boolean,
  }
}

