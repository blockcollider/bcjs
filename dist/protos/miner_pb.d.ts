// package: bc
// file: miner.proto

import * as jspb from "google-protobuf";
import * as core_pb from "./core_pb";

export class BlockFingerprint extends jspb.Message {
  getBlockchain(): string;
  setBlockchain(value: string): void;

  getHash(): string;
  setHash(value: string): void;

  getTimestamp(): number;
  setTimestamp(value: number): void;

  getIsCurrent(): boolean;
  setIsCurrent(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockFingerprint.AsObject;
  static toObject(includeInstance: boolean, msg: BlockFingerprint): BlockFingerprint.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockFingerprint, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockFingerprint;
  static deserializeBinaryFromReader(message: BlockFingerprint, reader: jspb.BinaryReader): BlockFingerprint;
}

export namespace BlockFingerprint {
  export type AsObject = {
    blockchain: string,
    hash: string,
    timestamp: number,
    isCurrent: boolean,
  }
}

export class MinerRequest extends jspb.Message {
  getWorkId(): string;
  setWorkId(value: string): void;

  getCurrentTimestamp(): number;
  setCurrentTimestamp(value: number): void;

  getOffset(): number;
  setOffset(value: number): void;

  getWork(): string;
  setWork(value: string): void;

  getMinerKey(): string;
  setMinerKey(value: string): void;

  getMerkleRoot(): string;
  setMerkleRoot(value: string): void;

  getDifficulty(): string;
  setDifficulty(value: string): void;

  hasLastPreviousBlock(): boolean;
  clearLastPreviousBlock(): void;
  getLastPreviousBlock(): core_pb.BcBlock | undefined;
  setLastPreviousBlock(value?: core_pb.BcBlock): void;

  hasNewBlockHeaders(): boolean;
  clearNewBlockHeaders(): void;
  getNewBlockHeaders(): core_pb.BlockchainHeaders | undefined;
  setNewBlockHeaders(value?: core_pb.BlockchainHeaders): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MinerRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MinerRequest): MinerRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MinerRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MinerRequest;
  static deserializeBinaryFromReader(message: MinerRequest, reader: jspb.BinaryReader): MinerRequest;
}

export namespace MinerRequest {
  export type AsObject = {
    workId: string,
    currentTimestamp: number,
    offset: number,
    work: string,
    minerKey: string,
    merkleRoot: string,
    difficulty: string,
    lastPreviousBlock?: core_pb.BcBlock.AsObject,
    newBlockHeaders?: core_pb.BlockchainHeaders.AsObject,
  }
}

export class MinerResponse extends jspb.Message {
  getResult(): MinerResponseResultMap[keyof MinerResponseResultMap];
  setResult(value: MinerResponseResultMap[keyof MinerResponseResultMap]): void;

  getNonce(): string;
  setNonce(value: string): void;

  getDifficulty(): string;
  setDifficulty(value: string): void;

  getDistance(): string;
  setDistance(value: string): void;

  getTimestamp(): number;
  setTimestamp(value: number): void;

  getIterations(): number;
  setIterations(value: number): void;

  getTimeDiff(): number;
  setTimeDiff(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MinerResponse.AsObject;
  static toObject(includeInstance: boolean, msg: MinerResponse): MinerResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MinerResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MinerResponse;
  static deserializeBinaryFromReader(message: MinerResponse, reader: jspb.BinaryReader): MinerResponse;
}

export namespace MinerResponse {
  export type AsObject = {
    result: MinerResponseResultMap[keyof MinerResponseResultMap],
    nonce: string,
    difficulty: string,
    distance: string,
    timestamp: number,
    iterations: number,
    timeDiff: number,
  }
}

export interface MinerResponseResultMap {
  CANCELED: 0;
  OK: 1;
  ERROR: 2;
}

export const MinerResponseResult: MinerResponseResultMap;

