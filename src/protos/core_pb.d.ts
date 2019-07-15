// package: bc
// file: core.proto

import * as jspb from "google-protobuf";

export class Null extends jspb.Message {
  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Null.AsObject;
  static toObject(includeInstance: boolean, msg: Null): Null.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Null, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Null;
  static deserializeBinaryFromReader(message: Null, reader: jspb.BinaryReader): Null;
}

export namespace Null {
  export type AsObject = {
  }
}

export class Block extends jspb.Message {
  getBlockchain(): string;
  setBlockchain(value: string): void;

  getHash(): string;
  setHash(value: string): void;

  getPreviousHash(): string;
  setPreviousHash(value: string): void;

  getTimestamp(): number;
  setTimestamp(value: number): void;

  getHeight(): number;
  setHeight(value: number): void;

  getMerkleRoot(): string;
  setMerkleRoot(value: string): void;

  getMarkedTxCount(): number;
  setMarkedTxCount(value: number): void;

  clearMarkedTxsList(): void;
  getMarkedTxsList(): Array<MarkedTransaction>;
  setMarkedTxsList(value: Array<MarkedTransaction>): void;
  addMarkedTxs(value?: MarkedTransaction, index?: number): MarkedTransaction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Block.AsObject;
  static toObject(includeInstance: boolean, msg: Block): Block.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Block, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Block;
  static deserializeBinaryFromReader(message: Block, reader: jspb.BinaryReader): Block;
}

export namespace Block {
  export type AsObject = {
    blockchain: string,
    hash: string,
    previousHash: string,
    timestamp: number,
    height: number,
    merkleRoot: string,
    markedTxCount: number,
    markedTxsList: Array<MarkedTransaction.AsObject>,
  }
}

export class MarkedTransaction extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  getHash(): string;
  setHash(value: string): void;

  getId(): string;
  setId(value: string): void;

  getToken(): string;
  setToken(value: string): void;

  getAddrFrom(): string;
  setAddrFrom(value: string): void;

  getAddrTo(): string;
  setAddrTo(value: string): void;

  getBlockHeight(): number;
  setBlockHeight(value: number): void;

  getIndex(): number;
  setIndex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MarkedTransaction.AsObject;
  static toObject(includeInstance: boolean, msg: MarkedTransaction): MarkedTransaction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MarkedTransaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MarkedTransaction;
  static deserializeBinaryFromReader(message: MarkedTransaction, reader: jspb.BinaryReader): MarkedTransaction;
}

export namespace MarkedTransaction {
  export type AsObject = {
    value: Uint8Array | string,
    hash: string,
    id: string,
    token: string,
    addrFrom: string,
    addrTo: string,
    blockHeight: number,
    index: number,
  }
}

export class BlockchainHeaders extends jspb.Message {
  clearBtcList(): void;
  getBtcList(): Array<BlockchainHeader>;
  setBtcList(value: Array<BlockchainHeader>): void;
  addBtc(value?: BlockchainHeader, index?: number): BlockchainHeader;

  clearEthList(): void;
  getEthList(): Array<BlockchainHeader>;
  setEthList(value: Array<BlockchainHeader>): void;
  addEth(value?: BlockchainHeader, index?: number): BlockchainHeader;

  clearLskList(): void;
  getLskList(): Array<BlockchainHeader>;
  setLskList(value: Array<BlockchainHeader>): void;
  addLsk(value?: BlockchainHeader, index?: number): BlockchainHeader;

  clearNeoList(): void;
  getNeoList(): Array<BlockchainHeader>;
  setNeoList(value: Array<BlockchainHeader>): void;
  addNeo(value?: BlockchainHeader, index?: number): BlockchainHeader;

  clearWavList(): void;
  getWavList(): Array<BlockchainHeader>;
  setWavList(value: Array<BlockchainHeader>): void;
  addWav(value?: BlockchainHeader, index?: number): BlockchainHeader;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockchainHeaders.AsObject;
  static toObject(includeInstance: boolean, msg: BlockchainHeaders): BlockchainHeaders.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockchainHeaders, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockchainHeaders;
  static deserializeBinaryFromReader(message: BlockchainHeaders, reader: jspb.BinaryReader): BlockchainHeaders;
}

export namespace BlockchainHeaders {
  export type AsObject = {
    btcList: Array<BlockchainHeader.AsObject>,
    ethList: Array<BlockchainHeader.AsObject>,
    lskList: Array<BlockchainHeader.AsObject>,
    neoList: Array<BlockchainHeader.AsObject>,
    wavList: Array<BlockchainHeader.AsObject>,
  }
}

export class BcBlock extends jspb.Message {
  getHash(): string;
  setHash(value: string): void;

  getPreviousHash(): string;
  setPreviousHash(value: string): void;

  getVersion(): number;
  setVersion(value: number): void;

  getSchemaVersion(): number;
  setSchemaVersion(value: number): void;

  getHeight(): number;
  setHeight(value: number): void;

  getMiner(): string;
  setMiner(value: string): void;

  getDifficulty(): string;
  setDifficulty(value: string): void;

  getTimestamp(): number;
  setTimestamp(value: number): void;

  getMerkleRoot(): string;
  setMerkleRoot(value: string): void;

  getChainRoot(): string;
  setChainRoot(value: string): void;

  getDistance(): string;
  setDistance(value: string): void;

  getTotalDistance(): string;
  setTotalDistance(value: string): void;

  getNonce(): string;
  setNonce(value: string): void;

  getNrgGrant(): number;
  setNrgGrant(value: number): void;

  getTargetHash(): string;
  setTargetHash(value: string): void;

  getTargetHeight(): number;
  setTargetHeight(value: number): void;

  getTargetMiner(): string;
  setTargetMiner(value: string): void;

  getTargetSignature(): string;
  setTargetSignature(value: string): void;

  getTwn(): number;
  setTwn(value: number): void;

  clearTwsList(): void;
  getTwsList(): Array<string>;
  setTwsList(value: Array<string>): void;
  addTws(value: string, index?: number): string;

  getEmblemWeight(): number;
  setEmblemWeight(value: number): void;

  getEmblemChainBlockHash(): string;
  setEmblemChainBlockHash(value: string): void;

  getEmblemChainFingerprintRoot(): string;
  setEmblemChainFingerprintRoot(value: string): void;

  getEmblemChainAddress(): string;
  setEmblemChainAddress(value: string): void;

  getTxCount(): number;
  setTxCount(value: number): void;

  clearTxsList(): void;
  getTxsList(): Array<Transaction>;
  setTxsList(value: Array<Transaction>): void;
  addTxs(value?: Transaction, index?: number): Transaction;

  getTxFeeBase(): number;
  setTxFeeBase(value: number): void;

  getTxDistanceSumLimit(): number;
  setTxDistanceSumLimit(value: number): void;

  getBlockchainHeadersCount(): number;
  setBlockchainHeadersCount(value: number): void;

  hasBlockchainHeaders(): boolean;
  clearBlockchainHeaders(): void;
  getBlockchainHeaders(): BlockchainHeaders | undefined;
  setBlockchainHeaders(value?: BlockchainHeaders): void;

  getBlockchainFingerprintsRoot(): string;
  setBlockchainFingerprintsRoot(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BcBlock.AsObject;
  static toObject(includeInstance: boolean, msg: BcBlock): BcBlock.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BcBlock, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BcBlock;
  static deserializeBinaryFromReader(message: BcBlock, reader: jspb.BinaryReader): BcBlock;
}

export namespace BcBlock {
  export type AsObject = {
    hash: string,
    previousHash: string,
    version: number,
    schemaVersion: number,
    height: number,
    miner: string,
    difficulty: string,
    timestamp: number,
    merkleRoot: string,
    chainRoot: string,
    distance: string,
    totalDistance: string,
    nonce: string,
    nrgGrant: number,
    targetHash: string,
    targetHeight: number,
    targetMiner: string,
    targetSignature: string,
    twn: number,
    twsList: Array<string>,
    emblemWeight: number,
    emblemChainBlockHash: string,
    emblemChainFingerprintRoot: string,
    emblemChainAddress: string,
    txCount: number,
    txsList: Array<Transaction.AsObject>,
    txFeeBase: number,
    txDistanceSumLimit: number,
    blockchainHeadersCount: number,
    blockchainHeaders?: BlockchainHeaders.AsObject,
    blockchainFingerprintsRoot: string,
  }
}

export class OutPoint extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  getHash(): string;
  setHash(value: string): void;

  getIndex(): number;
  setIndex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OutPoint.AsObject;
  static toObject(includeInstance: boolean, msg: OutPoint): OutPoint.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OutPoint, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OutPoint;
  static deserializeBinaryFromReader(message: OutPoint, reader: jspb.BinaryReader): OutPoint;
}

export namespace OutPoint {
  export type AsObject = {
    value: Uint8Array | string,
    hash: string,
    index: number,
  }
}

export class WalletOutPoint extends jspb.Message {
  hasOutpoint(): boolean;
  clearOutpoint(): void;
  getOutpoint(): OutPoint | undefined;
  setOutpoint(value?: OutPoint): void;

  getCallbackScript(): Uint8Array | string;
  getCallbackScript_asU8(): Uint8Array;
  getCallbackScript_asB64(): string;
  setCallbackScript(value: Uint8Array | string): void;

  getOriginalScript(): Uint8Array | string;
  getOriginalScript_asU8(): Uint8Array;
  getOriginalScript_asB64(): string;
  setOriginalScript(value: Uint8Array | string): void;

  getBlockHeight(): number;
  setBlockHeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WalletOutPoint.AsObject;
  static toObject(includeInstance: boolean, msg: WalletOutPoint): WalletOutPoint.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WalletOutPoint, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WalletOutPoint;
  static deserializeBinaryFromReader(message: WalletOutPoint, reader: jspb.BinaryReader): WalletOutPoint;
}

export namespace WalletOutPoint {
  export type AsObject = {
    outpoint?: OutPoint.AsObject,
    callbackScript: Uint8Array | string,
    originalScript: Uint8Array | string,
    blockHeight: number,
  }
}

export class WalletData extends jspb.Message {
  getBlockHeight(): number;
  setBlockHeight(value: number): void;

  getBlockHash(): string;
  setBlockHash(value: string): void;

  clearUnconfirmedSpendableOutpointsList(): void;
  getUnconfirmedSpendableOutpointsList(): Array<WalletOutPoint>;
  setUnconfirmedSpendableOutpointsList(value: Array<WalletOutPoint>): void;
  addUnconfirmedSpendableOutpoints(value?: WalletOutPoint, index?: number): WalletOutPoint;

  clearSpendableOutpointsList(): void;
  getSpendableOutpointsList(): Array<WalletOutPoint>;
  setSpendableOutpointsList(value: Array<WalletOutPoint>): void;
  addSpendableOutpoints(value?: WalletOutPoint, index?: number): WalletOutPoint;

  clearCollateralizedMakerOutpointsList(): void;
  getCollateralizedMakerOutpointsList(): Array<WalletOutPoint>;
  setCollateralizedMakerOutpointsList(value: Array<WalletOutPoint>): void;
  addCollateralizedMakerOutpoints(value?: WalletOutPoint, index?: number): WalletOutPoint;

  clearCollateralizedMatchedOutpointsList(): void;
  getCollateralizedMatchedOutpointsList(): Array<WalletOutPoint>;
  setCollateralizedMatchedOutpointsList(value: Array<WalletOutPoint>): void;
  addCollateralizedMatchedOutpoints(value?: WalletOutPoint, index?: number): WalletOutPoint;

  clearCollateralizedSpendableOutpointsList(): void;
  getCollateralizedSpendableOutpointsList(): Array<WalletOutPoint>;
  setCollateralizedSpendableOutpointsList(value: Array<WalletOutPoint>): void;
  addCollateralizedSpendableOutpoints(value?: WalletOutPoint, index?: number): WalletOutPoint;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): WalletData.AsObject;
  static toObject(includeInstance: boolean, msg: WalletData): WalletData.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: WalletData, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): WalletData;
  static deserializeBinaryFromReader(message: WalletData, reader: jspb.BinaryReader): WalletData;
}

export namespace WalletData {
  export type AsObject = {
    blockHeight: number,
    blockHash: string,
    unconfirmedSpendableOutpointsList: Array<WalletOutPoint.AsObject>,
    spendableOutpointsList: Array<WalletOutPoint.AsObject>,
    collateralizedMakerOutpointsList: Array<WalletOutPoint.AsObject>,
    collateralizedMatchedOutpointsList: Array<WalletOutPoint.AsObject>,
    collateralizedSpendableOutpointsList: Array<WalletOutPoint.AsObject>,
  }
}

export class OpenOrder extends jspb.Message {
  hasOutpoint(): boolean;
  clearOutpoint(): void;
  getOutpoint(): OutPoint | undefined;
  setOutpoint(value?: OutPoint): void;

  getOriginalValue(): Uint8Array | string;
  getOriginalValue_asU8(): Uint8Array;
  getOriginalValue_asB64(): string;
  setOriginalValue(value: Uint8Array | string): void;

  getScript(): Uint8Array | string;
  getScript_asU8(): Uint8Array;
  getScript_asB64(): string;
  setScript(value: Uint8Array | string): void;

  getUnit(): Uint8Array | string;
  getUnit_asU8(): Uint8Array;
  getUnit_asB64(): string;
  setUnit(value: Uint8Array | string): void;

  getBlockHeight(): number;
  setBlockHeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OpenOrder.AsObject;
  static toObject(includeInstance: boolean, msg: OpenOrder): OpenOrder.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OpenOrder, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OpenOrder;
  static deserializeBinaryFromReader(message: OpenOrder, reader: jspb.BinaryReader): OpenOrder;
}

export namespace OpenOrder {
  export type AsObject = {
    outpoint?: OutPoint.AsObject,
    originalValue: Uint8Array | string,
    script: Uint8Array | string,
    unit: Uint8Array | string,
    blockHeight: number,
  }
}

export class OpenOrders extends jspb.Message {
  clearOrdersList(): void;
  getOrdersList(): Array<OpenOrder>;
  setOrdersList(value: Array<OpenOrder>): void;
  addOrders(value?: OpenOrder, index?: number): OpenOrder;

  getBlockHeight(): number;
  setBlockHeight(value: number): void;

  getBlockHash(): string;
  setBlockHash(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): OpenOrders.AsObject;
  static toObject(includeInstance: boolean, msg: OpenOrders): OpenOrders.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: OpenOrders, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): OpenOrders;
  static deserializeBinaryFromReader(message: OpenOrders, reader: jspb.BinaryReader): OpenOrders;
}

export namespace OpenOrders {
  export type AsObject = {
    ordersList: Array<OpenOrder.AsObject>,
    blockHeight: number,
    blockHash: string,
  }
}

export class MatchedOrder extends jspb.Message {
  hasTakerOutpoint(): boolean;
  clearTakerOutpoint(): void;
  getTakerOutpoint(): OutPoint | undefined;
  setTakerOutpoint(value?: OutPoint): void;

  getTakerOutputScript(): Uint8Array | string;
  getTakerOutputScript_asU8(): Uint8Array;
  getTakerOutputScript_asB64(): string;
  setTakerOutputScript(value: Uint8Array | string): void;

  getTakerInputScript(): Uint8Array | string;
  getTakerInputScript_asU8(): Uint8Array;
  getTakerInputScript_asB64(): string;
  setTakerInputScript(value: Uint8Array | string): void;

  hasMakerOrder(): boolean;
  clearMakerOrder(): void;
  getMakerOrder(): OpenOrder | undefined;
  setMakerOrder(value?: OpenOrder): void;

  getBlockHeightTaker(): number;
  setBlockHeightTaker(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MatchedOrder.AsObject;
  static toObject(includeInstance: boolean, msg: MatchedOrder): MatchedOrder.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MatchedOrder, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MatchedOrder;
  static deserializeBinaryFromReader(message: MatchedOrder, reader: jspb.BinaryReader): MatchedOrder;
}

export namespace MatchedOrder {
  export type AsObject = {
    takerOutpoint?: OutPoint.AsObject,
    takerOutputScript: Uint8Array | string,
    takerInputScript: Uint8Array | string,
    makerOrder?: OpenOrder.AsObject,
    blockHeightTaker: number,
  }
}

export class MatchedOrders extends jspb.Message {
  clearOrdersList(): void;
  getOrdersList(): Array<MatchedOrder>;
  setOrdersList(value: Array<MatchedOrder>): void;
  addOrders(value?: MatchedOrder, index?: number): MatchedOrder;

  getBlockHeight(): number;
  setBlockHeight(value: number): void;

  getBlockHash(): string;
  setBlockHash(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MatchedOrders.AsObject;
  static toObject(includeInstance: boolean, msg: MatchedOrders): MatchedOrders.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MatchedOrders, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MatchedOrders;
  static deserializeBinaryFromReader(message: MatchedOrders, reader: jspb.BinaryReader): MatchedOrders;
}

export namespace MatchedOrders {
  export type AsObject = {
    ordersList: Array<MatchedOrder.AsObject>,
    blockHeight: number,
    blockHash: string,
  }
}

export class HistoricalOrder extends jspb.Message {
  hasOrder(): boolean;
  clearOrder(): void;
  getOrder(): MatchedOrder | undefined;
  setOrder(value?: MatchedOrder): void;

  getTakerSettled(): boolean;
  setTakerSettled(value: boolean): void;

  getMakerSettled(): boolean;
  setMakerSettled(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HistoricalOrder.AsObject;
  static toObject(includeInstance: boolean, msg: HistoricalOrder): HistoricalOrder.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HistoricalOrder, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HistoricalOrder;
  static deserializeBinaryFromReader(message: HistoricalOrder, reader: jspb.BinaryReader): HistoricalOrder;
}

export namespace HistoricalOrder {
  export type AsObject = {
    order?: MatchedOrder.AsObject,
    takerSettled: boolean,
    makerSettled: boolean,
  }
}

export class HistoricalOrders extends jspb.Message {
  clearOrdersList(): void;
  getOrdersList(): Array<HistoricalOrder>;
  setOrdersList(value: Array<HistoricalOrder>): void;
  addOrders(value?: HistoricalOrder, index?: number): HistoricalOrder;

  getBlockHeight(): number;
  setBlockHeight(value: number): void;

  getBlockHash(): string;
  setBlockHash(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HistoricalOrders.AsObject;
  static toObject(includeInstance: boolean, msg: HistoricalOrders): HistoricalOrders.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HistoricalOrders, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HistoricalOrders;
  static deserializeBinaryFromReader(message: HistoricalOrders, reader: jspb.BinaryReader): HistoricalOrders;
}

export namespace HistoricalOrders {
  export type AsObject = {
    ordersList: Array<HistoricalOrder.AsObject>,
    blockHeight: number,
    blockHash: string,
  }
}

export class Transaction extends jspb.Message {
  getVersion(): number;
  setVersion(value: number): void;

  getNonce(): string;
  setNonce(value: string): void;

  getHash(): string;
  setHash(value: string): void;

  getOverline(): string;
  setOverline(value: string): void;

  getNinCount(): number;
  setNinCount(value: number): void;

  getNoutCount(): number;
  setNoutCount(value: number): void;

  clearInputsList(): void;
  getInputsList(): Array<TransactionInput>;
  setInputsList(value: Array<TransactionInput>): void;
  addInputs(value?: TransactionInput, index?: number): TransactionInput;

  clearOutputsList(): void;
  getOutputsList(): Array<TransactionOutput>;
  setOutputsList(value: Array<TransactionOutput>): void;
  addOutputs(value?: TransactionOutput, index?: number): TransactionOutput;

  getLockTime(): number;
  setLockTime(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Transaction.AsObject;
  static toObject(includeInstance: boolean, msg: Transaction): Transaction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Transaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Transaction;
  static deserializeBinaryFromReader(message: Transaction, reader: jspb.BinaryReader): Transaction;
}

export namespace Transaction {
  export type AsObject = {
    version: number,
    nonce: string,
    hash: string,
    overline: string,
    ninCount: number,
    noutCount: number,
    inputsList: Array<TransactionInput.AsObject>,
    outputsList: Array<TransactionOutput.AsObject>,
    lockTime: number,
  }
}

export class TransactionInput extends jspb.Message {
  hasOutPoint(): boolean;
  clearOutPoint(): void;
  getOutPoint(): OutPoint | undefined;
  setOutPoint(value?: OutPoint): void;

  getScriptLength(): number;
  setScriptLength(value: number): void;

  getInputScript(): Uint8Array | string;
  getInputScript_asU8(): Uint8Array;
  getInputScript_asB64(): string;
  setInputScript(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransactionInput.AsObject;
  static toObject(includeInstance: boolean, msg: TransactionInput): TransactionInput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransactionInput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransactionInput;
  static deserializeBinaryFromReader(message: TransactionInput, reader: jspb.BinaryReader): TransactionInput;
}

export namespace TransactionInput {
  export type AsObject = {
    outPoint?: OutPoint.AsObject,
    scriptLength: number,
    inputScript: Uint8Array | string,
  }
}

export class TransactionOutput extends jspb.Message {
  getValue(): Uint8Array | string;
  getValue_asU8(): Uint8Array;
  getValue_asB64(): string;
  setValue(value: Uint8Array | string): void;

  getUnit(): Uint8Array | string;
  getUnit_asU8(): Uint8Array;
  getUnit_asB64(): string;
  setUnit(value: Uint8Array | string): void;

  getScriptLength(): number;
  setScriptLength(value: number): void;

  getOutputScript(): Uint8Array | string;
  getOutputScript_asU8(): Uint8Array;
  getOutputScript_asB64(): string;
  setOutputScript(value: Uint8Array | string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransactionOutput.AsObject;
  static toObject(includeInstance: boolean, msg: TransactionOutput): TransactionOutput.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransactionOutput, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransactionOutput;
  static deserializeBinaryFromReader(message: TransactionOutput, reader: jspb.BinaryReader): TransactionOutput;
}

export namespace TransactionOutput {
  export type AsObject = {
    value: Uint8Array | string,
    unit: Uint8Array | string,
    scriptLength: number,
    outputScript: Uint8Array | string,
  }
}

export class BlockchainHeader extends jspb.Message {
  getBlockchain(): string;
  setBlockchain(value: string): void;

  getHash(): string;
  setHash(value: string): void;

  getPreviousHash(): string;
  setPreviousHash(value: string): void;

  getTimestamp(): number;
  setTimestamp(value: number): void;

  getHeight(): number;
  setHeight(value: number): void;

  getMerkleRoot(): string;
  setMerkleRoot(value: string): void;

  getBlockchainConfirmationsInParentCount(): number;
  setBlockchainConfirmationsInParentCount(value: number): void;

  clearMarkedTxsList(): void;
  getMarkedTxsList(): Array<MarkedTransaction>;
  setMarkedTxsList(value: Array<MarkedTransaction>): void;
  addMarkedTxs(value?: MarkedTransaction, index?: number): MarkedTransaction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): BlockchainHeader.AsObject;
  static toObject(includeInstance: boolean, msg: BlockchainHeader): BlockchainHeader.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: BlockchainHeader, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): BlockchainHeader;
  static deserializeBinaryFromReader(message: BlockchainHeader, reader: jspb.BinaryReader): BlockchainHeader;
}

export namespace BlockchainHeader {
  export type AsObject = {
    blockchain: string,
    hash: string,
    previousHash: string,
    timestamp: number,
    height: number,
    merkleRoot: string,
    blockchainConfirmationsInParentCount: number,
    markedTxsList: Array<MarkedTransaction.AsObject>,
  }
}

