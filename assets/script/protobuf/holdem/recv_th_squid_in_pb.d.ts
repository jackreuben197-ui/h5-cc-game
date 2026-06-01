// package: holdem.pb
// file: protobuf/holdem/recv_th_squid_in.proto

import * as jspb from "google-protobuf";

export class ServerMessageSquidIn extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getEnable(): boolean;
  setEnable(value: boolean): void;

  getFirstIn(): boolean;
  setFirstIn(value: boolean): void;

  getSquidTotalLimit(): number;
  setSquidTotalLimit(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageSquidIn.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageSquidIn): ServerMessageSquidIn.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageSquidIn, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageSquidIn;
  static deserializeBinaryFromReader(message: ServerMessageSquidIn, reader: jspb.BinaryReader): ServerMessageSquidIn;
}

export namespace ServerMessageSquidIn {
  export type AsObject = {
    seatId: number,
    enable: boolean,
    firstIn: boolean,
    squidTotalLimit: number,
  }
}

