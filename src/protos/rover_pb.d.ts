// package: bcsdk
// file: rover.proto

import * as jspb from "google-protobuf";
import * as core_pb from "./core_pb";

export class RoverIdent extends jspb.Message {
  getRoverName(): string;
  setRoverName(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RoverIdent.AsObject;
  static toObject(includeInstance: boolean, msg: RoverIdent): RoverIdent.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RoverIdent, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RoverIdent;
  static deserializeBinaryFromReader(message: RoverIdent, reader: jspb.BinaryReader): RoverIdent;
}

export namespace RoverIdent {
  export type AsObject = {
    roverName: string,
  }
}

export class RoverSyncStatus extends jspb.Message {
  getRoverName(): string;
  setRoverName(value: string): void;

  getStatus(): boolean;
  setStatus(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RoverSyncStatus.AsObject;
  static toObject(includeInstance: boolean, msg: RoverSyncStatus): RoverSyncStatus.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RoverSyncStatus, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RoverSyncStatus;
  static deserializeBinaryFromReader(message: RoverSyncStatus, reader: jspb.BinaryReader): RoverSyncStatus;
}

export namespace RoverSyncStatus {
  export type AsObject = {
    roverName: string,
    status: boolean,
  }
}

export class RoverMessage extends jspb.Message {
  getType(): RoverMessageTypeMap[keyof RoverMessageTypeMap];
  setType(value: RoverMessageTypeMap[keyof RoverMessageTypeMap]): void;

  hasResync(): boolean;
  clearResync(): void;
  getResync(): RoverMessage.Resync | undefined;
  setResync(value?: RoverMessage.Resync): void;

  hasFetchBlock(): boolean;
  clearFetchBlock(): void;
  getFetchBlock(): RoverMessage.FetchBlock | undefined;
  setFetchBlock(value?: RoverMessage.FetchBlock): void;

  hasRoverBlockRange(): boolean;
  clearRoverBlockRange(): void;
  getRoverBlockRange(): RoverMessage.RoverBlockRange | undefined;
  setRoverBlockRange(value?: RoverMessage.RoverBlockRange): void;

  getPayloadCase(): RoverMessage.PayloadCase;
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RoverMessage.AsObject;
  static toObject(includeInstance: boolean, msg: RoverMessage): RoverMessage.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RoverMessage, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RoverMessage;
  static deserializeBinaryFromReader(message: RoverMessage, reader: jspb.BinaryReader): RoverMessage;
}

export namespace RoverMessage {
  export type AsObject = {
    type: RoverMessageTypeMap[keyof RoverMessageTypeMap],
    resync?: RoverMessage.Resync.AsObject,
    fetchBlock?: RoverMessage.FetchBlock.AsObject,
    roverBlockRange?: RoverMessage.RoverBlockRange.AsObject,
  }

  export class FetchBlock extends jspb.Message {
    hasFromBlock(): boolean;
    clearFromBlock(): void;
    getFromBlock(): core_pb.Block | undefined;
    setFromBlock(value?: core_pb.Block): void;

    hasToBlock(): boolean;
    clearToBlock(): void;
    getToBlock(): core_pb.Block | undefined;
    setToBlock(value?: core_pb.Block): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): FetchBlock.AsObject;
    static toObject(includeInstance: boolean, msg: FetchBlock): FetchBlock.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: FetchBlock, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): FetchBlock;
    static deserializeBinaryFromReader(message: FetchBlock, reader: jspb.BinaryReader): FetchBlock;
  }

  export namespace FetchBlock {
    export type AsObject = {
      fromBlock?: core_pb.Block.AsObject,
      toBlock?: core_pb.Block.AsObject,
    }
  }

  export class RoverBlockRange extends jspb.Message {
    getRoverName(): string;
    setRoverName(value: string): void;

    getHighestHeight(): number;
    setHighestHeight(value: number): void;

    getLowestHeight(): number;
    setLowestHeight(value: number): void;

    getHighestHash(): string;
    setHighestHash(value: string): void;

    getLowestHash(): string;
    setLowestHash(value: string): void;

    getSynced(): string;
    setSynced(value: string): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): RoverBlockRange.AsObject;
    static toObject(includeInstance: boolean, msg: RoverBlockRange): RoverBlockRange.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: RoverBlockRange, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): RoverBlockRange;
    static deserializeBinaryFromReader(message: RoverBlockRange, reader: jspb.BinaryReader): RoverBlockRange;
  }

  export namespace RoverBlockRange {
    export type AsObject = {
      roverName: string,
      highestHeight: number,
      lowestHeight: number,
      highestHash: string,
      lowestHash: string,
      synced: string,
    }
  }

  export class Resync extends jspb.Message {
    hasLatestBlock(): boolean;
    clearLatestBlock(): void;
    getLatestBlock(): core_pb.Block | undefined;
    setLatestBlock(value?: core_pb.Block): void;

    clearIntervalsList(): void;
    getIntervalsList(): Array<RoverMessage.Resync.Interval>;
    setIntervalsList(value: Array<RoverMessage.Resync.Interval>): void;
    addIntervals(value?: RoverMessage.Resync.Interval, index?: number): RoverMessage.Resync.Interval;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): Resync.AsObject;
    static toObject(includeInstance: boolean, msg: Resync): Resync.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: Resync, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): Resync;
    static deserializeBinaryFromReader(message: Resync, reader: jspb.BinaryReader): Resync;
  }

  export namespace Resync {
    export type AsObject = {
      latestBlock?: core_pb.Block.AsObject,
      intervalsList: Array<RoverMessage.Resync.Interval.AsObject>,
    }

    export class Interval extends jspb.Message {
      hasFromBlock(): boolean;
      clearFromBlock(): void;
      getFromBlock(): core_pb.Block | undefined;
      setFromBlock(value?: core_pb.Block): void;

      hasToBlock(): boolean;
      clearToBlock(): void;
      getToBlock(): core_pb.Block | undefined;
      setToBlock(value?: core_pb.Block): void;

      serializeBinary(): Uint8Array;
      toObject(includeInstance?: boolean): Interval.AsObject;
      static toObject(includeInstance: boolean, msg: Interval): Interval.AsObject;
      static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
      static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
      static serializeBinaryToWriter(message: Interval, writer: jspb.BinaryWriter): void;
      static deserializeBinary(bytes: Uint8Array): Interval;
      static deserializeBinaryFromReader(message: Interval, reader: jspb.BinaryReader): Interval;
    }

    export namespace Interval {
      export type AsObject = {
        fromBlock?: core_pb.Block.AsObject,
        toBlock?: core_pb.Block.AsObject,
      }
    }
  }

  export enum PayloadCase {
    PAYLOAD_NOT_SET = 0,
    RESYNC = 2,
    FETCH_BLOCK = 3,
    ROVER_BLOCK_RANGE = 4,
  }
}

export class SettleTxCheckReq extends jspb.Message {
  clearPossibleTransactionsList(): void;
  getPossibleTransactionsList(): Array<SettleTxCheckReq.PossibleTransaction>;
  setPossibleTransactionsList(value: Array<SettleTxCheckReq.PossibleTransaction>): void;
  addPossibleTransactions(value?: SettleTxCheckReq.PossibleTransaction, index?: number): SettleTxCheckReq.PossibleTransaction;

  getBlockHash(): string;
  setBlockHash(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SettleTxCheckReq.AsObject;
  static toObject(includeInstance: boolean, msg: SettleTxCheckReq): SettleTxCheckReq.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SettleTxCheckReq, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SettleTxCheckReq;
  static deserializeBinaryFromReader(message: SettleTxCheckReq, reader: jspb.BinaryReader): SettleTxCheckReq;
}

export namespace SettleTxCheckReq {
  export type AsObject = {
    possibleTransactionsList: Array<SettleTxCheckReq.PossibleTransaction.AsObject>,
    blockHash: string,
  }

  export class PossibleTransaction extends jspb.Message {
    getAddrTo(): string;
    setAddrTo(value: string): void;

    getAddrFrom(): string;
    setAddrFrom(value: string): void;

    getValue(): Uint8Array | string;
    getValue_asU8(): Uint8Array;
    getValue_asB64(): string;
    setValue(value: Uint8Array | string): void;

    getBridgedChain(): string;
    setBridgedChain(value: string): void;

    getTxId(): string;
    setTxId(value: string): void;

    getBlockHeight(): number;
    setBlockHeight(value: number): void;

    getTokenType(): string;
    setTokenType(value: string): void;

    serializeBinary(): Uint8Array;
    toObject(includeInstance?: boolean): PossibleTransaction.AsObject;
    static toObject(includeInstance: boolean, msg: PossibleTransaction): PossibleTransaction.AsObject;
    static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
    static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
    static serializeBinaryToWriter(message: PossibleTransaction, writer: jspb.BinaryWriter): void;
    static deserializeBinary(bytes: Uint8Array): PossibleTransaction;
    static deserializeBinaryFromReader(message: PossibleTransaction, reader: jspb.BinaryReader): PossibleTransaction;
  }

  export namespace PossibleTransaction {
    export type AsObject = {
      addrTo: string,
      addrFrom: string,
      value: Uint8Array | string,
      bridgedChain: string,
      txId: string,
      blockHeight: number,
      tokenType: string,
    }
  }
}

export class SettleTxCheckResponse extends jspb.Message {
  clearMarkedTransactionsList(): void;
  getMarkedTransactionsList(): Array<core_pb.MarkedTransaction>;
  setMarkedTransactionsList(value: Array<core_pb.MarkedTransaction>): void;
  addMarkedTransactions(value?: core_pb.MarkedTransaction, index?: number): core_pb.MarkedTransaction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SettleTxCheckResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SettleTxCheckResponse): SettleTxCheckResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: SettleTxCheckResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SettleTxCheckResponse;
  static deserializeBinaryFromReader(message: SettleTxCheckResponse, reader: jspb.BinaryReader): SettleTxCheckResponse;
}

export namespace SettleTxCheckResponse {
  export type AsObject = {
    markedTransactionsList: Array<core_pb.MarkedTransaction.AsObject>,
  }
}

export interface RoverMessageTypeMap {
  FETCHBLOCK: 0;
  REQUESTRESYNC: 1;
  ROVER_BLOCK_RANGE: 2;
}

export const RoverMessageType: RoverMessageTypeMap;

