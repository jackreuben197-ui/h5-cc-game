// package: holdem.pb
// file: protobuf/holdem/recv_mj_sync_hand.proto

import * as jspb from "google-protobuf";

export class ServerMessageMjSyncHand extends jspb.Message {
  getStartTime(): number;
  setStartTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageMjSyncHand.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageMjSyncHand): ServerMessageMjSyncHand.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageMjSyncHand, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageMjSyncHand;
  static deserializeBinaryFromReader(message: ServerMessageMjSyncHand, reader: jspb.BinaryReader): ServerMessageMjSyncHand;
}

export namespace ServerMessageMjSyncHand {
  export type AsObject = {
    startTime: number,
  }
}

