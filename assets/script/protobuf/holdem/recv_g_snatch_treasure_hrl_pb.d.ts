// package: holdem.pb
// file: protobuf/holdem/recv_g_snatch_treasure_hrl.proto

import * as jspb from "google-protobuf";

export class ServerMessageSnatchTreasureHrl extends jspb.Message {
  getCode(): number;
  setCode(value: number): void;

  getData(): string;
  setData(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageSnatchTreasureHrl.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageSnatchTreasureHrl): ServerMessageSnatchTreasureHrl.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageSnatchTreasureHrl, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageSnatchTreasureHrl;
  static deserializeBinaryFromReader(message: ServerMessageSnatchTreasureHrl, reader: jspb.BinaryReader): ServerMessageSnatchTreasureHrl;
}

export namespace ServerMessageSnatchTreasureHrl {
  export type AsObject = {
    code: number,
    data: string,
  }
}

