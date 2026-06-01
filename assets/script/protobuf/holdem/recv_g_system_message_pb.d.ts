// package: holdem.pb
// file: protobuf/holdem/recv_g_system_message.proto

import * as jspb from "google-protobuf";

export class ServerMessageSystemMessage extends jspb.Message {
  getMessage(): string;
  setMessage(value: string): void;

  getRotateTimes(): number;
  setRotateTimes(value: number): void;

  clearClientTypesList(): void;
  getClientTypesList(): Array<number>;
  setClientTypesList(value: Array<number>): void;
  addClientTypes(value: number, index?: number): number;

  getStartTime(): number;
  setStartTime(value: number): void;

  getEndTime(): number;
  setEndTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageSystemMessage.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageSystemMessage): ServerMessageSystemMessage.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageSystemMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageSystemMessage;
  static deserializeBinaryFromReader(message: ServerMessageSystemMessage, reader: jspb.BinaryReader): ServerMessageSystemMessage;
}

export namespace ServerMessageSystemMessage {
  export type AsObject = {
    message: string,
    rotateTimes: number,
    clientTypesList: Array<number>,
    startTime: number,
    endTime: number,
  }
}

