// package: holdem.pb
// file: protobuf/holdem/define_cb.proto

import * as jspb from "google-protobuf";

export class DefCB extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DefCB.AsObject;
  static toObject(includeInstance: boolean, msg: DefCB): DefCB.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DefCB, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DefCB;
  static deserializeBinaryFromReader(message: DefCB, reader: jspb.BinaryReader): DefCB;
}

export namespace DefCB {
  export type AsObject = {
  }

  export interface HistorySlotMap {
    HS_NONE: 0;
    HS_RESULT: 30;
    HS_COWBOY: 1;
    HS_DRAW: 2;
    HS_BEAUTY: 3;
    HS_STA_FLUSH_STAFLUSH: 4;
    HS_PAIR: 5;
    HS_PAIR_ACE: 6;
    HS_HC_ONE_PAIR: 7;
    HS_TWO_PAIR: 8;
    HS_STA_FLUSH_THREE: 9;
    HS_FULL_HOUSE: 10;
    HS_FOUR_STAFLUSH_ROYALFLUSH: 11;
    HS_FLUSH: 12;
    HS_STA: 13;
    HS_STAFLUSH: 14;
  }

  export const HistorySlot: HistorySlotMap;

  export interface HistoryResultMap {
    HR_NONE: 0;
    HR_YES: 1;
    HR_NO: 2;
    HR_DRAW: 3;
    HR_COWBOY: 4;
    HR_BEAUTY: 5;
  }

  export const HistoryResult: HistoryResultMap;

  export interface PlaySlotMap {
    PS_NONE: 0;
    PS_COWBOY: 1;
    PS_DRAW: 2;
    PS_BEAUTY: 3;
    PS_STA_FLUSH_STAFLUSH: 4;
    PS_PAIR: 5;
    PS_PAIR_ACE: 6;
    PS_HC_ONE_PAIR: 7;
    PS_TWO_PAIR: 8;
    PS_STA_FLUSH_THREE: 9;
    PS_FULL_HOUSE: 10;
    PS_FOUR_STAFLUSH_ROYALFLUSH: 11;
    PS_FLUSH: 12;
    PS_STA: 13;
    PS_STAFLUSH: 14;
  }

  export const PlaySlot: PlaySlotMap;

  export interface RoomCloseReasonMap {
    CR_NONE: 0;
    CR_NORMAL: 1;
    CR_FORCE: 2;
    CR_ERROR: 3;
    CR_EXPLOSION: 4;
  }

  export const RoomCloseReason: RoomCloseReasonMap;

  export interface WayPointColorMap {
    WPC_NONE: 0;
    WPC_BLUE: 1;
    WPC_RED: 2;
    WPC_GREEN: 3;
  }

  export const WayPointColor: WayPointColorMap;

  export interface ConsumeTypeMap {
    CT_NONE: 0;
    CT_MSG_1: 1;
    CT_MSG_2: 2;
    CT_MSG_3: 3;
    CT_MSG_4: 4;
    CT_EMOJI_1: 5;
    CT_EMOJI_2: 6;
    CT_EMOJI_3: 7;
    CT_EMOJI_4: 8;
  }

  export const ConsumeType: ConsumeTypeMap;

  export interface LeaveReasonMap {
    LR_NONE: 0;
    LR_ACTIVE: 1;
    LR_FORCE: 2;
    LR_GAMEOVER: 3;
    LR_OFFLINE: 4;
    LR_STAND_UP: 5;
  }

  export const LeaveReason: LeaveReasonMap;

  export interface OrderByTypeMap {
    OT_ORDER_BY_NONE: 0;
    OT_ORDER_BY_PLAY: 1;
    OT_ORDER_BY_WALLET: 2;
    OT_ORDER_BY_RATE: 3;
  }

  export const OrderByType: OrderByTypeMap;
}

export class CBRoom extends jspb.Message {
  getRoomId(): number;
  setRoomId(value: number): void;

  getName(): string;
  setName(value: string): void;

  clearSettingsList(): void;
  getSettingsList(): Array<CBSetting>;
  setSettingsList(value: Array<CBSetting>): void;
  addSettings(value?: CBSetting, index?: number): CBSetting;

  clearMaxAmountsList(): void;
  getMaxAmountsList(): Array<CBPlaySummary>;
  setMaxAmountsList(value: Array<CBPlaySummary>): void;
  addMaxAmounts(value?: CBPlaySummary, index?: number): CBPlaySummary;

  getStartTime(): number;
  setStartTime(value: number): void;

  getDuration(): number;
  setDuration(value: number): void;

  getGameDuration(): number;
  setGameDuration(value: number): void;

  getBringInMinLimit(): number;
  setBringInMinLimit(value: number): void;

  getPlayBetMinLimit(): number;
  setPlayBetMinLimit(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CBRoom.AsObject;
  static toObject(includeInstance: boolean, msg: CBRoom): CBRoom.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CBRoom, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CBRoom;
  static deserializeBinaryFromReader(message: CBRoom, reader: jspb.BinaryReader): CBRoom;
}

export namespace CBRoom {
  export type AsObject = {
    roomId: number,
    name: string,
    settingsList: Array<CBSetting.AsObject>,
    maxAmountsList: Array<CBPlaySummary.AsObject>,
    startTime: number,
    duration: number,
    gameDuration: number,
    bringInMinLimit: number,
    playBetMinLimit: number,
  }
}

export class CBGame extends jspb.Message {
  getFirstCard(): number;
  setFirstCard(value: number): void;

  getGameNum(): number;
  setGameNum(value: number): void;

  getGamePast(): number;
  setGamePast(value: number): void;

  hasGameResult(): boolean;
  clearGameResult(): void;
  getGameResult(): CBGameResult | undefined;
  setGameResult(value?: CBGameResult): void;

  getPlayable(): boolean;
  setPlayable(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CBGame.AsObject;
  static toObject(includeInstance: boolean, msg: CBGame): CBGame.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CBGame, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CBGame;
  static deserializeBinaryFromReader(message: CBGame, reader: jspb.BinaryReader): CBGame;
}

export namespace CBGame {
  export type AsObject = {
    firstCard: number,
    gameNum: number,
    gamePast: number,
    gameResult?: CBGameResult.AsObject,
    playable: boolean,
  }
}

export class CBGameResult extends jspb.Message {
  clearResultSlotsList(): void;
  getResultSlotsList(): Array<DefCB.PlaySlotMap[keyof DefCB.PlaySlotMap]>;
  setResultSlotsList(value: Array<DefCB.PlaySlotMap[keyof DefCB.PlaySlotMap]>): void;
  addResultSlots(value: DefCB.PlaySlotMap[keyof DefCB.PlaySlotMap], index?: number): DefCB.PlaySlotMap[keyof DefCB.PlaySlotMap];

  clearPublicCardsList(): void;
  getPublicCardsList(): Array<number>;
  setPublicCardsList(value: Array<number>): void;
  addPublicCards(value: number, index?: number): number;

  hasResultCowboy(): boolean;
  clearResultCowboy(): void;
  getResultCowboy(): CBHandResult | undefined;
  setResultCowboy(value?: CBHandResult): void;

  hasResultBeauty(): boolean;
  clearResultBeauty(): void;
  getResultBeauty(): CBHandResult | undefined;
  setResultBeauty(value?: CBHandResult): void;

  clearSummaryList(): void;
  getSummaryList(): Array<CBPlaySummary>;
  setSummaryList(value: Array<CBPlaySummary>): void;
  addSummary(value?: CBPlaySummary, index?: number): CBPlaySummary;

  clearPublicCardsSelectedList(): void;
  getPublicCardsSelectedList(): Array<boolean>;
  setPublicCardsSelectedList(value: Array<boolean>): void;
  addPublicCardsSelected(value: boolean, index?: number): boolean;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CBGameResult.AsObject;
  static toObject(includeInstance: boolean, msg: CBGameResult): CBGameResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CBGameResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CBGameResult;
  static deserializeBinaryFromReader(message: CBGameResult, reader: jspb.BinaryReader): CBGameResult;
}

export namespace CBGameResult {
  export type AsObject = {
    resultSlotsList: Array<DefCB.PlaySlotMap[keyof DefCB.PlaySlotMap]>,
    publicCardsList: Array<number>,
    resultCowboy?: CBHandResult.AsObject,
    resultBeauty?: CBHandResult.AsObject,
    summaryList: Array<CBPlaySummary.AsObject>,
    publicCardsSelectedList: Array<boolean>,
  }
}

export class CBSetting extends jspb.Message {
  getSlot(): DefCB.PlaySlotMap[keyof DefCB.PlaySlotMap];
  setSlot(value: DefCB.PlaySlotMap[keyof DefCB.PlaySlotMap]): void;

  getValue(): number;
  setValue(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CBSetting.AsObject;
  static toObject(includeInstance: boolean, msg: CBSetting): CBSetting.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CBSetting, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CBSetting;
  static deserializeBinaryFromReader(message: CBSetting, reader: jspb.BinaryReader): CBSetting;
}

export namespace CBSetting {
  export type AsObject = {
    slot: DefCB.PlaySlotMap[keyof DefCB.PlaySlotMap],
    value: number,
  }
}

export class CBPlaySummary extends jspb.Message {
  getSlot(): DefCB.PlaySlotMap[keyof DefCB.PlaySlotMap];
  setSlot(value: DefCB.PlaySlotMap[keyof DefCB.PlaySlotMap]): void;

  getAmount(): number;
  setAmount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CBPlaySummary.AsObject;
  static toObject(includeInstance: boolean, msg: CBPlaySummary): CBPlaySummary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CBPlaySummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CBPlaySummary;
  static deserializeBinaryFromReader(message: CBPlaySummary, reader: jspb.BinaryReader): CBPlaySummary;
}

export namespace CBPlaySummary {
  export type AsObject = {
    slot: DefCB.PlaySlotMap[keyof DefCB.PlaySlotMap],
    amount: number,
  }
}

export class CBPlayResult extends jspb.Message {
  getSlot(): DefCB.PlaySlotMap[keyof DefCB.PlaySlotMap];
  setSlot(value: DefCB.PlaySlotMap[keyof DefCB.PlaySlotMap]): void;

  getAmount(): number;
  setAmount(value: number): void;

  getWin(): number;
  setWin(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CBPlayResult.AsObject;
  static toObject(includeInstance: boolean, msg: CBPlayResult): CBPlayResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CBPlayResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CBPlayResult;
  static deserializeBinaryFromReader(message: CBPlayResult, reader: jspb.BinaryReader): CBPlayResult;
}

export namespace CBPlayResult {
  export type AsObject = {
    slot: DefCB.PlaySlotMap[keyof DefCB.PlaySlotMap],
    amount: number,
    win: number,
  }
}

export class CBSlotUserPlaySummary extends jspb.Message {
  getSlot(): DefCB.PlaySlotMap[keyof DefCB.PlaySlotMap];
  setSlot(value: DefCB.PlaySlotMap[keyof DefCB.PlaySlotMap]): void;

  clearUserSummaryList(): void;
  getUserSummaryList(): Array<CBUserPlaySummary>;
  setUserSummaryList(value: Array<CBUserPlaySummary>): void;
  addUserSummary(value?: CBUserPlaySummary, index?: number): CBUserPlaySummary;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CBSlotUserPlaySummary.AsObject;
  static toObject(includeInstance: boolean, msg: CBSlotUserPlaySummary): CBSlotUserPlaySummary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CBSlotUserPlaySummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CBSlotUserPlaySummary;
  static deserializeBinaryFromReader(message: CBSlotUserPlaySummary, reader: jspb.BinaryReader): CBSlotUserPlaySummary;
}

export namespace CBSlotUserPlaySummary {
  export type AsObject = {
    slot: DefCB.PlaySlotMap[keyof DefCB.PlaySlotMap],
    userSummaryList: Array<CBUserPlaySummary.AsObject>,
  }
}

export class CBUserPlaySummary extends jspb.Message {
  getUserId(): number;
  setUserId(value: number): void;

  getName(): string;
  setName(value: string): void;

  getAvatar(): string;
  setAvatar(value: string): void;

  getAmount(): number;
  setAmount(value: number): void;

  getWin(): number;
  setWin(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CBUserPlaySummary.AsObject;
  static toObject(includeInstance: boolean, msg: CBUserPlaySummary): CBUserPlaySummary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CBUserPlaySummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CBUserPlaySummary;
  static deserializeBinaryFromReader(message: CBUserPlaySummary, reader: jspb.BinaryReader): CBUserPlaySummary;
}

export namespace CBUserPlaySummary {
  export type AsObject = {
    userId: number,
    name: string,
    avatar: string,
    amount: number,
    win: number,
  }
}

export class CBHandResult extends jspb.Message {
  clearCardsList(): void;
  getCardsList(): Array<number>;
  setCardsList(value: Array<number>): void;
  addCards(value: number, index?: number): number;

  getHandValueType(): number;
  setHandValueType(value: number): void;

  clearSelectedList(): void;
  getSelectedList(): Array<boolean>;
  setSelectedList(value: Array<boolean>): void;
  addSelected(value: boolean, index?: number): boolean;

  clearPublicCardsSelectedList(): void;
  getPublicCardsSelectedList(): Array<boolean>;
  setPublicCardsSelectedList(value: Array<boolean>): void;
  addPublicCardsSelected(value: boolean, index?: number): boolean;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CBHandResult.AsObject;
  static toObject(includeInstance: boolean, msg: CBHandResult): CBHandResult.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CBHandResult, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CBHandResult;
  static deserializeBinaryFromReader(message: CBHandResult, reader: jspb.BinaryReader): CBHandResult;
}

export namespace CBHandResult {
  export type AsObject = {
    cardsList: Array<number>,
    handValueType: number,
    selectedList: Array<boolean>,
    publicCardsSelectedList: Array<boolean>,
  }
}

export class CBGameHistorySummary extends jspb.Message {
  clearPublicCardsList(): void;
  getPublicCardsList(): Array<number>;
  setPublicCardsList(value: Array<number>): void;
  addPublicCards(value: number, index?: number): number;

  clearCowboyList(): void;
  getCowboyList(): Array<number>;
  setCowboyList(value: Array<number>): void;
  addCowboy(value: number, index?: number): number;

  clearBeautyList(): void;
  getBeautyList(): Array<number>;
  setBeautyList(value: Array<number>): void;
  addBeauty(value: number, index?: number): number;

  getTotal(): number;
  setTotal(value: number): void;

  clearResultSlotsList(): void;
  getResultSlotsList(): Array<DefCB.PlaySlotMap[keyof DefCB.PlaySlotMap]>;
  setResultSlotsList(value: Array<DefCB.PlaySlotMap[keyof DefCB.PlaySlotMap]>): void;
  addResultSlots(value: DefCB.PlaySlotMap[keyof DefCB.PlaySlotMap], index?: number): DefCB.PlaySlotMap[keyof DefCB.PlaySlotMap];

  clearMyPlayList(): void;
  getMyPlayList(): Array<CBPlayResult>;
  setMyPlayList(value: Array<CBPlayResult>): void;
  addMyPlay(value?: CBPlayResult, index?: number): CBPlayResult;

  getMyWin(): number;
  setMyWin(value: number): void;

  getGameNum(): number;
  setGameNum(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CBGameHistorySummary.AsObject;
  static toObject(includeInstance: boolean, msg: CBGameHistorySummary): CBGameHistorySummary.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CBGameHistorySummary, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CBGameHistorySummary;
  static deserializeBinaryFromReader(message: CBGameHistorySummary, reader: jspb.BinaryReader): CBGameHistorySummary;
}

export namespace CBGameHistorySummary {
  export type AsObject = {
    publicCardsList: Array<number>,
    cowboyList: Array<number>,
    beautyList: Array<number>,
    total: number,
    resultSlotsList: Array<DefCB.PlaySlotMap[keyof DefCB.PlaySlotMap]>,
    myPlayList: Array<CBPlayResult.AsObject>,
    myWin: number,
    gameNum: number,
  }
}

export class CBHistoryItem extends jspb.Message {
  getSlot(): DefCB.HistorySlotMap[keyof DefCB.HistorySlotMap];
  setSlot(value: DefCB.HistorySlotMap[keyof DefCB.HistorySlotMap]): void;

  clearResultList(): void;
  getResultList(): Array<DefCB.HistoryResultMap[keyof DefCB.HistoryResultMap]>;
  setResultList(value: Array<DefCB.HistoryResultMap[keyof DefCB.HistoryResultMap]>): void;
  addResult(value: DefCB.HistoryResultMap[keyof DefCB.HistoryResultMap], index?: number): DefCB.HistoryResultMap[keyof DefCB.HistoryResultMap];

  getNotOccurTimes(): number;
  setNotOccurTimes(value: number): void;

  getOccurTimes(): number;
  setOccurTimes(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CBHistoryItem.AsObject;
  static toObject(includeInstance: boolean, msg: CBHistoryItem): CBHistoryItem.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CBHistoryItem, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CBHistoryItem;
  static deserializeBinaryFromReader(message: CBHistoryItem, reader: jspb.BinaryReader): CBHistoryItem;
}

export namespace CBHistoryItem {
  export type AsObject = {
    slot: DefCB.HistorySlotMap[keyof DefCB.HistorySlotMap],
    resultList: Array<DefCB.HistoryResultMap[keyof DefCB.HistoryResultMap]>,
    notOccurTimes: number,
    occurTimes: number,
  }
}

export class CBHistorySimpleItem extends jspb.Message {
  getSlot(): DefCB.HistorySlotMap[keyof DefCB.HistorySlotMap];
  setSlot(value: DefCB.HistorySlotMap[keyof DefCB.HistorySlotMap]): void;

  getOccurTimes(): number;
  setOccurTimes(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CBHistorySimpleItem.AsObject;
  static toObject(includeInstance: boolean, msg: CBHistorySimpleItem): CBHistorySimpleItem.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CBHistorySimpleItem, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CBHistorySimpleItem;
  static deserializeBinaryFromReader(message: CBHistorySimpleItem, reader: jspb.BinaryReader): CBHistorySimpleItem;
}

export namespace CBHistorySimpleItem {
  export type AsObject = {
    slot: DefCB.HistorySlotMap[keyof DefCB.HistorySlotMap],
    occurTimes: number,
  }
}

export class CBWayPointMove extends jspb.Message {
  getIndex(): number;
  setIndex(value: number): void;

  getColor(): DefCB.WayPointColorMap[keyof DefCB.WayPointColorMap];
  setColor(value: DefCB.WayPointColorMap[keyof DefCB.WayPointColorMap]): void;

  getMoveX(): number;
  setMoveX(value: number): void;

  getMoveY(): number;
  setMoveY(value: number): void;

  getHandValueType(): number;
  setHandValueType(value: number): void;

  getDrawNum(): number;
  setDrawNum(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CBWayPointMove.AsObject;
  static toObject(includeInstance: boolean, msg: CBWayPointMove): CBWayPointMove.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CBWayPointMove, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CBWayPointMove;
  static deserializeBinaryFromReader(message: CBWayPointMove, reader: jspb.BinaryReader): CBWayPointMove;
}

export namespace CBWayPointMove {
  export type AsObject = {
    index: number,
    color: DefCB.WayPointColorMap[keyof DefCB.WayPointColorMap],
    moveX: number,
    moveY: number,
    handValueType: number,
    drawNum: number,
  }
}

export class CBWayPointStatic extends jspb.Message {
  getIndex(): number;
  setIndex(value: number): void;

  getColor(): DefCB.WayPointColorMap[keyof DefCB.WayPointColorMap];
  setColor(value: DefCB.WayPointColorMap[keyof DefCB.WayPointColorMap]): void;

  getPosX(): number;
  setPosX(value: number): void;

  getPosY(): number;
  setPosY(value: number): void;

  getHandValueType(): number;
  setHandValueType(value: number): void;

  getDrawNum(): number;
  setDrawNum(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CBWayPointStatic.AsObject;
  static toObject(includeInstance: boolean, msg: CBWayPointStatic): CBWayPointStatic.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CBWayPointStatic, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CBWayPointStatic;
  static deserializeBinaryFromReader(message: CBWayPointStatic, reader: jspb.BinaryReader): CBWayPointStatic;
}

export namespace CBWayPointStatic {
  export type AsObject = {
    index: number,
    color: DefCB.WayPointColorMap[keyof DefCB.WayPointColorMap],
    posX: number,
    posY: number,
    handValueType: number,
    drawNum: number,
  }
}

export class CBWayPointPreview extends jspb.Message {
  getBmColor(): DefCB.WayPointColorMap[keyof DefCB.WayPointColorMap];
  setBmColor(value: DefCB.WayPointColorMap[keyof DefCB.WayPointColorMap]): void;

  getSmColor(): DefCB.WayPointColorMap[keyof DefCB.WayPointColorMap];
  setSmColor(value: DefCB.WayPointColorMap[keyof DefCB.WayPointColorMap]): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CBWayPointPreview.AsObject;
  static toObject(includeInstance: boolean, msg: CBWayPointPreview): CBWayPointPreview.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CBWayPointPreview, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CBWayPointPreview;
  static deserializeBinaryFromReader(message: CBWayPointPreview, reader: jspb.BinaryReader): CBWayPointPreview;
}

export namespace CBWayPointPreview {
  export type AsObject = {
    bmColor: DefCB.WayPointColorMap[keyof DefCB.WayPointColorMap],
    smColor: DefCB.WayPointColorMap[keyof DefCB.WayPointColorMap],
  }
}

export class CBWayPointMap extends jspb.Message {
  getWidth(): number;
  setWidth(value: number): void;

  getHeight(): number;
  setHeight(value: number): void;

  clearSequenceList(): void;
  getSequenceList(): Array<CBWayPointMove>;
  setSequenceList(value: Array<CBWayPointMove>): void;
  addSequence(value?: CBWayPointMove, index?: number): CBWayPointMove;

  clearAdditionalList(): void;
  getAdditionalList(): Array<CBWayPointStatic>;
  setAdditionalList(value: Array<CBWayPointStatic>): void;
  addAdditional(value?: CBWayPointStatic, index?: number): CBWayPointStatic;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CBWayPointMap.AsObject;
  static toObject(includeInstance: boolean, msg: CBWayPointMap): CBWayPointMap.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CBWayPointMap, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CBWayPointMap;
  static deserializeBinaryFromReader(message: CBWayPointMap, reader: jspb.BinaryReader): CBWayPointMap;
}

export namespace CBWayPointMap {
  export type AsObject = {
    width: number,
    height: number,
    sequenceList: Array<CBWayPointMove.AsObject>,
    additionalList: Array<CBWayPointStatic.AsObject>,
  }
}

export class CBUserPlay extends jspb.Message {
  getUserId(): number;
  setUserId(value: number): void;

  getName(): string;
  setName(value: string): void;

  getAvatar(): string;
  setAvatar(value: string): void;

  getAmount(): number;
  setAmount(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CBUserPlay.AsObject;
  static toObject(includeInstance: boolean, msg: CBUserPlay): CBUserPlay.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CBUserPlay, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CBUserPlay;
  static deserializeBinaryFromReader(message: CBUserPlay, reader: jspb.BinaryReader): CBUserPlay;
}

export namespace CBUserPlay {
  export type AsObject = {
    userId: number,
    name: string,
    avatar: string,
    amount: number,
  }
}

export class CBUser extends jspb.Message {
  getUserId(): number;
  setUserId(value: number): void;

  getName(): string;
  setName(value: string): void;

  getAvatar(): string;
  setAvatar(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CBUser.AsObject;
  static toObject(includeInstance: boolean, msg: CBUser): CBUser.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CBUser, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CBUser;
  static deserializeBinaryFromReader(message: CBUser, reader: jspb.BinaryReader): CBUser;
}

export namespace CBUser {
  export type AsObject = {
    userId: number,
    name: string,
    avatar: string,
  }
}

