// package: holdem.pb
// file: protobuf/holdem/recv_g_snatch_treasure_win_popup.proto

import * as jspb from "google-protobuf";

export class ServerMessageSnatchTreasureWinPopup extends jspb.Message {
  getCode(): number;
  setCode(value: number): void;

  getData(): string;
  setData(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageSnatchTreasureWinPopup.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageSnatchTreasureWinPopup): ServerMessageSnatchTreasureWinPopup.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageSnatchTreasureWinPopup, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageSnatchTreasureWinPopup;
  static deserializeBinaryFromReader(message: ServerMessageSnatchTreasureWinPopup, reader: jspb.BinaryReader): ServerMessageSnatchTreasureWinPopup;
}

export namespace ServerMessageSnatchTreasureWinPopup {
  export type AsObject = {
    code: number,
    data: string,
  }
}

