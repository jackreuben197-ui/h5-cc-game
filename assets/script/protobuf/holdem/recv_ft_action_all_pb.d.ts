// package: holdem.pb
// file: protobuf/holdem/recv_ft_action_all.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_ft_pb from "../../protobuf/holdem/define_ft_pb";

export class ServerMessageFtActionAll extends jspb.Message {
  getOperatorSeatId(): number;
  setOperatorSeatId(value: number): void;

  clearCardIndexGroupsList(): void;
  getCardIndexGroupsList(): Array<protobuf_holdem_define_ft_pb.HandCardIndexGroup>;
  setCardIndexGroupsList(value: Array<protobuf_holdem_define_ft_pb.HandCardIndexGroup>): void;
  addCardIndexGroups(value?: protobuf_holdem_define_ft_pb.HandCardIndexGroup, index?: number): protobuf_holdem_define_ft_pb.HandCardIndexGroup;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageFtActionAll.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageFtActionAll): ServerMessageFtActionAll.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageFtActionAll, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageFtActionAll;
  static deserializeBinaryFromReader(message: ServerMessageFtActionAll, reader: jspb.BinaryReader): ServerMessageFtActionAll;
}

export namespace ServerMessageFtActionAll {
  export type AsObject = {
    operatorSeatId: number,
    cardIndexGroupsList: Array<protobuf_holdem_define_ft_pb.HandCardIndexGroup.AsObject>,
  }
}

