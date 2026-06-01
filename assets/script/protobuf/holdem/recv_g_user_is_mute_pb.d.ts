// package: holdem.pb
// file: protobuf/holdem/recv_g_user_is_mute.proto

import * as jspb from "google-protobuf";

export class ServerMessageUserIsMute extends jspb.Message {
  getClubId(): number;
  setClubId(value: number): void;

  getTribeId(): number;
  setTribeId(value: number): void;

  getMute(): boolean;
  setMute(value: boolean): void;

  getUserId(): number;
  setUserId(value: number): void;

  getUserRandomId(): number;
  setUserRandomId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageUserIsMute.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageUserIsMute): ServerMessageUserIsMute.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageUserIsMute, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageUserIsMute;
  static deserializeBinaryFromReader(message: ServerMessageUserIsMute, reader: jspb.BinaryReader): ServerMessageUserIsMute;
}

export namespace ServerMessageUserIsMute {
  export type AsObject = {
    clubId: number,
    tribeId: number,
    mute: boolean,
    userId: number,
    userRandomId: number,
  }
}

