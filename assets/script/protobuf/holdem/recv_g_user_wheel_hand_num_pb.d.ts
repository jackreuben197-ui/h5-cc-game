// package: holdem.pb
// file: protobuf/holdem/recv_g_user_wheel_hand_num.proto

import * as jspb from "google-protobuf";

export class ServerMessageUserWheelHandNum extends jspb.Message {
  getUserId(): number;
  setUserId(value: number): void;

  getWheelTemplateId(): number;
  setWheelTemplateId(value: number): void;

  getLotteryHandNum(): number;
  setLotteryHandNum(value: number): void;

  getUserHandNum(): number;
  setUserHandNum(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageUserWheelHandNum.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageUserWheelHandNum): ServerMessageUserWheelHandNum.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageUserWheelHandNum, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageUserWheelHandNum;
  static deserializeBinaryFromReader(message: ServerMessageUserWheelHandNum, reader: jspb.BinaryReader): ServerMessageUserWheelHandNum;
}

export namespace ServerMessageUserWheelHandNum {
  export type AsObject = {
    userId: number,
    wheelTemplateId: number,
    lotteryHandNum: number,
    userHandNum: number,
  }
}

