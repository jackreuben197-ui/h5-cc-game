// package: holdem.pb
// file: protobuf/holdem/recv_th_sync_hand.proto

import * as jspb from "google-protobuf";

export class ServerMessageSyncHand extends jspb.Message {
  getStartTime(): number;
  setStartTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageSyncHand.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageSyncHand): ServerMessageSyncHand.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageSyncHand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageSyncHand;
  static deserializeBinaryFromReader(message: ServerMessageSyncHand, reader: jspb.BinaryReader): ServerMessageSyncHand;
}

export namespace ServerMessageSyncHand {
  export type AsObject = {
    startTime: number,
  }
}

