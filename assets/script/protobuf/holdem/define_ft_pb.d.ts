// package: holdem.pb
// file: protobuf/holdem/define_ft.proto

import * as jspb from "google-protobuf";
import * as protobuf_holdem_define_pb from "../../protobuf/holdem/define_pb";

export class DefFT extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DefFT.AsObject;
  static toObject(includeInstance: boolean, msg: DefFT): DefFT.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DefFT, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DefFT;
  static deserializeBinaryFromReader(message: DefFT, reader: jspb.BinaryReader): DefFT;
}

export namespace DefFT {
  export type AsObject = {
  }

  export interface ActionTypeMap {
    AT_NONE: 0;
    AT_GROUP: 1;
    AT_PAIR: 2;
  }

  export const ActionType: ActionTypeMap;
}

export class RoomInfoFT extends jspb.Message {
  getScheduleStartTime(): number;
  setScheduleStartTime(value: number): void;

  getSchedulePlayDuration(): number;
  setSchedulePlayDuration(value: number): void;

  getStartTime(): number;
  setStartTime(value: number): void;

  getCurrentMinstack(): number;
  setCurrentMinstack(value: number): void;

  getCurrentMinRate(): number;
  setCurrentMinRate(value: number): void;

  getCurrentMaxRate(): number;
  setCurrentMaxRate(value: number): void;

  getLimitIp(): boolean;
  setLimitIp(value: boolean): void;

  getLimitGps(): boolean;
  setLimitGps(value: boolean): void;

  getDelaySeeCard(): boolean;
  setDelaySeeCard(value: boolean): void;

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

  getPtLevel(): number;
  setPtLevel(value: number): void;

  getPersonalType(): number;
  setPersonalType(value: number): void;

  getMode(): protobuf_holdem_define_pb.Def.RoomModeMap[keyof protobuf_holdem_define_pb.Def.RoomModeMap];
  setMode(value: protobuf_holdem_define_pb.Def.RoomModeMap[keyof protobuf_holdem_define_pb.Def.RoomModeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RoomInfoFT.AsObject;
  static toObject(includeInstance: boolean, msg: RoomInfoFT): RoomInfoFT.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RoomInfoFT, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RoomInfoFT;
  static deserializeBinaryFromReader(message: RoomInfoFT, reader: jspb.BinaryReader): RoomInfoFT;
}

export namespace RoomInfoFT {
  export type AsObject = {
    scheduleStartTime: number,
    schedulePlayDuration: number,
    startTime: number,
    currentMinstack: number,
    currentMinRate: number,
    currentMaxRate: number,
    limitIp: boolean,
    limitGps: boolean,
    delaySeeCard: boolean,
    opDuration: number,
    uniqueId: string,
    seatedMessaging: boolean,
    roomType: number,
    antiCheatType: number,
    antiCheatVideoType: number,
    ptLevel: number,
    personalType: number,
    mode: protobuf_holdem_define_pb.Def.RoomModeMap[keyof protobuf_holdem_define_pb.Def.RoomModeMap],
  }
}

export class HandInfoFT extends jspb.Message {
  getHandNum(): number;
  setHandNum(value: number): void;

  getBuSeatId(): number;
  setBuSeatId(value: number): void;

  clearPublicCardsGroupList(): void;
  getPublicCardsGroupList(): Array<CardsGroup>;
  setPublicCardsGroupList(value: Array<CardsGroup>): void;
  addPublicCardsGroup(value?: CardsGroup, index?: number): CardsGroup;

  clearResultsList(): void;
  getResultsList(): Array<ResultFT>;
  setResultsList(value: Array<ResultFT>): void;
  addResults(value?: ResultFT, index?: number): ResultFT;

  getResultTime(): number;
  setResultTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HandInfoFT.AsObject;
  static toObject(includeInstance: boolean, msg: HandInfoFT): HandInfoFT.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HandInfoFT, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HandInfoFT;
  static deserializeBinaryFromReader(message: HandInfoFT, reader: jspb.BinaryReader): HandInfoFT;
}

export namespace HandInfoFT {
  export type AsObject = {
    handNum: number,
    buSeatId: number,
    publicCardsGroupList: Array<CardsGroup.AsObject>,
    resultsList: Array<ResultFT.AsObject>,
    resultTime: number,
  }
}

export class CardsGroup extends jspb.Message {
  clearCardsList(): void;
  getCardsList(): Array<number>;
  setCardsList(value: Array<number>): void;
  addCards(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CardsGroup.AsObject;
  static toObject(includeInstance: boolean, msg: CardsGroup): CardsGroup.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CardsGroup, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CardsGroup;
  static deserializeBinaryFromReader(message: CardsGroup, reader: jspb.BinaryReader): CardsGroup;
}

export namespace CardsGroup {
  export type AsObject = {
    cardsList: Array<number>,
  }
}

export class HandCardIndexGroup extends jspb.Message {
  clearIndexList(): void;
  getIndexList(): Array<number>;
  setIndexList(value: Array<number>): void;
  addIndex(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HandCardIndexGroup.AsObject;
  static toObject(includeInstance: boolean, msg: HandCardIndexGroup): HandCardIndexGroup.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HandCardIndexGroup, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HandCardIndexGroup;
  static deserializeBinaryFromReader(message: HandCardIndexGroup, reader: jspb.BinaryReader): HandCardIndexGroup;
}

export namespace HandCardIndexGroup {
  export type AsObject = {
    indexList: Array<number>,
  }
}

export class PlayerCardsGroup extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  clearHandCardsGroupList(): void;
  getHandCardsGroupList(): Array<CardsGroup>;
  setHandCardsGroupList(value: Array<CardsGroup>): void;
  addHandCardsGroup(value?: CardsGroup, index?: number): CardsGroup;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerCardsGroup.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerCardsGroup): PlayerCardsGroup.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerCardsGroup, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerCardsGroup;
  static deserializeBinaryFromReader(message: PlayerCardsGroup, reader: jspb.BinaryReader): PlayerCardsGroup;
}

export namespace PlayerCardsGroup {
  export type AsObject = {
    seatId: number,
    handCardsGroupList: Array<CardsGroup.AsObject>,
  }
}

export class PlayerFT extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getUserRid(): number;
  setUserRid(value: number): void;

  clearCardsList(): void;
  getCardsList(): Array<number>;
  setCardsList(value: Array<number>): void;
  addCards(value: number, index?: number): number;

  clearCardIndexGroupsList(): void;
  getCardIndexGroupsList(): Array<HandCardIndexGroup>;
  setCardIndexGroupsList(value: Array<HandCardIndexGroup>): void;
  addCardIndexGroups(value?: HandCardIndexGroup, index?: number): HandCardIndexGroup;

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

  getFantasy(): boolean;
  setFantasy(value: boolean): void;

  getStatus(): protobuf_holdem_define_pb.Def.CanPlayStatusMap[keyof protobuf_holdem_define_pb.Def.CanPlayStatusMap];
  setStatus(value: protobuf_holdem_define_pb.Def.CanPlayStatusMap[keyof protobuf_holdem_define_pb.Def.CanPlayStatusMap]): void;

  clearGroupPairedList(): void;
  getGroupPairedList(): Array<number>;
  setGroupPairedList(value: Array<number>): void;
  addGroupPaired(value: number, index?: number): number;

  getFantasyConNum(): number;
  setFantasyConNum(value: number): void;

  getUserSubscriptionId(): number;
  setUserSubscriptionId(value: number): void;

  getGroupConfirm(): boolean;
  setGroupConfirm(value: boolean): void;

  getPairConfirm(): boolean;
  setPairConfirm(value: boolean): void;

  getIpAddr(): string;
  setIpAddr(value: string): void;

  getVideoMaskId(): number;
  setVideoMaskId(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerFT.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerFT): PlayerFT.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerFT, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerFT;
  static deserializeBinaryFromReader(message: PlayerFT, reader: jspb.BinaryReader): PlayerFT;
}

export namespace PlayerFT {
  export type AsObject = {
    seatId: number,
    userRid: number,
    cardsList: Array<number>,
    cardIndexGroupsList: Array<HandCardIndexGroup.AsObject>,
    name: string,
    avatar: string,
    sex: number,
    chip: number,
    keepSeatLeftTime: number,
    isAutoop: boolean,
    vip: number,
    keepSeatDeadline: number,
    keepSeatReason: protobuf_holdem_define_pb.Def.KeepSeatReasonMap[keyof protobuf_holdem_define_pb.Def.KeepSeatReasonMap],
    fantasy: boolean,
    status: protobuf_holdem_define_pb.Def.CanPlayStatusMap[keyof protobuf_holdem_define_pb.Def.CanPlayStatusMap],
    groupPairedList: Array<number>,
    fantasyConNum: number,
    userSubscriptionId: number,
    groupConfirm: boolean,
    pairConfirm: boolean,
    ipAddr: string,
    videoMaskId: number,
  }
}

export class MyGameInfoFT extends jspb.Message {
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
  toObject(includeInstance?: boolean): MyGameInfoFT.AsObject;
  static toObject(includeInstance: boolean, msg: MyGameInfoFT): MyGameInfoFT.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MyGameInfoFT, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MyGameInfoFT;
  static deserializeBinaryFromReader(message: MyGameInfoFT, reader: jspb.BinaryReader): MyGameInfoFT;
}

export namespace MyGameInfoFT {
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

export class OperatorFT extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  getDelayTimes(): number;
  setDelayTimes(value: number): void;

  getOpDeadline(): number;
  setOpDeadline(value: number): void;

  getFantasy(): boolean;
  setFantasy(value: boolean): void;

  getActionType(): DefFT.ActionTypeMap[keyof DefFT.ActionTypeMap];
  setActionType(value: DefFT.ActionTypeMap[keyof DefFT.ActionTypeMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OperatorFT.AsObject;
  static toObject(includeInstance: boolean, msg: OperatorFT): OperatorFT.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OperatorFT, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OperatorFT;
  static deserializeBinaryFromReader(message: OperatorFT, reader: jspb.BinaryReader): OperatorFT;
}

export namespace OperatorFT {
  export type AsObject = {
    seatId: number,
    delayTimes: number,
    opDeadline: number,
    fantasy: boolean,
    actionType: DefFT.ActionTypeMap[keyof DefFT.ActionTypeMap],
  }
}

export class PlayerStartInfoFT extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  clearCardsList(): void;
  getCardsList(): Array<number>;
  setCardsList(value: Array<number>): void;
  addCards(value: number, index?: number): number;

  getChip(): number;
  setChip(value: number): void;

  getFantasy(): boolean;
  setFantasy(value: boolean): void;

  getNeedGroup(): boolean;
  setNeedGroup(value: boolean): void;

  getWaitDeadline(): number;
  setWaitDeadline(value: number): void;

  getFantasyConNum(): number;
  setFantasyConNum(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerStartInfoFT.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerStartInfoFT): PlayerStartInfoFT.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerStartInfoFT, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerStartInfoFT;
  static deserializeBinaryFromReader(message: PlayerStartInfoFT, reader: jspb.BinaryReader): PlayerStartInfoFT;
}

export namespace PlayerStartInfoFT {
  export type AsObject = {
    seatId: number,
    cardsList: Array<number>,
    chip: number,
    fantasy: boolean,
    needGroup: boolean,
    waitDeadline: number,
    fantasyConNum: number,
  }
}

export class PlayerChipChangeFT extends jspb.Message {
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
  toObject(includeInstance?: boolean): PlayerChipChangeFT.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerChipChangeFT): PlayerChipChangeFT.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerChipChangeFT, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerChipChangeFT;
  static deserializeBinaryFromReader(message: PlayerChipChangeFT, reader: jspb.BinaryReader): PlayerChipChangeFT;
}

export namespace PlayerChipChangeFT {
  export type AsObject = {
    seatId: number,
    change: number,
    chips: number,
    auto: boolean,
    reason: protobuf_holdem_define_pb.Def.ChipChangeReasonMap[keyof protobuf_holdem_define_pb.Def.ChipChangeReasonMap],
  }
}

export class GroupResultFT extends jspb.Message {
  clearWinCardsList(): void;
  getWinCardsList(): Array<protobuf_holdem_define_pb.WinCard>;
  setWinCardsList(value: Array<protobuf_holdem_define_pb.WinCard>): void;
  addWinCards(value?: protobuf_holdem_define_pb.WinCard, index?: number): protobuf_holdem_define_pb.WinCard;

  getHandValueType(): number;
  setHandValueType(value: number): void;

  getIsNuts(): boolean;
  setIsNuts(value: boolean): void;

  getBonusPt(): number;
  setBonusPt(value: number): void;

  getFantasy(): boolean;
  setFantasy(value: boolean): void;

  clearMyCardsList(): void;
  getMyCardsList(): Array<number>;
  setMyCardsList(value: Array<number>): void;
  addMyCards(value: number, index?: number): number;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GroupResultFT.AsObject;
  static toObject(includeInstance: boolean, msg: GroupResultFT): GroupResultFT.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GroupResultFT, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GroupResultFT;
  static deserializeBinaryFromReader(message: GroupResultFT, reader: jspb.BinaryReader): GroupResultFT;
}

export namespace GroupResultFT {
  export type AsObject = {
    winCardsList: Array<protobuf_holdem_define_pb.WinCard.AsObject>,
    handValueType: number,
    isNuts: boolean,
    bonusPt: number,
    fantasy: boolean,
    myCardsList: Array<number>,
  }
}

export class BoardsDetailFT extends jspb.Message {
  getTargetSeatId(): number;
  setTargetSeatId(value: number): void;

  clearBoardsPtList(): void;
  getBoardsPtList(): Array<number>;
  setBoardsPtList(value: Array<number>): void;
  addBoardsPt(value: number, index?: number): number;

  getFullWinBonusPt(): number;
  setFullWinBonusPt(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BoardsDetailFT.AsObject;
  static toObject(includeInstance: boolean, msg: BoardsDetailFT): BoardsDetailFT.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BoardsDetailFT, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BoardsDetailFT;
  static deserializeBinaryFromReader(message: BoardsDetailFT, reader: jspb.BinaryReader): BoardsDetailFT;
}

export namespace BoardsDetailFT {
  export type AsObject = {
    targetSeatId: number,
    boardsPtList: Array<number>,
    fullWinBonusPt: number,
  }
}

export class ResultFT extends jspb.Message {
  getSeatId(): number;
  setSeatId(value: number): void;

  clearGroupResultList(): void;
  getGroupResultList(): Array<GroupResultFT>;
  setGroupResultList(value: Array<GroupResultFT>): void;
  addGroupResult(value?: GroupResultFT, index?: number): GroupResultFT;

  getBoardsPt(): number;
  setBoardsPt(value: number): void;

  getBonusPt(): number;
  setBonusPt(value: number): void;

  getBonusComparePt(): number;
  setBonusComparePt(value: number): void;

  getChip(): number;
  setChip(value: number): void;

  getWinLosePt(): number;
  setWinLosePt(value: number): void;

  getWinLoseChip(): number;
  setWinLoseChip(value: number): void;

  getFee(): number;
  setFee(value: number): void;

  getFantasy(): boolean;
  setFantasy(value: boolean): void;

  getNextFantasy(): boolean;
  setNextFantasy(value: boolean): void;

  getStandUp(): boolean;
  setStandUp(value: boolean): void;

  clearBoardsDetailList(): void;
  getBoardsDetailList(): Array<BoardsDetailFT>;
  setBoardsDetailList(value: Array<BoardsDetailFT>): void;
  addBoardsDetail(value?: BoardsDetailFT, index?: number): BoardsDetailFT;

  getUserRid(): number;
  setUserRid(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): ResultFT.AsObject;
  static toObject(includeInstance: boolean, msg: ResultFT): ResultFT.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: ResultFT, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): ResultFT;
  static deserializeBinaryFromReader(message: ResultFT, reader: jspb.BinaryReader): ResultFT;
}

export namespace ResultFT {
  export type AsObject = {
    seatId: number,
    groupResultList: Array<GroupResultFT.AsObject>,
    boardsPt: number,
    bonusPt: number,
    bonusComparePt: number,
    chip: number,
    winLosePt: number,
    winLoseChip: number,
    fee: number,
    fantasy: boolean,
    nextFantasy: boolean,
    standUp: boolean,
    boardsDetailList: Array<BoardsDetailFT.AsObject>,
    userRid: number,
  }
}

export class PlayerSummaryFT extends jspb.Message {
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

  getFantasyCount(): number;
  setFantasyCount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlayerSummaryFT.AsObject;
  static toObject(includeInstance: boolean, msg: PlayerSummaryFT): PlayerSummaryFT.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlayerSummaryFT, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlayerSummaryFT;
  static deserializeBinaryFromReader(message: PlayerSummaryFT, reader: jspb.BinaryReader): PlayerSummaryFT;
}

export namespace PlayerSummaryFT {
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
    fantasyCount: number,
  }
}

