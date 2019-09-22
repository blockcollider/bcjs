// package: bc
// file: db.proto

import * as jspb from "google-protobuf";

export class DbValue extends jspb.Message {
  getType(): string;
  setType(value: string): void;

  getData(): Uint8Array | string;
  getData_asU8(): Uint8Array;
  getData_asB64(): string;
  setData(value: Uint8Array | string): void;

  getVersion(): number;
  setVersion(value: number): void;

  getIsNative(): boolean;
  setIsNative(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DbValue.AsObject;
  static toObject(includeInstance: boolean, msg: DbValue): DbValue.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: DbValue, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DbValue;
  static deserializeBinaryFromReader(message: DbValue, reader: jspb.BinaryReader): DbValue;
}

export namespace DbValue {
  export type AsObject = {
    type: string,
    data: Uint8Array | string,
    version: number,
    isNative: boolean,
  }
}

export class CounterPartySettleInfo extends jspb.Message {
  getSettled(): boolean;
  setSettled(value: boolean): void;

  getTxHash(): string;
  setTxHash(value: string): void;

  getOutputIndex(): number;
  setOutputIndex(value: number): void;

  getSendsAddress(): string;
  setSendsAddress(value: string): void;

  getScheduled(): boolean;
  setScheduled(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CounterPartySettleInfo.AsObject;
  static toObject(includeInstance: boolean, msg: CounterPartySettleInfo): CounterPartySettleInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CounterPartySettleInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CounterPartySettleInfo;
  static deserializeBinaryFromReader(message: CounterPartySettleInfo, reader: jspb.BinaryReader): CounterPartySettleInfo;
}

export namespace CounterPartySettleInfo {
  export type AsObject = {
    settled: boolean,
    txHash: string,
    outputIndex: number,
    sendsAddress: string,
    scheduled: boolean,
  }
}

export class CrossTxSettlementToWatch extends jspb.Message {
  getSettleEndsAt(): number;
  setSettleEndsAt(value: number): void;

  clearTakerSettleInfoList(): void;
  getTakerSettleInfoList(): Array<CounterPartySettleInfo>;
  setTakerSettleInfoList(value: Array<CounterPartySettleInfo>): void;
  addTakerSettleInfo(value?: CounterPartySettleInfo, index?: number): CounterPartySettleInfo;

  clearMakerSettleInfoList(): void;
  getMakerSettleInfoList(): Array<CounterPartySettleInfo>;
  setMakerSettleInfoList(value: Array<CounterPartySettleInfo>): void;
  addMakerSettleInfo(value?: CounterPartySettleInfo, index?: number): CounterPartySettleInfo;

  getShift(): number;
  setShift(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CrossTxSettlementToWatch.AsObject;
  static toObject(includeInstance: boolean, msg: CrossTxSettlementToWatch): CrossTxSettlementToWatch.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CrossTxSettlementToWatch, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CrossTxSettlementToWatch;
  static deserializeBinaryFromReader(message: CrossTxSettlementToWatch, reader: jspb.BinaryReader): CrossTxSettlementToWatch;
}

export namespace CrossTxSettlementToWatch {
  export type AsObject = {
    settleEndsAt: number,
    takerSettleInfoList: Array<CounterPartySettleInfo.AsObject>,
    makerSettleInfoList: Array<CounterPartySettleInfo.AsObject>,
    shift: number,
  }
}

export class SettleSchedule extends jspb.Message {
  getAddrFrom(): string;
  setAddrFrom(value: string): void;

  getAddrTo(): string;
  setAddrTo(value: string): void;

  getBridgedChain(): string;
  setBridgedChain(value: string): void;

  getBcHeight(): number;
  setBcHeight(value: number): void;

  getBridgedChainHash(): string;
  setBridgedChainHash(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SettleSchedule.AsObject;
  static toObject(includeInstance: boolean, msg: SettleSchedule): SettleSchedule.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SettleSchedule, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SettleSchedule;
  static deserializeBinaryFromReader(message: SettleSchedule, reader: jspb.BinaryReader): SettleSchedule;
}

export namespace SettleSchedule {
  export type AsObject = {
    addrFrom: string,
    addrTo: string,
    bridgedChain: string,
    bcHeight: number,
    bridgedChainHash: string,
  }
}

export class Schedules extends jspb.Message {
  clearSchedulesList(): void;
  getSchedulesList(): Array<SettleSchedule>;
  setSchedulesList(value: Array<SettleSchedule>): void;
  addSchedules(value?: SettleSchedule, index?: number): SettleSchedule;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Schedules.AsObject;
  static toObject(includeInstance: boolean, msg: Schedules): Schedules.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Schedules, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Schedules;
  static deserializeBinaryFromReader(message: Schedules, reader: jspb.BinaryReader): Schedules;
}

export namespace Schedules {
  export type AsObject = {
    schedulesList: Array<SettleSchedule.AsObject>,
  }
}

