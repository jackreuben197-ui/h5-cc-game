// package: holdem.pb
// file: protobuf/holdem/define_gd.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class DefGD extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DefGD.AsObject;
  static toObject(includeInstance: boolean, msg: DefGD): DefGD.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DefGD, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DefGD;
  static deserializeBinaryFromReader(message: DefGD, reader: jspb.BinaryReader): DefGD;
}

export namespace DefGD {
  export type AsObject = {
  }

  export interface WinTypeMap {
    WNT_NONE: 0;
    WNT_FIRST: 1;
    WNT_SECOND: 2;
    WNT_THIRD: 3;
    WNT_FOURTH: 4;
  }

  export const WinType: WinTypeMap;

  export interface WaitTypeMap {
    WT_NONE: 0;
    WT_START: 1;
    WT_WINRATE: 2;
    WT_TRIBUTE_GIVE: 3;
    WT_TRIBUTE_RETURN: 4;
    WT_TURN: 5;
  }

  export const WaitType: WaitTypeMap;

  export interface ActionGdMap {
    ACT_NONE: 0;
    ACT_DISCARD: 1;
    ACT_PASS: 2;
  }

  export const ActionGd: ActionGdMap;

  export interface CardsTypeMap {
    NONE: 0;
    SINGLE: 1;
    PAIR: 2;
    TRIPS: 4;
    TWOTRIPS: 5;
    TREEPAIR: 3;
    THREEWITHTWO: 6;
    STRAIGHT: 7;
    BOMB: 8;
    STRAIGHTFLUSH: 9;
    JOKERBOMB: 10;
  }

  export const CardsType: CardsTypeMap;
}

export class Card extends jspb.Message {
  getIndex(): number;
  setIndex(value: number): void;

  getCard(): number;
  setCard(value: number): void;

  getReplaceCard(): number;
  setReplaceCard(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Card.AsObject;
  static toObject(includeInstance: boolean, msg: Card): Card.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Card, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Card;
  static deserializeBinaryFromReader(message: Card, reader: jspb.BinaryReader): Card;
}

export namespace Card {
  export type AsObject = {
    index: number,
    card: number,
    replaceCard: number,
  }
}

export class ValidCards extends jspb.Message {
  getCardsType(): DefGD.CardsTypeMap[keyof DefGD.CardsTypeMap];
  setCardsType(value: DefGD.CardsTypeMap[keyof DefGD.CardsTypeMap]): void;

  clearCardsList(): void;
  getCardsList(): Array<Card>;
  setCardsList(value: Array<Card>): void;
  addCards(value?: Card, index?: number): Card;

  getUniqueId(): string;
  setUniqueId(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ValidCards.AsObject;
  static toObject(includeInstance: boolean, msg: ValidCards): ValidCards.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ValidCards, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ValidCards;
  static deserializeBinaryFromReader(message: ValidCards, reader: jspb.BinaryReader): ValidCards;
}

export namespace ValidCards {
  export type AsObject = {
    cardsType: DefGD.CardsTypeMap[keyof DefGD.CardsTypeMap],
    cardsList: Array<Card.AsObject>,
    uniqueId: string,
  }
}

export class RoomInfoGD extends jspb.Message {
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

  getLimitIp(): boolean;
  setLimitIp(value: boolean): void;

  getLimitGps(): boolean;
  setLimitGps(value: boolean): void;

  getOpDuration(): number;
  setOpDuration(value: number): void;

  getUniqueId(): string;
  setUniqueId(value: string): void;

  getSeatedMessaging(): boolean;
  setSeatedMessaging(value: boolean): void;

  getRoomType(): number;
  setRoomType(value: number): void;

  getAntiCheatType(): number;
  setAntiCheatType(value: number): void;

  getAntiCheatVideoType(): number;
  setAntiCheatVideoType(value: number): void;

  getPersonalType(): number;
  setPersonalType(value: number): void;

  getLevelType(): number;
  setLevelType(value: number): void;

  getMode(): protobuf_holdem_define_pb.Def.RoomModeMap[keyof protobuf_holdem_define_pb.Def.RoomModeMap];
  setMode(value: protobuf_holdem_define_pb.Def.RoomModeMap[keyof protobuf_holdem_define_pb.Def.RoomModeMap]): void;

  getBombFour(): number;
  setBombFour(value: number): void;

  getBombFive(): number;
  setBombFive(value: number): void;

  getStraightFlush(): number;
  setStraightFlush(value: number): void;

  getBombSix(): number;
  setBombSix(value: number): void;

  getBombSeven(): number;
  setBombSeven(value: number): void;

  getBombEight(): number;
  setBombEight(value: number): void;

  getBombNine(): number;
  setBombNine(value: number): void;

  getBombTen(): number;
  setBombTen(value: number): void;

  getJokerBomb(): number;
  setJokerBomb(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RoomInfoGD.AsObject;
  static toObject(includeInstance: boolean, msg: RoomInfoGD): RoomInfoGD.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RoomInfoGD, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RoomInfoGD;
  static deserializeBinaryFromReader(message: RoomInfoGD, reader: jspb.BinaryReader): RoomInfoGD;
}

export namespace RoomInfoGD {
  export type AsObject = {
    scheduleStartTime: number,
    schedulePlayDuration: number,
    startTime: number,
    currentMinStack: number,
    currentMinRate: number,
    currentMaxRate: number,
    currentMaxWinrate: number,
    ptLevel: number,
    limitIp: boolean,
    limitGps: boolean,
    opDuration: number,
    uniqueId: string,
    seatedMessaging: boolean,
    roomType: number,
    antiCheatType: number,
    antiCheatVideoType: number,
    personalType: number,
    levelType: number,
    mode: protobuf_holdem_define_pb.Def.RoomModeMap[keyof protobuf_holdem_define_pb.Def.RoomModeMap],
    bombFour: number,
    bombFive: number,
    straightFlush: number,
    bombSix: number,
    bombSeven: number,
    bombEight: number,
    bombNine: number,
    bombTen: number,
    jokerBomb: number,
  }
}

export class MatchInfoGD extends jspb.Message {
  getMatchNum(): number;
  setMatchNum(value: number): void;

  getDealerSeatId(): number;
  setDealerSeatId(value: number): void;

  getWaitDeadline(): number;
  setWaitDeadline(value: number): void;

  getWaitType(): DefGD.WaitTypeMap[keyof DefGD.WaitTypeMap];
  setWaitType(value: DefGD.WaitTypeMap[keyof DefGD.WaitTypeMap]): void;

  getCurrentInitWinrate(): number;
  setCurrentInitWinrate(value: number): void;

  getLevelCard(): number;
  setLevelCard(value: number): void;

  getLevelGroup(): number;
  setLevelGroup(value: number): void;

  clearDiscardCardsList(): void;
  getDiscardCardsList(): Array<Card>;
  setDiscardCardsList(value: Array<Card>): void;
  addDiscardCards(value?: Card, index?: number): Card;

  getLevelCardGroup1(): number;
  setLevelCardGroup1(value: number): void;

  getLevelCardGroup2(): number;
  setLevelCardGroup2(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MatchInfoGD.AsObject;
  static toObject(includeInstance: boolean, msg: MatchInfoGD): MatchInfoGD.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MatchInfoGD, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MatchInfoGD;
  static deserializeBinaryFromReader(message: MatchInfoGD, reader: jspb.BinaryReader): MatchInfoGD;
}

export namespace MatchInfoGD {
  export type AsObject = {
    matchNum: number,
    dealerSeatId: number,
    waitDeadline: number,
    waitType: DefGD.WaitTypeMap[keyof DefGD.WaitTypeMap],
    currentInitWinrate: number,
    levelCard: number,
    levelGroup: number,
    discardCardsList: Array<Card.AsObject>,
    levelCardGroup1: number,
    levelCardGroup2: number,
  }
}

export class PlayerStartInfoGD extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  clearCardsList(): void;
  getCardsList(): Array<Card>;
  setCardsList(value: Array<Card>): void;
  addCards(value?: Card, index?: number): Card;

  getChip(): number;
  setChip(value: number): void;

  hasOp(): boolean;
  clearOp(): void;
  getOp(): OperatorGD | undefined;
  setOp(value?: OperatorGD): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerStartInfoGD.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerStartInfoGD): PlayerStartInfoGD.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerStartInfoGD, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerStartInfoGD;
  static deserializeBinaryFromReader(message: PlayerStartInfoGD, reader: jspb.BinaryReader): PlayerStartInfoGD;
}

export namespace PlayerStartInfoGD {
  export type AsObject = {
    seatId: number,
    cardsList: Array<Card.AsObject>,
    chip: number,
    op?: OperatorGD.AsObject,
  }
}

export class PlayerGD extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getUserRid(): number;
  setUserRid(value: number): void;

  clearCardsList(): void;
  getCardsList(): Array<Card>;
  setCardsList(value: Array<Card>): void;
  addCards(value?: Card, index?: number): Card;

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

  getHandCardsLength(): number;
  setHandCardsLength(value: number): void;

  getAddRate(): boolean;
  setAddRate(value: boolean): void;

  hasTributeCard(): boolean;
  clearTributeCard(): void;
  getTributeCard(): TributeCard | undefined;
  setTributeCard(value?: TributeCard): void;

  getRank(): DefGD.WinTypeMap[keyof DefGD.WinTypeMap];
  setRank(value: DefGD.WinTypeMap[keyof DefGD.WinTypeMap]): void;

  getTotalWinLose(): number;
  setTotalWinLose(value: number): void;

  getReadyStart(): boolean;
  setReadyStart(value: boolean): void;

  getLastAction(): DefGD.ActionGdMap[keyof DefGD.ActionGdMap];
  setLastAction(value: DefGD.ActionGdMap[keyof DefGD.ActionGdMap]): void;

  hasLastDiscard(): boolean;
  clearLastDiscard(): void;
  getLastDiscard(): ValidCards | undefined;
  setLastDiscard(value?: ValidCards): void;

  getGold(): number;
  setGold(value: number): void;

  getIpAddr(): string;
  setIpAddr(value: string): void;

  getVideoMaskId(): number;
  setVideoMaskId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerGD.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerGD): PlayerGD.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerGD, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerGD;
  static deserializeBinaryFromReader(message: PlayerGD, reader: jspb.BinaryReader): PlayerGD;
}

export namespace PlayerGD {
  export type AsObject = {
    seatId: number,
    userRid: number,
    cardsList: Array<Card.AsObject>,
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
    handCardsLength: number,
    addRate: boolean,
    tributeCard?: TributeCard.AsObject,
    rank: DefGD.WinTypeMap[keyof DefGD.WinTypeMap],
    totalWinLose: number,
    readyStart: boolean,
    lastAction: DefGD.ActionGdMap[keyof DefGD.ActionGdMap],
    lastDiscard?: ValidCards.AsObject,
    gold: number,
    ipAddr: string,
    videoMaskId: number,
  }
}

export class MyGameInfoGD extends jspb.Message {
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

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MyGameInfoGD.AsObject;
  static toObject(includeInstance: boolean, msg: MyGameInfoGD): MyGameInfoGD.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MyGameInfoGD, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MyGameInfoGD;
  static deserializeBinaryFromReader(message: MyGameInfoGD, reader: jspb.BinaryReader): MyGameInfoGD;
}

export namespace MyGameInfoGD {
  export type AsObject = {
    chip: number,
    seatId: number,
    isAutoop: boolean,
    name: string,
    avatar: string,
    sex: number,
    userSubscriptionId: number,
    wantSeat: protobuf_holdem_define_pb.Def.WantSeatTypeMap[keyof protobuf_holdem_define_pb.Def.WantSeatTypeMap],
  }
}

export class OperatorGD extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getDelayTimes(): number;
  setDelayTimes(value: number): void;

  getOpDeadline(): number;
  setOpDeadline(value: number): void;

  getWaitType(): DefGD.WaitTypeMap[keyof DefGD.WaitTypeMap];
  setWaitType(value: DefGD.WaitTypeMap[keyof DefGD.WaitTypeMap]): void;

  clearValidActionsList(): void;
  getValidActionsList(): Array<DefGD.ActionGdMap[keyof DefGD.ActionGdMap]>;
  setValidActionsList(value: Array<DefGD.ActionGdMap[keyof DefGD.ActionGdMap]>): void;
  addValidActions(value: DefGD.ActionGdMap[keyof DefGD.ActionGdMap], index?: number): DefGD.ActionGdMap[keyof DefGD.ActionGdMap];

  clearDiscardCardsList(): void;
  getDiscardCardsList(): Array<ValidCards>;
  setDiscardCardsList(value: Array<ValidCards>): void;
  addDiscardCards(value?: ValidCards, index?: number): ValidCards;

  getRefuseTribute(): boolean;
  setRefuseTribute(value: boolean): void;

  clearTributeCardsList(): void;
  getTributeCardsList(): Array<Card>;
  setTributeCardsList(value: Array<Card>): void;
  addTributeCards(value?: Card, index?: number): Card;

  getFirst(): boolean;
  setFirst(value: boolean): void;

  getFollow(): boolean;
  setFollow(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OperatorGD.AsObject;
  static toObject(includeInstance: boolean, msg: OperatorGD): OperatorGD.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OperatorGD, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OperatorGD;
  static deserializeBinaryFromReader(message: OperatorGD, reader: jspb.BinaryReader): OperatorGD;
}

export namespace OperatorGD {
  export type AsObject = {
    seatId: number,
    delayTimes: number,
    opDeadline: number,
    waitType: DefGD.WaitTypeMap[keyof DefGD.WaitTypeMap],
    validActionsList: Array<DefGD.ActionGdMap[keyof DefGD.ActionGdMap]>,
    discardCardsList: Array<ValidCards.AsObject>,
    refuseTribute: boolean,
    tributeCardsList: Array<Card.AsObject>,
    first: boolean,
    follow: boolean,
  }
}

export class PlayerChipChangeGD extends jspb.Message {
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
  toObject(includeInstance?: boolean): PlayerChipChangeGD.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerChipChangeGD): PlayerChipChangeGD.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerChipChangeGD, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerChipChangeGD;
  static deserializeBinaryFromReader(message: PlayerChipChangeGD, reader: jspb.BinaryReader): PlayerChipChangeGD;
}

export namespace PlayerChipChangeGD {
  export type AsObject = {
    seatId: number,
    change: number,
    chips: number,
    auto: boolean,
    reason: protobuf_holdem_define_pb.Def.ChipChangeReasonMap[keyof protobuf_holdem_define_pb.Def.ChipChangeReasonMap],
  }
}

export class ResultGD extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getChip(): number;
  setChip(value: number): void;

  getTotalWinLose(): number;
  setTotalWinLose(value: number): void;

  getRank(): DefGD.WinTypeMap[keyof DefGD.WinTypeMap];
  setRank(value: DefGD.WinTypeMap[keyof DefGD.WinTypeMap]): void;

  getStandUp(): boolean;
  setStandUp(value: boolean): void;

  getUserRid(): number;
  setUserRid(value: number): void;

  clearCardsList(): void;
  getCardsList(): Array<Card>;
  setCardsList(value: Array<Card>): void;
  addCards(value?: Card, index?: number): Card;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResultGD.AsObject;
  static toObject(includeInstance: boolean, msg: ResultGD): ResultGD.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ResultGD, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResultGD;
  static deserializeBinaryFromReader(message: ResultGD, reader: jspb.BinaryReader): ResultGD;
}

export namespace ResultGD {
  export type AsObject = {
    seatId: number,
    chip: number,
    totalWinLose: number,
    rank: DefGD.WinTypeMap[keyof DefGD.WinTypeMap],
    standUp: boolean,
    userRid: number,
    cardsList: Array<Card.AsObject>,
  }
}

export class PlayerSummaryGD extends jspb.Message {
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

  getFirstCount(): number;
  setFirstCount(value: number): void;

  getSecondCount(): number;
  setSecondCount(value: number): void;

  getThirdCount(): number;
  setThirdCount(value: number): void;

  getFourthCount(): number;
  setFourthCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerSummaryGD.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerSummaryGD): PlayerSummaryGD.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerSummaryGD, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerSummaryGD;
  static deserializeBinaryFromReader(message: PlayerSummaryGD, reader: jspb.BinaryReader): PlayerSummaryGD;
}

export namespace PlayerSummaryGD {
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
    firstCount: number,
    secondCount: number,
    thirdCount: number,
    fourthCount: number,
  }
}

export class TributeCard extends jspb.Message {
  getFromSeatId(): number;
  setFromSeatId(value: number): void;

  getToSeatId(): number;
  setToSeatId(value: number): void;

  hasCard(): boolean;
  clearCard(): void;
  getCard(): Card | undefined;
  setCard(value?: Card): void;

  getRefuse(): boolean;
  setRefuse(value: boolean): void;

  getGive(): boolean;
  setGive(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TributeCard.AsObject;
  static toObject(includeInstance: boolean, msg: TributeCard): TributeCard.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TributeCard, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TributeCard;
  static deserializeBinaryFromReader(message: TributeCard, reader: jspb.BinaryReader): TributeCard;
}

export namespace TributeCard {
  export type AsObject = {
    fromSeatId: number,
    toSeatId: number,
    card?: Card.AsObject,
    refuse: boolean,
    give: boolean,
  }
}

export class PlayerGoldGD extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getGold(): number;
  setGold(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerGoldGD.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerGoldGD): PlayerGoldGD.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerGoldGD, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerGoldGD;
  static deserializeBinaryFromReader(message: PlayerGoldGD, reader: jspb.BinaryReader): PlayerGoldGD;
}

export namespace PlayerGoldGD {
  export type AsObject = {
    seatId: number,
    gold: number,
  }
}

