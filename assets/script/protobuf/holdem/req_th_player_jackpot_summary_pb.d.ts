// package: holdem.pb
// file: protobuf/holdem/req_th_player_jackpot_summary.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class ClientMessagePlayerJackpotSummary extends jspb.Message {
  hasRoom(): boolean;
  clearRoom(): void;
  getRoom(): protobuf_holdem_define_pb.Room | undefined;
  setRoom(value?: protobuf_holdem_define_pb.Room): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClientMessagePlayerJackpotSummary.AsObject;
  static toObject(includeInstance: boolean, msg: ClientMessagePlayerJackpotSummary): ClientMessagePlayerJackpotSummary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClientMessagePlayerJackpotSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClientMessagePlayerJackpotSummary;
  static deserializeBinaryFromReader(message: ClientMessagePlayerJackpotSummary, reader: jspb.BinaryReader): ClientMessagePlayerJackpotSummary;
}

export namespace ClientMessagePlayerJackpotSummary {
  export type AsObject = {
    room?: protobuf_holdem_define_pb.Room.AsObject,
  }
}

export class ServerMessagePlayerJackpotSummary extends jspb.Message {
  getStatus(): number;
  setStatus(value: number): void;

  clearPlayersList(): void;
  getPlayersList(): Array<protobuf_holdem_define_pb.PlayerJackpotSummary>;
  setPlayersList(value: Array<protobuf_holdem_define_pb.PlayerJackpotSummary>): void;
  addPlayers(value?: protobuf_holdem_define_pb.PlayerJackpotSummary, index?: number): protobuf_holdem_define_pb.PlayerJackpotSummary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ServerMessagePlayerJackpotSummary.AsObject;
  static toObject(includeInstance: boolean, msg: ServerMessagePlayerJackpotSummary): ServerMessagePlayerJackpotSummary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ServerMessagePlayerJackpotSummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ServerMessagePlayerJackpotSummary;
  static deserializeBinaryFromReader(message: ServerMessagePlayerJackpotSummary, reader: jspb.BinaryReader): ServerMessagePlayerJackpotSummary;
}

export namespace ServerMessagePlayerJackpotSummary {
  export type AsObject = {
    status: number,
    playersList: Array<protobuf_holdem_define_pb.PlayerJackpotSummary.AsObject>,
  }
}

