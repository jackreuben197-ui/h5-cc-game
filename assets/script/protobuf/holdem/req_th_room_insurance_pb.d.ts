// package: holdem.pb
// file: protobuf/holdem/req_th_room_insurance.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessageRoomInsurance extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  getOffset(): number;
  setOffset(value: number): void;

  getLimit(): number;
  setLimit(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageRoomInsurance.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageRoomInsurance): ClientMessageRoomInsurance.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageRoomInsurance, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageRoomInsurance;
  static deserializeBinaryFromReader(message: ClientMessageRoomInsurance, reader: jspb.BinaryReader): ClientMessageRoomInsurance;
}

export namespace ClientMessageRoomInsurance {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
    offset: number,
    limit: number,
  }
}

export class ServerMessageRoomInsurance extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  getInsurance(): number;
  setInsurance(value: number): void;

  clearPlayerInsurancesList(): void;
  getPlayerInsurancesList(): Array<protobuf_holdem_define_pb.PlayerInsurance>;
  setPlayerInsurancesList(value: Array<protobuf_holdem_define_pb.PlayerInsurance>): void;
  addPlayerInsurances(value?: protobuf_holdem_define_pb.PlayerInsurance, index?: number): protobuf_holdem_define_pb.PlayerInsurance;

  getOffset(): number;
  setOffset(value: number): void;

  getLimit(): number;
  setLimit(value: number): void;

  getTotal(): number;
  setTotal(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageRoomInsurance.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageRoomInsurance): ServerMessageRoomInsurance.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageRoomInsurance, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageRoomInsurance;
  static deserializeBinaryFromReader(message: ServerMessageRoomInsurance, reader: jspb.BinaryReader): ServerMessageRoomInsurance;
}

export namespace ServerMessageRoomInsurance {
  export type AsObject = {
    status: number,
    insurance: number,
    playerInsurancesList: Array<protobuf_holdem_define_pb.PlayerInsurance.AsObject>,
    offset: number,
    limit: number,
    total: number,
  }
}

