// package: holdem.pb
// file: protobuf/holdem/recv_th_stand_up.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageStandup extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getReason(): protobuf_holdem_define_pb.Def.StandUpReasonMap[keyof protobuf_holdem_define_pb.Def.StandUpReasonMap];
  setReason(value: protobuf_holdem_define_pb.Def.StandUpReasonMap[keyof protobuf_holdem_define_pb.Def.StandUpReasonMap]): void;

  getBringOut(): number;
  setBringOut(value: number): void;

  getAccountChips(): number;
  setAccountChips(value: number): void;

  getFee(): number;
  setFee(value: number): void;

  getStoreChips(): number;
  setStoreChips(value: number): void;

  getWillLeave(): boolean;
  setWillLeave(value: boolean): void;

  getMuted(): boolean;
  setMuted(value: boolean): void;

  hasNextRoom(): boolean;
  clearNextRoom(): void;
  getNextRoom(): protobuf_holdem_define_pb.ChangeRoomInfo | undefined;
  setNextRoom(value?: protobuf_holdem_define_pb.ChangeRoomInfo): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageStandup.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageStandup): ServerMessageStandup.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageStandup, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageStandup;
  static deserializeBinaryFromReader(message: ServerMessageStandup, reader: jspb.BinaryReader): ServerMessageStandup;
}

export namespace ServerMessageStandup {
  export type AsObject = {
    seatId: number,
    reason: protobuf_holdem_define_pb.Def.StandUpReasonMap[keyof protobuf_holdem_define_pb.Def.StandUpReasonMap],
    bringOut: number,
    accountChips: number,
    fee: number,
    storeChips: number,
    willLeave: boolean,
    muted: boolean,
    nextRoom?: protobuf_holdem_define_pb.ChangeRoomInfo.AsObject,
  }
}

