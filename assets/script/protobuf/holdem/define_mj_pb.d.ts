// package: holdem.pb
// file: protobuf/holdem/define_mj.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class DefMJ extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DefMJ.AsObject;
  static toObject(includeInstance: boolean, msg: DefMJ): DefMJ.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DefMJ, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DefMJ;
  static deserializeBinaryFromReader(message: DefMJ, reader: jspb.BinaryReader): DefMJ;
}

export namespace DefMJ {
  export type AsObject = {
  }

  export interface WaitTypeMap {
    WT_NONE: 0;
    WT_TURN: 1;
    WT_CLAIM: 2;
    WT_EXCHANGE: 3;
    WT_VOIDSUIT: 4;
    WT_RAISE: 5;
  }

  export const WaitType: WaitTypeMap;

  export interface TileTypeMap {
    TT_NONE: 0;
    TT_CHARACTOR: 1;
    TT_DOT: 2;
    TT_BAMBOO: 3;
    TT_WIND: 4;
    TT_DRAGON: 5;
    TT_FLOWER: 6;
    TT_JOKER: 7;
  }

  export const TileType: TileTypeMap;

  export interface ActionMjMap {
    NONE: 0;
    DISCARD: 1;
    MELDEDKONG1: 2;
    CONCEALEDKONG: 3;
    CHOW: 4;
    PUNG: 5;
    MELDEDKONG3: 6;
    WIN: 7;
    DRAW: 8;
    PASS: 9;
    JOKERKONG: 10;
  }

  export const ActionMj: ActionMjMap;

  export interface WinLoseReasonMap {
    WLRNONE: 0;
    WR_SELFDRAW: 1;
    WR_DISCARD: 2;
    WR_DRAW_CHECK: 4;
    WR_VS_CHECK: 5;
    WR_MELDEDKONG1_AWD: 6;
    WR_MELDEDKONG1_AWD_R: 7;
    WR_MELDEDKONG1_AWD_RROB: 8;
    LR_SELF_DRAW: 9;
    LR_DISCARD: 10;
    LR_DRAW_CHECK: 12;
    LR_VS_CHECK: 13;
    LR_MELDEDKONG1_AWD: 14;
    LR_MELDEDKONG1_AWD_R: 15;
    LR_MELDEDKONG1_AWD_RROB: 16;
    WLR_DRAW: 17;
    WR_CONCEALEDKONG_AWD: 18;
    WR_CONCEALEDKONG_AWD_R: 19;
    WR_MELDEDKONG3_AWD: 21;
    WR_MELDEDKONG3_AWD_R: 22;
    LR_CONCEALEDKONG_AWD: 24;
    LR_CONCEALEDKONG_AWD_R: 25;
    LR_MELDEDKONG3_AWD: 27;
    LR_MELDEDKONG3_AWD_R: 28;
    WR_KONG_TRANSFER: 29;
    WR_KONG_TRANSFER_R: 30;
    WR_RAISE: 31;
    WR_FOLLOW_DEALER: 32;
    LR_KONG_TRANSFER: 33;
    LR_KONG_TRANSFER_R: 34;
    LR_RAISE: 35;
    LR_FOLLOW_DEALER: 36;
    WR_ONE_MATCH_MORE_WIN: 37;
    LR_ONE_MATCH_MORE_WIN: 38;
    WR_SIMPLE_HORSE: 39;
    LR_SIMPLE_HORSE: 40;
  }

  export const WinLoseReason: WinLoseReasonMap;

  export interface WinTypeMap {
    WNT_NONE: 0;
    WNT_BASEHAND: 1;
    WNT_ALLPUNGS: 2;
    WNT_FULLFLUSH: 3;
    WNT_OUTSIDEHAND: 4;
    WNT_SEVENPAIRS: 5;
    WNT_FFALLPUNGS: 6;
    WNT_SINGLETILEALLPUNGS: 7;
    WNT_EYESPAIRS: 8;
    WNT_DRAGONSEVENPAIRS: 9;
    WNT_FFSEVENPAIRS: 10;
    WNT_FFSINGLETILEALLPUNGS: 11;
    WNT_FFOUTSIDEHAND: 12;
    WNT_FFDRAGONSEVENPAIRS: 13;
    WNT_BLESSOFHEAVEN: 14;
    WNT_BLESSOFEARTH: 15;
    WNT_TILEHOG: 16;
    WNT_MKONGCOUNT: 17;
    WNT_CKONGCOUNT: 18;
    WNT_ROBKONG: 19;
    WNT_OUTWITHREPLACEMENTTILE: 20;
    WNT_OUTWITHREPLACEMENTTILEDISCARD: 21;
    WNT_SELFDRAWN: 22;
    WNT_LASTTILEDRAW: 23;
    WNT_LASTTILECLAIM: 24;
    WNT_CHICKENHAND: 25;
    WNT_PURESTRAIGHT: 26;
    WNT_THIRTEENORPHANS: 27;
    WNT_MELDEDHAND: 28;
    WNT_CONCEALED: 29;
    WNT_FFFOURKONGS: 30;
    WNT_EYESTHREEDRAGONSEVENPAIRS: 31;
    WNT_FOURKONGS: 32;
    WNT_NINEGATES1: 33;
    WNT_NINEGATES2: 34;
    WNT_EYESDOUBLEDRAGONSEVENPAIRS: 35;
    WNT_PURETERMINALCHOWS: 36;
    WNT_THREEDRAGONSEVENPAIRS: 37;
    WNT_DOUBLEDRAGONSEVENPAIRS: 38;
    WNT_SINGLETILEALLPUNGSJOKER: 39;
    WNT_EYESSEVENPAIRS: 40;
    WNT_FOURCONCEALEDPUNGS: 41;
    WNT_FOURPURIFYSHIFTEDPUNGS: 42;
    WNT_THREEKONGS: 43;
    WNT_ALLEVENPUNGS: 44;
    WNT_THREEPURIFYSHIFTEDPUNGS: 45;
    WNT_THREECONCEALEDPUNGS: 46;
    WNT_ALLSIMPLE: 47;
    WNT_NOJOKER: 48;
    WNT_DOUBLEPUNGS: 49;
    WNT_SHORTSTRAIGHT: 50;
    WNT_HALFFLUSH: 51;
  }

  export const WinType: WinTypeMap;

  export interface ActionFailReasonMap {
    AFRNONE: 0;
    AFRMAX: 1;
    AFRROBKONG: 2;
  }

  export const ActionFailReason: ActionFailReasonMap;

  export interface ExtraReasonMap {
    ER_NONE: 0;
    ER_ROBKONG: 1;
    ER_OUTWITHREPLACEMENTTILEDISCARD: 2;
    ER_12: 3;
  }

  export const ExtraReason: ExtraReasonMap;

  export interface ExchangeModeMap {
    EXMODE_LEFT: 0;
    EXMODE_RIGHT: 1;
    EXMODE_OPPOSITE: 2;
  }

  export const ExchangeMode: ExchangeModeMap;

  export interface ActionAllTypeMap {
    AAT_NONE: 0;
    AAT_CLAIM: 1;
    AAT_READY_HAND: 2;
    AAT_ACTION: 3;
  }

  export const ActionAllType: ActionAllTypeMap;
}

export class Tile extends jspb.Message {
  getIndex(): number;
  setIndex(value: number): void;

  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Tile.AsObject;
  static toObject(includeInstance: boolean, msg: Tile): Tile.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Tile, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Tile;
  static deserializeBinaryFromReader(message: Tile, reader: jspb.BinaryReader): Tile;
}

export namespace Tile {
  export type AsObject = {
    index: number,
    value: number,
  }
}

export class ValidAction extends jspb.Message {
  getAction(): DefMJ.ActionMjMap[keyof DefMJ.ActionMjMap];
  setAction(value: DefMJ.ActionMjMap[keyof DefMJ.ActionMjMap]): void;

  clearTilesList(): void;
  getTilesList(): Array<number>;
  setTilesList(value: Array<number>): void;
  addTiles(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidAction.AsObject;
  static toObject(includeInstance: boolean, msg: ValidAction): ValidAction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidAction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidAction;
  static deserializeBinaryFromReader(message: ValidAction, reader: jspb.BinaryReader): ValidAction;
}

export namespace ValidAction {
  export type AsObject = {
    action: DefMJ.ActionMjMap[keyof DefMJ.ActionMjMap],
    tilesList: Array<number>,
  }
}

export class RoomInfoMJ extends jspb.Message {
  getScheduleStartTime(): number;
  setScheduleStartTime(value: number): void;

  getSchedulePlayDuration(): number;
  setSchedulePlayDuration(value: number): void;

  getStartTime(): number;
  setStartTime(value: number): void;

  getCurrentMinStack(): number;
  setCurrentMinStack(value: number): void;

  getCurrentMinRate(): number;
  setCurrentMinRate(value: number): void;

  getCurrentMaxRate(): number;
  setCurrentMaxRate(value: number): void;

  getCurrentMaxWinrate(): number;
  setCurrentMaxWinrate(value: number): void;

  getPtLevel(): number;
  setPtLevel(value: number): void;

  getUniqueId(): string;
  setUniqueId(value: string): void;

  getRoomType(): number;
  setRoomType(value: number): void;

  getLimitIp(): boolean;
  setLimitIp(value: boolean): void;

  getLimitGps(): boolean;
  setLimitGps(value: boolean): void;

  getOpDuration(): number;
  setOpDuration(value: number): void;

  getSeatedMessaging(): boolean;
  setSeatedMessaging(value: boolean): void;

  getAntiCheatType(): number;
  setAntiCheatType(value: number): void;

  getAntiCheatVideoType(): number;
  setAntiCheatVideoType(value: number): void;

  getPersonalType(): number;
  setPersonalType(value: number): void;

  getMode(): protobuf_holdem_define_pb.Def.RoomModeMap[keyof protobuf_holdem_define_pb.Def.RoomModeMap];
  setMode(value: protobuf_holdem_define_pb.Def.RoomModeMap[keyof protobuf_holdem_define_pb.Def.RoomModeMap]): void;

  clearRuleMjList(): void;
  getRuleMjList(): Array<protobuf_holdem_define_pb.RuleUnit>;
  setRuleMjList(value: Array<protobuf_holdem_define_pb.RuleUnit>): void;
  addRuleMj(value?: protobuf_holdem_define_pb.RuleUnit, index?: number): protobuf_holdem_define_pb.RuleUnit;

  getStraddleOn(): number;
  setStraddleOn(value: number): void;

  getStraddleMax(): number;
  setStraddleMax(value: number): void;

  getInsuranceOpDuration(): number;
  setInsuranceOpDuration(value: number): void;

  getSecondPcsOpDuration(): number;
  setSecondPcsOpDuration(value: number): void;

  getSecondPcsUserLimit(): number;
  setSecondPcsUserLimit(value: number): void;

  getDelayViewCardOn(): number;
  setDelayViewCardOn(value: number): void;

  getPostOn(): number;
  setPostOn(value: number): void;

  getMuckOn(): number;
  setMuckOn(value: number): void;

  getBombpot(): number;
  setBombpot(value: number): void;

  getKongTransfer(): number;
  setKongTransfer(value: number): void;

  getKongWinOfDiscard(): number;
  setKongWinOfDiscard(value: number): void;

  getSelfDrawnType(): number;
  setSelfDrawnType(value: number): void;

  hasWinTypeRule(): boolean;
  clearWinTypeRule(): void;
  getWinTypeRule(): protobuf_holdem_define_pb.WinTypeRule | undefined;
  setWinTypeRule(value?: protobuf_holdem_define_pb.WinTypeRule): void;

  getKongWinOfDiscardType(): number;
  setKongWinOfDiscardType(value: number): void;

  getJoker(): number;
  setJoker(value: number): void;

  getWinWay(): number;
  setWinWay(value: number): void;

  getSingleHolder(): number;
  setSingleHolder(value: number): void;

  getRobKongHolder(): number;
  setRobKongHolder(value: number): void;

  getRobKong(): number;
  setRobKong(value: number): void;

  getWallType(): number;
  setWallType(value: number): void;

  getFollowDealer(): number;
  setFollowDealer(value: number): void;

  getRaise(): number;
  setRaise(value: number): void;

  getJokerCount(): number;
  setJokerCount(value: number): void;

  getOneMatchMoreWin(): number;
  setOneMatchMoreWin(value: number): void;

  getSimpleHorseMode(): number;
  setSimpleHorseMode(value: number): void;

  getSimpleHorseCount(): number;
  setSimpleHorseCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RoomInfoMJ.AsObject;
  static toObject(includeInstance: boolean, msg: RoomInfoMJ): RoomInfoMJ.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RoomInfoMJ, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RoomInfoMJ;
  static deserializeBinaryFromReader(message: RoomInfoMJ, reader: jspb.BinaryReader): RoomInfoMJ;
}

export namespace RoomInfoMJ {
  export type AsObject = {
    scheduleStartTime: number,
    schedulePlayDuration: number,
    startTime: number,
    currentMinStack: number,
    currentMinRate: number,
    currentMaxRate: number,
    currentMaxWinrate: number,
    ptLevel: number,
    uniqueId: string,
    roomType: number,
    limitIp: boolean,
    limitGps: boolean,
    opDuration: number,
    seatedMessaging: boolean,
    antiCheatType: number,
    antiCheatVideoType: number,
    personalType: number,
    mode: protobuf_holdem_define_pb.Def.RoomModeMap[keyof protobuf_holdem_define_pb.Def.RoomModeMap],
    ruleMjList: Array<protobuf_holdem_define_pb.RuleUnit.AsObject>,
    straddleOn: number,
    straddleMax: number,
    insuranceOpDuration: number,
    secondPcsOpDuration: number,
    secondPcsUserLimit: number,
    delayViewCardOn: number,
    postOn: number,
    muckOn: number,
    bombpot: number,
    kongTransfer: number,
    kongWinOfDiscard: number,
    selfDrawnType: number,
    winTypeRule?: protobuf_holdem_define_pb.WinTypeRule.AsObject,
    kongWinOfDiscardType: number,
    joker: number,
    winWay: number,
    singleHolder: number,
    robKongHolder: number,
    robKong: number,
    wallType: number,
    followDealer: number,
    raise: number,
    jokerCount: number,
    oneMatchMoreWin: number,
    simpleHorseMode: number,
    simpleHorseCount: number,
  }
}

export class MatchInfoMJ extends jspb.Message {
  getMatchNum(): number;
  setMatchNum(value: number): void;

  getDealerSeatId(): number;
  setDealerSeatId(value: number): void;

  getWallAscIndex(): number;
  setWallAscIndex(value: number): void;

  getWallDescIndex(): number;
  setWallDescIndex(value: number): void;

  getWallTileLength(): number;
  setWallTileLength(value: number): void;

  clearDiceNumList(): void;
  getDiceNumList(): Array<number>;
  setDiceNumList(value: Array<number>): void;
  addDiceNum(value: number, index?: number): number;

  getWaitDeadline(): number;
  setWaitDeadline(value: number): void;

  getWallLeft(): number;
  setWallLeft(value: number): void;

  getWaitType(): DefMJ.WaitTypeMap[keyof DefMJ.WaitTypeMap];
  setWaitType(value: DefMJ.WaitTypeMap[keyof DefMJ.WaitTypeMap]): void;

  getDraw(): boolean;
  setDraw(value: boolean): void;

  getFinal(): boolean;
  setFinal(value: boolean): void;

  hasLastDiscard(): boolean;
  clearLastDiscard(): void;
  getLastDiscard(): Tile | undefined;
  setLastDiscard(value?: Tile): void;

  getJoker(): number;
  setJoker(value: number): void;

  hasRandomForJoker(): boolean;
  clearRandomForJoker(): void;
  getRandomForJoker(): Tile | undefined;
  setRandomForJoker(value?: Tile): void;

  getJokerCount(): number;
  setJokerCount(value: number): void;

  getWinWay(): number;
  setWinWay(value: number): void;

  getRaise(): boolean;
  setRaise(value: boolean): void;

  getFollowDealer(): boolean;
  setFollowDealer(value: boolean): void;

  getRealJokerValue(): number;
  setRealJokerValue(value: number): void;

  clearHorseTilesList(): void;
  getHorseTilesList(): Array<number>;
  setHorseTilesList(value: Array<number>): void;
  addHorseTiles(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MatchInfoMJ.AsObject;
  static toObject(includeInstance: boolean, msg: MatchInfoMJ): MatchInfoMJ.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MatchInfoMJ, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MatchInfoMJ;
  static deserializeBinaryFromReader(message: MatchInfoMJ, reader: jspb.BinaryReader): MatchInfoMJ;
}

export namespace MatchInfoMJ {
  export type AsObject = {
    matchNum: number,
    dealerSeatId: number,
    wallAscIndex: number,
    wallDescIndex: number,
    wallTileLength: number,
    diceNumList: Array<number>,
    waitDeadline: number,
    wallLeft: number,
    waitType: DefMJ.WaitTypeMap[keyof DefMJ.WaitTypeMap],
    draw: boolean,
    pb_final: boolean,
    lastDiscard?: Tile.AsObject,
    joker: number,
    randomForJoker?: Tile.AsObject,
    jokerCount: number,
    winWay: number,
    raise: boolean,
    followDealer: boolean,
    realJokerValue: number,
    horseTilesList: Array<number>,
  }
}

export class ExchangeFlower extends jspb.Message {
  clearFlowersList(): void;
  getFlowersList(): Array<Tile>;
  setFlowersList(value: Array<Tile>): void;
  addFlowers(value?: Tile, index?: number): Tile;

  clearTilesList(): void;
  getTilesList(): Array<Tile>;
  setTilesList(value: Array<Tile>): void;
  addTiles(value?: Tile, index?: number): Tile;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExchangeFlower.AsObject;
  static toObject(includeInstance: boolean, msg: ExchangeFlower): ExchangeFlower.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExchangeFlower, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExchangeFlower;
  static deserializeBinaryFromReader(message: ExchangeFlower, reader: jspb.BinaryReader): ExchangeFlower;
}

export namespace ExchangeFlower {
  export type AsObject = {
    flowersList: Array<Tile.AsObject>,
    tilesList: Array<Tile.AsObject>,
  }
}

export class PlayerPrepareMJ extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getChip(): number;
  setChip(value: number): void;

  getWaitType(): DefMJ.WaitTypeMap[keyof DefMJ.WaitTypeMap];
  setWaitType(value: DefMJ.WaitTypeMap[keyof DefMJ.WaitTypeMap]): void;

  getWaitDeadline(): number;
  setWaitDeadline(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerPrepareMJ.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerPrepareMJ): PlayerPrepareMJ.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerPrepareMJ, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerPrepareMJ;
  static deserializeBinaryFromReader(message: PlayerPrepareMJ, reader: jspb.BinaryReader): PlayerPrepareMJ;
}

export namespace PlayerPrepareMJ {
  export type AsObject = {
    seatId: number,
    chip: number,
    waitType: DefMJ.WaitTypeMap[keyof DefMJ.WaitTypeMap],
    waitDeadline: number,
  }
}

export class PlayerStartInfoMJ extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  clearOrderTilesList(): void;
  getOrderTilesList(): Array<Tile>;
  setOrderTilesList(value: Array<Tile>): void;
  addOrderTiles(value?: Tile, index?: number): Tile;

  clearExchangeTilesList(): void;
  getExchangeTilesList(): Array<ExchangeFlower>;
  setExchangeTilesList(value: Array<ExchangeFlower>): void;
  addExchangeTiles(value?: ExchangeFlower, index?: number): ExchangeFlower;

  hasLastTile(): boolean;
  clearLastTile(): void;
  getLastTile(): Tile | undefined;
  setLastTile(value?: Tile): void;

  getChip(): number;
  setChip(value: number): void;

  getWaitType(): DefMJ.WaitTypeMap[keyof DefMJ.WaitTypeMap];
  setWaitType(value: DefMJ.WaitTypeMap[keyof DefMJ.WaitTypeMap]): void;

  getWaitDeadline(): number;
  setWaitDeadline(value: number): void;

  clearValidActionsList(): void;
  getValidActionsList(): Array<ValidAction>;
  setValidActionsList(value: Array<ValidAction>): void;
  addValidActions(value?: ValidAction, index?: number): ValidAction;

  clearFlowersList(): void;
  getFlowersList(): Array<number>;
  setFlowersList(value: Array<number>): void;
  addFlowers(value: number, index?: number): number;

  getHandTileLength(): number;
  setHandTileLength(value: number): void;

  clearReadyTilesList(): void;
  getReadyTilesList(): Array<ReadyTile>;
  setReadyTilesList(value: Array<ReadyTile>): void;
  addReadyTiles(value?: ReadyTile, index?: number): ReadyTile;

  getDefaultVoid(): DefMJ.TileTypeMap[keyof DefMJ.TileTypeMap];
  setDefaultVoid(value: DefMJ.TileTypeMap[keyof DefMJ.TileTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerStartInfoMJ.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerStartInfoMJ): PlayerStartInfoMJ.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerStartInfoMJ, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerStartInfoMJ;
  static deserializeBinaryFromReader(message: PlayerStartInfoMJ, reader: jspb.BinaryReader): PlayerStartInfoMJ;
}

export namespace PlayerStartInfoMJ {
  export type AsObject = {
    seatId: number,
    orderTilesList: Array<Tile.AsObject>,
    exchangeTilesList: Array<ExchangeFlower.AsObject>,
    lastTile?: Tile.AsObject,
    chip: number,
    waitType: DefMJ.WaitTypeMap[keyof DefMJ.WaitTypeMap],
    waitDeadline: number,
    validActionsList: Array<ValidAction.AsObject>,
    flowersList: Array<number>,
    handTileLength: number,
    readyTilesList: Array<ReadyTile.AsObject>,
    defaultVoid: DefMJ.TileTypeMap[keyof DefMJ.TileTypeMap],
  }
}

export class PlayerMJ extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getUserRid(): number;
  setUserRid(value: number): void;

  clearHandTilesList(): void;
  getHandTilesList(): Array<Tile>;
  setHandTilesList(value: Array<Tile>): void;
  addHandTiles(value?: Tile, index?: number): Tile;

  hasLastTile(): boolean;
  clearLastTile(): void;
  getLastTile(): Tile | undefined;
  setLastTile(value?: Tile): void;

  getHandTileLength(): number;
  setHandTileLength(value: number): void;

  getVoidSuit(): DefMJ.TileTypeMap[keyof DefMJ.TileTypeMap];
  setVoidSuit(value: DefMJ.TileTypeMap[keyof DefMJ.TileTypeMap]): void;

  clearDiscardTilesList(): void;
  getDiscardTilesList(): Array<Tile>;
  setDiscardTilesList(value: Array<Tile>): void;
  addDiscardTiles(value?: Tile, index?: number): Tile;

  clearMkongList(): void;
  getMkongList(): Array<number>;
  setMkongList(value: Array<number>): void;
  addMkong(value: number, index?: number): number;

  clearCkongList(): void;
  getCkongList(): Array<number>;
  setCkongList(value: Array<number>): void;
  addCkong(value: number, index?: number): number;

  clearChowList(): void;
  getChowList(): Array<number>;
  setChowList(value: Array<number>): void;
  addChow(value: number, index?: number): number;

  clearFlowersList(): void;
  getFlowersList(): Array<number>;
  setFlowersList(value: Array<number>): void;
  addFlowers(value: number, index?: number): number;

  clearPungList(): void;
  getPungList(): Array<number>;
  setPungList(value: Array<number>): void;
  addPung(value: number, index?: number): number;

  getName(): string;
  setName(value: string): void;

  getAvatar(): string;
  setAvatar(value: string): void;

  getSex(): number;
  setSex(value: number): void;

  getChip(): number;
  setChip(value: number): void;

  getKeepSeatLeftTime(): number;
  setKeepSeatLeftTime(value: number): void;

  getIsAutoop(): boolean;
  setIsAutoop(value: boolean): void;

  getVip(): number;
  setVip(value: number): void;

  getKeepSeatDeadline(): number;
  setKeepSeatDeadline(value: number): void;

  getKeepSeatReason(): protobuf_holdem_define_pb.Def.KeepSeatReasonMap[keyof protobuf_holdem_define_pb.Def.KeepSeatReasonMap];
  setKeepSeatReason(value: protobuf_holdem_define_pb.Def.KeepSeatReasonMap[keyof protobuf_holdem_define_pb.Def.KeepSeatReasonMap]): void;

  getStatus(): protobuf_holdem_define_pb.Def.CanPlayStatusMap[keyof protobuf_holdem_define_pb.Def.CanPlayStatusMap];
  setStatus(value: protobuf_holdem_define_pb.Def.CanPlayStatusMap[keyof protobuf_holdem_define_pb.Def.CanPlayStatusMap]): void;

  getUserSubscriptionId(): number;
  setUserSubscriptionId(value: number): void;

  getWin(): boolean;
  setWin(value: boolean): void;

  getTotalWinLose(): number;
  setTotalWinLose(value: number): void;

  clearResultDetailList(): void;
  getResultDetailList(): Array<ResultDetailMJ>;
  setResultDetailList(value: Array<ResultDetailMJ>): void;
  addResultDetail(value?: ResultDetailMJ, index?: number): ResultDetailMJ;

  clearReadyTilesList(): void;
  getReadyTilesList(): Array<ReadyTile>;
  setReadyTilesList(value: Array<ReadyTile>): void;
  addReadyTiles(value?: ReadyTile, index?: number): ReadyTile;

  getRaise(): number;
  setRaise(value: number): void;

  clearJkongList(): void;
  getJkongList(): Array<number>;
  setJkongList(value: Array<number>): void;
  addJkong(value: number, index?: number): number;

  getDefaultVoid(): DefMJ.TileTypeMap[keyof DefMJ.TileTypeMap];
  setDefaultVoid(value: DefMJ.TileTypeMap[keyof DefMJ.TileTypeMap]): void;

  clearClaimActionsList(): void;
  getClaimActionsList(): Array<ClaimAction>;
  setClaimActionsList(value: Array<ClaimAction>): void;
  addClaimActions(value?: ClaimAction, index?: number): ClaimAction;

  getNeedBringIn(): boolean;
  setNeedBringIn(value: boolean): void;

  getLoseAll(): boolean;
  setLoseAll(value: boolean): void;

  getNeedBringInDeadline(): number;
  setNeedBringInDeadline(value: number): void;

  getIsOffline(): boolean;
  setIsOffline(value: boolean): void;

  getIpAddr(): string;
  setIpAddr(value: string): void;

  getVideoMaskId(): number;
  setVideoMaskId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerMJ.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerMJ): PlayerMJ.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerMJ, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerMJ;
  static deserializeBinaryFromReader(message: PlayerMJ, reader: jspb.BinaryReader): PlayerMJ;
}

export namespace PlayerMJ {
  export type AsObject = {
    seatId: number,
    userRid: number,
    handTilesList: Array<Tile.AsObject>,
    lastTile?: Tile.AsObject,
    handTileLength: number,
    voidSuit: DefMJ.TileTypeMap[keyof DefMJ.TileTypeMap],
    discardTilesList: Array<Tile.AsObject>,
    mkongList: Array<number>,
    ckongList: Array<number>,
    chowList: Array<number>,
    flowersList: Array<number>,
    pungList: Array<number>,
    name: string,
    avatar: string,
    sex: number,
    chip: number,
    keepSeatLeftTime: number,
    isAutoop: boolean,
    vip: number,
    keepSeatDeadline: number,
    keepSeatReason: protobuf_holdem_define_pb.Def.KeepSeatReasonMap[keyof protobuf_holdem_define_pb.Def.KeepSeatReasonMap],
    status: protobuf_holdem_define_pb.Def.CanPlayStatusMap[keyof protobuf_holdem_define_pb.Def.CanPlayStatusMap],
    userSubscriptionId: number,
    win: boolean,
    totalWinLose: number,
    resultDetailList: Array<ResultDetailMJ.AsObject>,
    readyTilesList: Array<ReadyTile.AsObject>,
    raise: number,
    jkongList: Array<number>,
    defaultVoid: DefMJ.TileTypeMap[keyof DefMJ.TileTypeMap],
    claimActionsList: Array<ClaimAction.AsObject>,
    needBringIn: boolean,
    loseAll: boolean,
    needBringInDeadline: number,
    isOffline: boolean,
    ipAddr: string,
    videoMaskId: number,
  }
}

export class MyGameInfoMJ extends jspb.Message {
  getChip(): number;
  setChip(value: number): void;

  getSeatId(): number;
  setSeatId(value: number): void;

  getIsAutoop(): boolean;
  setIsAutoop(value: boolean): void;

  getName(): string;
  setName(value: string): void;

  getAvatar(): string;
  setAvatar(value: string): void;

  getSex(): number;
  setSex(value: number): void;

  getUserSubscriptionId(): number;
  setUserSubscriptionId(value: number): void;

  getWantSeat(): protobuf_holdem_define_pb.Def.WantSeatTypeMap[keyof protobuf_holdem_define_pb.Def.WantSeatTypeMap];
  setWantSeat(value: protobuf_holdem_define_pb.Def.WantSeatTypeMap[keyof protobuf_holdem_define_pb.Def.WantSeatTypeMap]): void;

  getMttCurrentRank(): number;
  setMttCurrentRank(value: number): void;

  getMttRemaindDelayTimes(): number;
  setMttRemaindDelayTimes(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MyGameInfoMJ.AsObject;
  static toObject(includeInstance: boolean, msg: MyGameInfoMJ): MyGameInfoMJ.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MyGameInfoMJ, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MyGameInfoMJ;
  static deserializeBinaryFromReader(message: MyGameInfoMJ, reader: jspb.BinaryReader): MyGameInfoMJ;
}

export namespace MyGameInfoMJ {
  export type AsObject = {
    chip: number,
    seatId: number,
    isAutoop: boolean,
    name: string,
    avatar: string,
    sex: number,
    userSubscriptionId: number,
    wantSeat: protobuf_holdem_define_pb.Def.WantSeatTypeMap[keyof protobuf_holdem_define_pb.Def.WantSeatTypeMap],
    mttCurrentRank: number,
    mttRemaindDelayTimes: number,
  }
}

export class PlayerVoidSuit extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getTt(): DefMJ.TileTypeMap[keyof DefMJ.TileTypeMap];
  setTt(value: DefMJ.TileTypeMap[keyof DefMJ.TileTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerVoidSuit.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerVoidSuit): PlayerVoidSuit.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerVoidSuit, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerVoidSuit;
  static deserializeBinaryFromReader(message: PlayerVoidSuit, reader: jspb.BinaryReader): PlayerVoidSuit;
}

export namespace PlayerVoidSuit {
  export type AsObject = {
    seatId: number,
    tt: DefMJ.TileTypeMap[keyof DefMJ.TileTypeMap],
  }
}

export class PlayerRaise extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getRaise(): number;
  setRaise(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerRaise.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerRaise): PlayerRaise.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerRaise, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerRaise;
  static deserializeBinaryFromReader(message: PlayerRaise, reader: jspb.BinaryReader): PlayerRaise;
}

export namespace PlayerRaise {
  export type AsObject = {
    seatId: number,
    raise: number,
  }
}

export class ClaimValidAction extends jspb.Message {
  clearValidActionsList(): void;
  getValidActionsList(): Array<ValidAction>;
  setValidActionsList(value: Array<ValidAction>): void;
  addValidActions(value?: ValidAction, index?: number): ValidAction;

  hasTargetTile(): boolean;
  clearTargetTile(): void;
  getTargetTile(): Tile | undefined;
  setTargetTile(value?: Tile): void;

  getTargetSeatId(): number;
  setTargetSeatId(value: number): void;

  getTargetAciton(): DefMJ.ActionMjMap[keyof DefMJ.ActionMjMap];
  setTargetAciton(value: DefMJ.ActionMjMap[keyof DefMJ.ActionMjMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimValidAction.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimValidAction): ClaimValidAction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClaimValidAction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimValidAction;
  static deserializeBinaryFromReader(message: ClaimValidAction, reader: jspb.BinaryReader): ClaimValidAction;
}

export namespace ClaimValidAction {
  export type AsObject = {
    validActionsList: Array<ValidAction.AsObject>,
    targetTile?: Tile.AsObject,
    targetSeatId: number,
    targetAciton: DefMJ.ActionMjMap[keyof DefMJ.ActionMjMap],
  }
}

export class TurnValidAction extends jspb.Message {
  clearValidActionsList(): void;
  getValidActionsList(): Array<ValidAction>;
  setValidActionsList(value: Array<ValidAction>): void;
  addValidActions(value?: ValidAction, index?: number): ValidAction;

  getLastAction(): DefMJ.ActionMjMap[keyof DefMJ.ActionMjMap];
  setLastAction(value: DefMJ.ActionMjMap[keyof DefMJ.ActionMjMap]): void;

  getAscDraw(): boolean;
  setAscDraw(value: boolean): void;

  hasLastTile(): boolean;
  clearLastTile(): void;
  getLastTile(): Tile | undefined;
  setLastTile(value?: Tile): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TurnValidAction.AsObject;
  static toObject(includeInstance: boolean, msg: TurnValidAction): TurnValidAction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TurnValidAction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TurnValidAction;
  static deserializeBinaryFromReader(message: TurnValidAction, reader: jspb.BinaryReader): TurnValidAction;
}

export namespace TurnValidAction {
  export type AsObject = {
    validActionsList: Array<ValidAction.AsObject>,
    lastAction: DefMJ.ActionMjMap[keyof DefMJ.ActionMjMap],
    ascDraw: boolean,
    lastTile?: Tile.AsObject,
  }
}

export class OperatorMJ extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getDelayTimes(): number;
  setDelayTimes(value: number): void;

  getOpDeadline(): number;
  setOpDeadline(value: number): void;

  getWaitType(): DefMJ.WaitTypeMap[keyof DefMJ.WaitTypeMap];
  setWaitType(value: DefMJ.WaitTypeMap[keyof DefMJ.WaitTypeMap]): void;

  hasClaimAction(): boolean;
  clearClaimAction(): void;
  getClaimAction(): ClaimValidAction | undefined;
  setClaimAction(value?: ClaimValidAction): void;

  hasTurnAction(): boolean;
  clearTurnAction(): void;
  getTurnAction(): TurnValidAction | undefined;
  setTurnAction(value?: TurnValidAction): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OperatorMJ.AsObject;
  static toObject(includeInstance: boolean, msg: OperatorMJ): OperatorMJ.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OperatorMJ, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OperatorMJ;
  static deserializeBinaryFromReader(message: OperatorMJ, reader: jspb.BinaryReader): OperatorMJ;
}

export namespace OperatorMJ {
  export type AsObject = {
    seatId: number,
    delayTimes: number,
    opDeadline: number,
    waitType: DefMJ.WaitTypeMap[keyof DefMJ.WaitTypeMap],
    claimAction?: ClaimValidAction.AsObject,
    turnAction?: TurnValidAction.AsObject,
  }
}

export class PlayerSummaryMJ extends jspb.Message {
  getUserRid(): number;
  setUserRid(value: number): void;

  getName(): string;
  setName(value: string): void;

  getAvatar(): string;
  setAvatar(value: string): void;

  getSex(): number;
  setSex(value: number): void;

  getHandNum(): number;
  setHandNum(value: number): void;

  getBringInTotal(): number;
  setBringInTotal(value: number): void;

  getBringOutTotal(): number;
  setBringOutTotal(value: number): void;

  getChip(): number;
  setChip(value: number): void;

  getWin(): number;
  setWin(value: number): void;

  getStatus(): protobuf_holdem_define_pb.Def.CanPlayStatusMap[keyof protobuf_holdem_define_pb.Def.CanPlayStatusMap];
  setStatus(value: protobuf_holdem_define_pb.Def.CanPlayStatusMap[keyof protobuf_holdem_define_pb.Def.CanPlayStatusMap]): void;

  getIsOnline(): boolean;
  setIsOnline(value: boolean): void;

  getWinSelfDrawCount(): number;
  setWinSelfDrawCount(value: number): void;

  getWinDiscardCount(): number;
  setWinDiscardCount(value: number): void;

  getLoseDiscardCount(): number;
  setLoseDiscardCount(value: number): void;

  getConcealedKongCount(): number;
  setConcealedKongCount(value: number): void;

  getExposedKongCount(): number;
  setExposedKongCount(value: number): void;

  getLoseKongCount(): number;
  setLoseKongCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerSummaryMJ.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerSummaryMJ): PlayerSummaryMJ.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerSummaryMJ, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerSummaryMJ;
  static deserializeBinaryFromReader(message: PlayerSummaryMJ, reader: jspb.BinaryReader): PlayerSummaryMJ;
}

export namespace PlayerSummaryMJ {
  export type AsObject = {
    userRid: number,
    name: string,
    avatar: string,
    sex: number,
    handNum: number,
    bringInTotal: number,
    bringOutTotal: number,
    chip: number,
    win: number,
    status: protobuf_holdem_define_pb.Def.CanPlayStatusMap[keyof protobuf_holdem_define_pb.Def.CanPlayStatusMap],
    isOnline: boolean,
    winSelfDrawCount: number,
    winDiscardCount: number,
    loseDiscardCount: number,
    concealedKongCount: number,
    exposedKongCount: number,
    loseKongCount: number,
  }
}

export class PlayerChipChangeMJ extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getChange(): number;
  setChange(value: number): void;

  getChips(): number;
  setChips(value: number): void;

  getAuto(): boolean;
  setAuto(value: boolean): void;

  getReason(): protobuf_holdem_define_pb.Def.ChipChangeReasonMap[keyof protobuf_holdem_define_pb.Def.ChipChangeReasonMap];
  setReason(value: protobuf_holdem_define_pb.Def.ChipChangeReasonMap[keyof protobuf_holdem_define_pb.Def.ChipChangeReasonMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerChipChangeMJ.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerChipChangeMJ): PlayerChipChangeMJ.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerChipChangeMJ, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerChipChangeMJ;
  static deserializeBinaryFromReader(message: PlayerChipChangeMJ, reader: jspb.BinaryReader): PlayerChipChangeMJ;
}

export namespace PlayerChipChangeMJ {
  export type AsObject = {
    seatId: number,
    change: number,
    chips: number,
    auto: boolean,
    reason: protobuf_holdem_define_pb.Def.ChipChangeReasonMap[keyof protobuf_holdem_define_pb.Def.ChipChangeReasonMap],
  }
}

export class ExternalResultMJ extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getChip(): number;
  setChip(value: number): void;

  clearResultDetailList(): void;
  getResultDetailList(): Array<ResultDetailMJ>;
  setResultDetailList(value: Array<ResultDetailMJ>): void;
  addResultDetail(value?: ResultDetailMJ, index?: number): ResultDetailMJ;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ExternalResultMJ.AsObject;
  static toObject(includeInstance: boolean, msg: ExternalResultMJ): ExternalResultMJ.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ExternalResultMJ, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ExternalResultMJ;
  static deserializeBinaryFromReader(message: ExternalResultMJ, reader: jspb.BinaryReader): ExternalResultMJ;
}

export namespace ExternalResultMJ {
  export type AsObject = {
    seatId: number,
    chip: number,
    resultDetailList: Array<ResultDetailMJ.AsObject>,
  }
}

export class ClaimAction extends jspb.Message {
  getStartValue(): number;
  setStartValue(value: number): void;

  hasTargetTile(): boolean;
  clearTargetTile(): void;
  getTargetTile(): Tile | undefined;
  setTargetTile(value?: Tile): void;

  getTargetSeatId(): number;
  setTargetSeatId(value: number): void;

  getTargetAciton(): DefMJ.ActionMjMap[keyof DefMJ.ActionMjMap];
  setTargetAciton(value: DefMJ.ActionMjMap[keyof DefMJ.ActionMjMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ClaimAction.AsObject;
  static toObject(includeInstance: boolean, msg: ClaimAction): ClaimAction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ClaimAction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ClaimAction;
  static deserializeBinaryFromReader(message: ClaimAction, reader: jspb.BinaryReader): ClaimAction;
}

export namespace ClaimAction {
  export type AsObject = {
    startValue: number,
    targetTile?: Tile.AsObject,
    targetSeatId: number,
    targetAciton: DefMJ.ActionMjMap[keyof DefMJ.ActionMjMap],
  }
}

export class ResultMJ extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getChip(): number;
  setChip(value: number): void;

  getTotalWinLose(): number;
  setTotalWinLose(value: number): void;

  getHand(): string;
  setHand(value: string): void;

  clearResultDetailList(): void;
  getResultDetailList(): Array<ResultDetailMJ>;
  setResultDetailList(value: Array<ResultDetailMJ>): void;
  addResultDetail(value?: ResultDetailMJ, index?: number): ResultDetailMJ;

  getStandUp(): boolean;
  setStandUp(value: boolean): void;

  getUserRid(): number;
  setUserRid(value: number): void;

  clearHandTilesList(): void;
  getHandTilesList(): Array<Tile>;
  setHandTilesList(value: Array<Tile>): void;
  addHandTiles(value?: Tile, index?: number): Tile;

  clearClaimActionsList(): void;
  getClaimActionsList(): Array<ClaimAction>;
  setClaimActionsList(value: Array<ClaimAction>): void;
  addClaimActions(value?: ClaimAction, index?: number): ClaimAction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResultMJ.AsObject;
  static toObject(includeInstance: boolean, msg: ResultMJ): ResultMJ.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ResultMJ, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResultMJ;
  static deserializeBinaryFromReader(message: ResultMJ, reader: jspb.BinaryReader): ResultMJ;
}

export namespace ResultMJ {
  export type AsObject = {
    seatId: number,
    chip: number,
    totalWinLose: number,
    hand: string,
    resultDetailList: Array<ResultDetailMJ.AsObject>,
    standUp: boolean,
    userRid: number,
    handTilesList: Array<Tile.AsObject>,
    claimActionsList: Array<ClaimAction.AsObject>,
  }
}

export class SourceMJ extends jspb.Message {
  getSeatedId(): number;
  setSeatedId(value: number): void;

  getWinLose(): number;
  setWinLose(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SourceMJ.AsObject;
  static toObject(includeInstance: boolean, msg: SourceMJ): SourceMJ.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SourceMJ, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SourceMJ;
  static deserializeBinaryFromReader(message: SourceMJ, reader: jspb.BinaryReader): SourceMJ;
}

export namespace SourceMJ {
  export type AsObject = {
    seatedId: number,
    winLose: number,
  }
}

export class ResultDetailMJ extends jspb.Message {
  getReason(): DefMJ.WinLoseReasonMap[keyof DefMJ.WinLoseReasonMap];
  setReason(value: DefMJ.WinLoseReasonMap[keyof DefMJ.WinLoseReasonMap]): void;

  getWinLose(): number;
  setWinLose(value: number): void;

  getWinPt(): number;
  setWinPt(value: number): void;

  clearWinTypesList(): void;
  getWinTypesList(): Array<WinTypeWithPoint>;
  setWinTypesList(value: Array<WinTypeWithPoint>): void;
  addWinTypes(value?: WinTypeWithPoint, index?: number): WinTypeWithPoint;

  hasWinTile(): boolean;
  clearWinTile(): void;
  getWinTile(): Tile | undefined;
  setWinTile(value?: Tile): void;

  clearSourceList(): void;
  getSourceList(): Array<SourceMJ>;
  setSourceList(value: Array<SourceMJ>): void;
  addSource(value?: SourceMJ, index?: number): SourceMJ;

  getExtraReason(): DefMJ.ExtraReasonMap[keyof DefMJ.ExtraReasonMap];
  setExtraReason(value: DefMJ.ExtraReasonMap[keyof DefMJ.ExtraReasonMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResultDetailMJ.AsObject;
  static toObject(includeInstance: boolean, msg: ResultDetailMJ): ResultDetailMJ.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ResultDetailMJ, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResultDetailMJ;
  static deserializeBinaryFromReader(message: ResultDetailMJ, reader: jspb.BinaryReader): ResultDetailMJ;
}

export namespace ResultDetailMJ {
  export type AsObject = {
    reason: DefMJ.WinLoseReasonMap[keyof DefMJ.WinLoseReasonMap],
    winLose: number,
    winPt: number,
    winTypesList: Array<WinTypeWithPoint.AsObject>,
    winTile?: Tile.AsObject,
    sourceList: Array<SourceMJ.AsObject>,
    extraReason: DefMJ.ExtraReasonMap[keyof DefMJ.ExtraReasonMap],
  }
}

export class WinTypeWithPoint extends jspb.Message {
  getWinType(): DefMJ.WinTypeMap[keyof DefMJ.WinTypeMap];
  setWinType(value: DefMJ.WinTypeMap[keyof DefMJ.WinTypeMap]): void;

  getPoint(): number;
  setPoint(value: number): void;

  getCount(): number;
  setCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WinTypeWithPoint.AsObject;
  static toObject(includeInstance: boolean, msg: WinTypeWithPoint): WinTypeWithPoint.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WinTypeWithPoint, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WinTypeWithPoint;
  static deserializeBinaryFromReader(message: WinTypeWithPoint, reader: jspb.BinaryReader): WinTypeWithPoint;
}

export namespace WinTypeWithPoint {
  export type AsObject = {
    winType: DefMJ.WinTypeMap[keyof DefMJ.WinTypeMap],
    point: number,
    count: number,
  }
}

export class ReadyTile extends jspb.Message {
  getTile(): number;
  setTile(value: number): void;

  getWinPt(): number;
  setWinPt(value: number): void;

  getLeft(): number;
  setLeft(value: number): void;

  clearWinTypesList(): void;
  getWinTypesList(): Array<WinTypeWithPoint>;
  setWinTypesList(value: Array<WinTypeWithPoint>): void;
  addWinTypes(value?: WinTypeWithPoint, index?: number): WinTypeWithPoint;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ReadyTile.AsObject;
  static toObject(includeInstance: boolean, msg: ReadyTile): ReadyTile.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ReadyTile, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ReadyTile;
  static deserializeBinaryFromReader(message: ReadyTile, reader: jspb.BinaryReader): ReadyTile;
}

export namespace ReadyTile {
  export type AsObject = {
    tile: number,
    winPt: number,
    left: number,
    winTypesList: Array<WinTypeWithPoint.AsObject>,
  }
}

export class NeedBringInPlayer extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NeedBringInPlayer.AsObject;
  static toObject(includeInstance: boolean, msg: NeedBringInPlayer): NeedBringInPlayer.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NeedBringInPlayer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NeedBringInPlayer;
  static deserializeBinaryFromReader(message: NeedBringInPlayer, reader: jspb.BinaryReader): NeedBringInPlayer;
}

export namespace NeedBringInPlayer {
  export type AsObject = {
    seatId: number,
  }
}

export class NeedBringInResult extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getReject(): boolean;
  setReject(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NeedBringInResult.AsObject;
  static toObject(includeInstance: boolean, msg: NeedBringInResult): NeedBringInResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: NeedBringInResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NeedBringInResult;
  static deserializeBinaryFromReader(message: NeedBringInResult, reader: jspb.BinaryReader): NeedBringInResult;
}

export namespace NeedBringInResult {
  export type AsObject = {
    seatId: number,
    reject: boolean,
  }
}

