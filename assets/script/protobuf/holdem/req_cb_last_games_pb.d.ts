// package: holdem.pb
// file: protobuf/holdem/req_cb_last_games.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_cb_pb from "../../protobuf/holdem/define_cb_pb";

export class ClientMessageCbLastGames extends jspb.Message {
  getRoomId(): number;
  setRoomId(value: number): void;

  getLimit(): number;
  setLimit(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessageCbLastGames.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessageCbLastGames): ClientMessageCbLastGames.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessageCbLastGames, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessageCbLastGames;
  static deserializeBinaryFromReader(message: ClientMessageCbLastGames, reader: jspb.BinaryReader): ClientMessageCbLastGames;
}

export namespace ClientMessageCbLastGames {
  export type AsObject = {
    roomId: number,
    limit: number,
  }
}

export class ServerMessageCbLastGames extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  clearGamesList(): void;
  getGamesList(): Array<protobuf_holdem_define_cb_pb.CBGameHistorySummary>;
  setGamesList(value: Array<protobuf_holdem_define_cb_pb.CBGameHistorySummary>): void;
  addGames(value?: protobuf_holdem_define_cb_pb.CBGameHistorySummary, index?: number): protobuf_holdem_define_cb_pb.CBGameHistorySummary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessageCbLastGames.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessageCbLastGames): ServerMessageCbLastGames.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessageCbLastGames, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessageCbLastGames;
  static deserializeBinaryFromReader(message: ServerMessageCbLastGames, reader: jspb.BinaryReader): ServerMessageCbLastGames;
}

export namespace ServerMessageCbLastGames {
  export type AsObject = {
    status: number,
    gamesList: Array<protobuf_holdem_define_cb_pb.CBGameHistorySummary.AsObject>,
  }
}

