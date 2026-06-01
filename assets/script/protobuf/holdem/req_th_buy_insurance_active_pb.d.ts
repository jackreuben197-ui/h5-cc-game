// package: holdem.pb
// file: protobuf/holdem/req_th_buy_insurance_active.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageBuyInsuranceActive extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  clearBuyList(): void;
  getBuyList(): Array<protobuf_holdem_define_pb.PotInsuranceBuy>;
  setBuyList(value: Array<protobuf_holdem_define_pb.PotInsuranceBuy>): void;
  addBuy(value?: protobuf_holdem_define_pb.PotInsuranceBuy, index?: number): protobuf_holdem_define_pb.PotInsuranceBuy;

  getConfirm(): boolean;
  setConfirm(value: boolean): void;

  getStep(): boolean;
  setStep(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageBuyInsuranceActive.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageBuyInsuranceActive): ClientMessageBuyInsuranceActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageBuyInsuranceActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageBuyInsuranceActive;
  static deserializeBinaryFromReader(message: ClientMessageBuyInsuranceActive, reader: jspb.BinaryReader): ClientMessageBuyInsuranceActive;
}

export namespace ClientMessageBuyInsuranceActive {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    buyList: Array<protobuf_holdem_define_pb.PotInsuranceBuy.AsObject>,
    confirm: boolean,
    step: boolean,
  }
}

export class ServerMessageBuyInsuranceActive extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageBuyInsuranceActive.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageBuyInsuranceActive): ServerMessageBuyInsuranceActive.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageBuyInsuranceActive, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageBuyInsuranceActive;
  static deserializeBinaryFromReader(message: ServerMessageBuyInsuranceActive, reader: jspb.BinaryReader): ServerMessageBuyInsuranceActive;
}

export namespace ServerMessageBuyInsuranceActive {
  export type AsObject = {
    status: number,
  }
}

