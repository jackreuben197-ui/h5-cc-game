// package: holdem.pb
// file: protobuf/holdem/recv_g_self_profit_pay.proto

import * as jspb from "google-protobuf";

export class ServerMessageSelfProfitPay extends jspb.Message {
  getBillId(): number;
  setBillId(value: number): void;

  getAmount(): number;
  setAmount(value: number): void;

  getClubRid(): number;
  setClubRid(value: number): void;

  getClubname(): string;
  setClubname(value: string): void;

  getGoldType(): number;
  setGoldType(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageSelfProfitPay.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageSelfProfitPay): ServerMessageSelfProfitPay.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageSelfProfitPay, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageSelfProfitPay;
  static deserializeBinaryFromReader(message: ServerMessageSelfProfitPay, reader: jspb.BinaryReader): ServerMessageSelfProfitPay;
}

export namespace ServerMessageSelfProfitPay {
  export type AsObject = {
    billId: number,
    amount: number,
    clubRid: number,
    clubname: string,
    goldType: number,
  }
}

