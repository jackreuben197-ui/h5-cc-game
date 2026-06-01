// package: holdem.pb
// file: protobuf/holdem/recv_th_side_pots.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ServerMessageSidePots extends jspb.Message {
  clearPotsList(): void;
  getPotsList(): Array<protobuf_holdem_define_pb.SidePot>;
  setPotsList(value: Array<protobuf_holdem_define_pb.SidePot>): void;
  addPots(value?: protobuf_holdem_define_pb.SidePot, index?: number): protobuf_holdem_define_pb.SidePot;

  clearSecondPotsList(): void;
  getSecondPotsList(): Array<protobuf_holdem_define_pb.SidePot>;
  setSecondPotsList(value: Array<protobuf_holdem_define_pb.SidePot>): void;
  addSecondPots(value?: protobuf_holdem_define_pb.SidePot, index?: number): protobuf_holdem_define_pb.SidePot;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageSidePots.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageSidePots): ServerMessageSidePots.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageSidePots, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageSidePots;
  static deserializeBinaryFromReader(message: ServerMessageSidePots, reader: jspb.BinaryReader): ServerMessageSidePots;
}

export namespace ServerMessageSidePots {
  export type AsObject = {
    potsList: Array<protobuf_holdem_define_pb.SidePot.AsObject>,
    secondPotsList: Array<protobuf_holdem_define_pb.SidePot.AsObject>,
  }
}

