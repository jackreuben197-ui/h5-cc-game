// package: holdem.pb
// file: protobuf/holdem/recv_th_next_change.proto

import * as jspb from "google-protobuf";

export class ServerMessageNextChange extends jspb.Message {
  getAnte(): number;
  setAnte(value: number): void;

  getSmallBlind(): number;
  setSmallBlind(value: number): void;

  getIgnorePreflop(): boolean;
  setIgnorePreflop(value: boolean): void;

  getIsAlwaysSecondPcs(): boolean;
  setIsAlwaysSecondPcs(value: boolean): void;

  getInsurance(): boolean;
  setInsurance(value: boolean): void;

  getSquidOpen(): boolean;
  setSquidOpen(value: boolean): void;

  getSquidBase(): number;
  setSquidBase(value: number): void;

  getRoomType(): number;
  setRoomType(value: number): void;

  getCriticalHitOpen(): boolean;
  setCriticalHitOpen(value: boolean): void;

  getSquidTotalLimit(): number;
  setSquidTotalLimit(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageNextChange.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageNextChange): ServerMessageNextChange.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageNextChange, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageNextChange;
  static deserializeBinaryFromReader(message: ServerMessageNextChange, reader: jspb.BinaryReader): ServerMessageNextChange;
}

export namespace ServerMessageNextChange {
  export type AsObject = {
    ante: number,
    smallBlind: number,
    ignorePreflop: boolean,
    isAlwaysSecondPcs: boolean,
    insurance: boolean,
    squidOpen: boolean,
    squidBase: number,
    roomType: number,
    criticalHitOpen: boolean,
    squidTotalLimit: number,
  }
}

