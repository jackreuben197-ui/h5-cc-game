// package: holdem.pb
// file: protobuf/holdem/recv_g_room_user_send_diamond.proto

import * as jspb from "google-protobuf";

export class ServerMessageRoomUserSendDiamond extends jspb.Message {
  getSenderId(): number;
  setSenderId(value: number): void;

  getSenderRid(): number;
  setSenderRid(value: number): void;

  getRecieveId(): number;
  setRecieveId(value: number): void;

  getRecieveRid(): number;
  setRecieveRid(value: number): void;

  getAmount(): number;
  setAmount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageRoomUserSendDiamond.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageRoomUserSendDiamond): ServerMessageRoomUserSendDiamond.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageRoomUserSendDiamond, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageRoomUserSendDiamond;
  static deserializeBinaryFromReader(message: ServerMessageRoomUserSendDiamond, reader: jspb.BinaryReader): ServerMessageRoomUserSendDiamond;
}

export namespace ServerMessageRoomUserSendDiamond {
  export type AsObject = {
    senderId: number,
    senderRid: number,
    recieveId: number,
    recieveRid: number,
    amount: number,
  }
}

