// package: bc
// file: bc.proto

import * as jspb from "google-protobuf";
import * as core_pb from "./core_pb";

export class HelpResponse extends jspb.Message {
  getHelpText(): string;
  setHelpText(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): HelpResponse.AsObject;
  static toObject(includeInstance: boolean, msg: HelpResponse): HelpResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: HelpResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): HelpResponse;
  static deserializeBinaryFromReader(message: HelpResponse, reader: jspb.BinaryReader): HelpResponse;
}

export namespace HelpResponse {
  export type AsObject = {
    helpText: string,
  }
}

export class StatsResponse extends jspb.Message {
  getCalls(): number;
  setCalls(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): StatsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: StatsResponse): StatsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: StatsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): StatsResponse;
  static deserializeBinaryFromReader(message: StatsResponse, reader: jspb.BinaryReader): StatsResponse;
}

export namespace StatsResponse {
  export type AsObject = {
    calls: number,
  }
}

export class RpcTransaction extends jspb.Message {
  getFromAddr(): string;
  setFromAddr(value: string): void;

  getToAddr(): string;
  setToAddr(value: string): void;

  getAmount(): string;
  setAmount(value: string): void;

  getTxFee(): string;
  setTxFee(value: string): void;

  getPrivateKeyHex(): string;
  setPrivateKeyHex(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RpcTransaction.AsObject;
  static toObject(includeInstance: boolean, msg: RpcTransaction): RpcTransaction.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RpcTransaction, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RpcTransaction;
  static deserializeBinaryFromReader(message: RpcTransaction, reader: jspb.BinaryReader): RpcTransaction;
}

export namespace RpcTransaction {
  export type AsObject = {
    fromAddr: string,
    toAddr: string,
    amount: string,
    txFee: string,
    privateKeyHex: string,
  }
}

export class RpcTransactionResponse extends jspb.Message {
  getStatus(): RpcTransactionResponseStatusMap[keyof RpcTransactionResponseStatusMap];
  setStatus(value: RpcTransactionResponseStatusMap[keyof RpcTransactionResponseStatusMap]): void;

  getTxHash(): string;
  setTxHash(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RpcTransactionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RpcTransactionResponse): RpcTransactionResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: RpcTransactionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RpcTransactionResponse;
  static deserializeBinaryFromReader(message: RpcTransactionResponse, reader: jspb.BinaryReader): RpcTransactionResponse;
}

export namespace RpcTransactionResponse {
  export type AsObject = {
    status: RpcTransactionResponseStatusMap[keyof RpcTransactionResponseStatusMap],
    txHash: string,
    error: string,
  }
}

export class GetSpendableCollateralRequest extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSpendableCollateralRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetSpendableCollateralRequest): GetSpendableCollateralRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetSpendableCollateralRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSpendableCollateralRequest;
  static deserializeBinaryFromReader(message: GetSpendableCollateralRequest, reader: jspb.BinaryReader): GetSpendableCollateralRequest;
}

export namespace GetSpendableCollateralRequest {
  export type AsObject = {
    address: string,
  }
}

export class GetSpendableCollateralResponse extends jspb.Message {
  clearOutpointsList(): void;
  getOutpointsList(): Array<core_pb.OutPoint>;
  setOutpointsList(value: Array<core_pb.OutPoint>): void;
  addOutpoints(value?: core_pb.OutPoint, index?: number): core_pb.OutPoint;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetSpendableCollateralResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetSpendableCollateralResponse): GetSpendableCollateralResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetSpendableCollateralResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetSpendableCollateralResponse;
  static deserializeBinaryFromReader(message: GetSpendableCollateralResponse, reader: jspb.BinaryReader): GetSpendableCollateralResponse;
}

export namespace GetSpendableCollateralResponse {
  export type AsObject = {
    outpointsList: Array<core_pb.OutPoint.AsObject>,
  }
}

export class GetBalanceRequest extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBalanceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetBalanceRequest): GetBalanceRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetBalanceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBalanceRequest;
  static deserializeBinaryFromReader(message: GetBalanceRequest, reader: jspb.BinaryReader): GetBalanceRequest;
}

export namespace GetBalanceRequest {
  export type AsObject = {
    address: string,
  }
}

export class GetBalanceResponse extends jspb.Message {
  getConfirmed(): string;
  setConfirmed(value: string): void;

  getUnconfirmed(): string;
  setUnconfirmed(value: string): void;

  getCollateralized(): string;
  setCollateralized(value: string): void;

  getCollateralizedspendable(): string;
  setCollateralizedspendable(value: string): void;

  getUnit(): string;
  setUnit(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBalanceResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetBalanceResponse): GetBalanceResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetBalanceResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBalanceResponse;
  static deserializeBinaryFromReader(message: GetBalanceResponse, reader: jspb.BinaryReader): GetBalanceResponse;
}

export namespace GetBalanceResponse {
  export type AsObject = {
    confirmed: string,
    unconfirmed: string,
    collateralized: string,
    collateralizedspendable: string,
    unit: string,
  }
}

export class UnlockCollateralRequest extends jspb.Message {
  getTxHash(): string;
  setTxHash(value: string): void;

  getTxOutputIndex(): number;
  setTxOutputIndex(value: number): void;

  getBcAddress(): string;
  setBcAddress(value: string): void;

  getBcPrivateKeyHex(): string;
  setBcPrivateKeyHex(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnlockCollateralRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UnlockCollateralRequest): UnlockCollateralRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: UnlockCollateralRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnlockCollateralRequest;
  static deserializeBinaryFromReader(message: UnlockCollateralRequest, reader: jspb.BinaryReader): UnlockCollateralRequest;
}

export namespace UnlockCollateralRequest {
  export type AsObject = {
    txHash: string,
    txOutputIndex: number,
    bcAddress: string,
    bcPrivateKeyHex: string,
  }
}

export class GetUnlockTakerTxOutputScriptsRequest extends jspb.Message {
  getTxHash(): string;
  setTxHash(value: string): void;

  getTxOutputIndex(): number;
  setTxOutputIndex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUnlockTakerTxOutputScriptsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetUnlockTakerTxOutputScriptsRequest): GetUnlockTakerTxOutputScriptsRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetUnlockTakerTxOutputScriptsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUnlockTakerTxOutputScriptsRequest;
  static deserializeBinaryFromReader(message: GetUnlockTakerTxOutputScriptsRequest, reader: jspb.BinaryReader): GetUnlockTakerTxOutputScriptsRequest;
}

export namespace GetUnlockTakerTxOutputScriptsRequest {
  export type AsObject = {
    txHash: string,
    txOutputIndex: number,
  }
}

export class GetUnlockTakerTxOutputScriptsResponse extends jspb.Message {
  clearUnlockScriptsList(): void;
  getUnlockScriptsList(): Array<string>;
  setUnlockScriptsList(value: Array<string>): void;
  addUnlockScripts(value: string, index?: number): string;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUnlockTakerTxOutputScriptsResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetUnlockTakerTxOutputScriptsResponse): GetUnlockTakerTxOutputScriptsResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetUnlockTakerTxOutputScriptsResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUnlockTakerTxOutputScriptsResponse;
  static deserializeBinaryFromReader(message: GetUnlockTakerTxOutputScriptsResponse, reader: jspb.BinaryReader): GetUnlockTakerTxOutputScriptsResponse;
}

export namespace GetUnlockTakerTxOutputScriptsResponse {
  export type AsObject = {
    unlockScriptsList: Array<string>,
  }
}

export class MakerOrderInfo extends jspb.Message {
  getTradeHeight(): number;
  setTradeHeight(value: number): void;

  getDeposit(): number;
  setDeposit(value: number): void;

  getSettlement(): number;
  setSettlement(value: number): void;

  getShiftMaker(): number;
  setShiftMaker(value: number): void;

  getShiftTaker(): number;
  setShiftTaker(value: number): void;

  getSendsFromChain(): string;
  setSendsFromChain(value: string): void;

  getReceivesToChain(): string;
  setReceivesToChain(value: string): void;

  getSendsFromAddress(): string;
  setSendsFromAddress(value: string): void;

  getReceivesToAddress(): string;
  setReceivesToAddress(value: string): void;

  getSendsUnit(): string;
  setSendsUnit(value: string): void;

  getReceivesUnit(): string;
  setReceivesUnit(value: string): void;

  getDoubleHashedBcAddress(): string;
  setDoubleHashedBcAddress(value: string): void;

  getCollateralizedNrg(): string;
  setCollateralizedNrg(value: string): void;

  getNrgUnit(): string;
  setNrgUnit(value: string): void;

  getTxHash(): string;
  setTxHash(value: string): void;

  getTxOutputIndex(): number;
  setTxOutputIndex(value: number): void;

  getIsSettled(): boolean;
  setIsSettled(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MakerOrderInfo.AsObject;
  static toObject(includeInstance: boolean, msg: MakerOrderInfo): MakerOrderInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MakerOrderInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MakerOrderInfo;
  static deserializeBinaryFromReader(message: MakerOrderInfo, reader: jspb.BinaryReader): MakerOrderInfo;
}

export namespace MakerOrderInfo {
  export type AsObject = {
    tradeHeight: number,
    deposit: number,
    settlement: number,
    shiftMaker: number,
    shiftTaker: number,
    sendsFromChain: string,
    receivesToChain: string,
    sendsFromAddress: string,
    receivesToAddress: string,
    sendsUnit: string,
    receivesUnit: string,
    doubleHashedBcAddress: string,
    collateralizedNrg: string,
    nrgUnit: string,
    txHash: string,
    txOutputIndex: number,
    isSettled: boolean,
  }
}

export class TakerOrderInfo extends jspb.Message {
  getSendsFromAddress(): string;
  setSendsFromAddress(value: string): void;

  getReceivesToAddress(): string;
  setReceivesToAddress(value: string): void;

  getDoubleHashedBcAddress(): string;
  setDoubleHashedBcAddress(value: string): void;

  getIsSettled(): boolean;
  setIsSettled(value: boolean): void;

  getTxHash(): string;
  setTxHash(value: string): void;

  getTxOutputIndex(): number;
  setTxOutputIndex(value: number): void;

  getTotalCollateral(): string;
  setTotalCollateral(value: string): void;

  getTradeHeight(): number;
  setTradeHeight(value: number): void;

  getTimestamp(): number;
  setTimestamp(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TakerOrderInfo.AsObject;
  static toObject(includeInstance: boolean, msg: TakerOrderInfo): TakerOrderInfo.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TakerOrderInfo, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TakerOrderInfo;
  static deserializeBinaryFromReader(message: TakerOrderInfo, reader: jspb.BinaryReader): TakerOrderInfo;
}

export namespace TakerOrderInfo {
  export type AsObject = {
    sendsFromAddress: string,
    receivesToAddress: string,
    doubleHashedBcAddress: string,
    isSettled: boolean,
    txHash: string,
    txOutputIndex: number,
    totalCollateral: string,
    tradeHeight: number,
    timestamp: number,
  }
}

export class MatchedTx extends jspb.Message {
  getHash(): string;
  setHash(value: string): void;

  getOutputIndex(): number;
  setOutputIndex(value: number): void;

  getChain(): string;
  setChain(value: string): void;

  getSendsFrom(): string;
  setSendsFrom(value: string): void;

  getReceivesTo(): string;
  setReceivesTo(value: string): void;

  getAmount(): string;
  setAmount(value: string): void;

  getIsMaker(): boolean;
  setIsMaker(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MatchedTx.AsObject;
  static toObject(includeInstance: boolean, msg: MatchedTx): MatchedTx.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MatchedTx, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MatchedTx;
  static deserializeBinaryFromReader(message: MatchedTx, reader: jspb.BinaryReader): MatchedTx;
}

export namespace MatchedTx {
  export type AsObject = {
    hash: string,
    outputIndex: number,
    chain: string,
    sendsFrom: string,
    receivesTo: string,
    amount: string,
    isMaker: boolean,
  }
}

export class MatchedTxs extends jspb.Message {
  clearTxsList(): void;
  getTxsList(): Array<MatchedTx>;
  setTxsList(value: Array<MatchedTx>): void;
  addTxs(value?: MatchedTx, index?: number): MatchedTx;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MatchedTxs.AsObject;
  static toObject(includeInstance: boolean, msg: MatchedTxs): MatchedTxs.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MatchedTxs, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MatchedTxs;
  static deserializeBinaryFromReader(message: MatchedTxs, reader: jspb.BinaryReader): MatchedTxs;
}

export namespace MatchedTxs {
  export type AsObject = {
    txsList: Array<MatchedTx.AsObject>,
  }
}

export class MatchedOpenOrder extends jspb.Message {
  hasMaker(): boolean;
  clearMaker(): void;
  getMaker(): MakerOrderInfo | undefined;
  setMaker(value?: MakerOrderInfo): void;

  hasTaker(): boolean;
  clearTaker(): void;
  getTaker(): TakerOrderInfo | undefined;
  setTaker(value?: TakerOrderInfo): void;

  getUnlocked(): boolean;
  setUnlocked(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MatchedOpenOrder.AsObject;
  static toObject(includeInstance: boolean, msg: MatchedOpenOrder): MatchedOpenOrder.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: MatchedOpenOrder, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MatchedOpenOrder;
  static deserializeBinaryFromReader(message: MatchedOpenOrder, reader: jspb.BinaryReader): MatchedOpenOrder;
}

export namespace MatchedOpenOrder {
  export type AsObject = {
    maker?: MakerOrderInfo.AsObject,
    taker?: TakerOrderInfo.AsObject,
    unlocked: boolean,
  }
}

export class GetOpenOrdersResponse extends jspb.Message {
  clearOrdersList(): void;
  getOrdersList(): Array<MakerOrderInfo>;
  setOrdersList(value: Array<MakerOrderInfo>): void;
  addOrders(value?: MakerOrderInfo, index?: number): MakerOrderInfo;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetOpenOrdersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetOpenOrdersResponse): GetOpenOrdersResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetOpenOrdersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetOpenOrdersResponse;
  static deserializeBinaryFromReader(message: GetOpenOrdersResponse, reader: jspb.BinaryReader): GetOpenOrdersResponse;
}

export namespace GetOpenOrdersResponse {
  export type AsObject = {
    ordersList: Array<MakerOrderInfo.AsObject>,
  }
}

export class GetMatchedOrdersRequest extends jspb.Message {
  getOnlySettled(): boolean;
  setOnlySettled(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMatchedOrdersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetMatchedOrdersRequest): GetMatchedOrdersRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetMatchedOrdersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMatchedOrdersRequest;
  static deserializeBinaryFromReader(message: GetMatchedOrdersRequest, reader: jspb.BinaryReader): GetMatchedOrdersRequest;
}

export namespace GetMatchedOrdersRequest {
  export type AsObject = {
    onlySettled: boolean,
  }
}

export class GetMatchedOrdersResponse extends jspb.Message {
  clearOrdersList(): void;
  getOrdersList(): Array<MatchedOpenOrder>;
  setOrdersList(value: Array<MatchedOpenOrder>): void;
  addOrders(value?: MatchedOpenOrder, index?: number): MatchedOpenOrder;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMatchedOrdersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetMatchedOrdersResponse): GetMatchedOrdersResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetMatchedOrdersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMatchedOrdersResponse;
  static deserializeBinaryFromReader(message: GetMatchedOrdersResponse, reader: jspb.BinaryReader): GetMatchedOrdersResponse;
}

export namespace GetMatchedOrdersResponse {
  export type AsObject = {
    ordersList: Array<MatchedOpenOrder.AsObject>,
  }
}

export class PlaceMakerOrderRequest extends jspb.Message {
  getShiftMaker(): number;
  setShiftMaker(value: number): void;

  getShiftTaker(): number;
  setShiftTaker(value: number): void;

  getDepositLength(): number;
  setDepositLength(value: number): void;

  getSettlementLength(): number;
  setSettlementLength(value: number): void;

  getSendsFromChain(): string;
  setSendsFromChain(value: string): void;

  getReceivesToChain(): string;
  setReceivesToChain(value: string): void;

  getSendsFromAddress(): string;
  setSendsFromAddress(value: string): void;

  getReceivesToAddress(): string;
  setReceivesToAddress(value: string): void;

  getSendsUnit(): string;
  setSendsUnit(value: string): void;

  getReceivesUnit(): string;
  setReceivesUnit(value: string): void;

  getBcAddress(): string;
  setBcAddress(value: string): void;

  getBcPrivateKeyHex(): string;
  setBcPrivateKeyHex(value: string): void;

  getCollateralizedNrg(): string;
  setCollateralizedNrg(value: string): void;

  getNrgUnit(): string;
  setNrgUnit(value: string): void;

  getTxFee(): string;
  setTxFee(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlaceMakerOrderRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PlaceMakerOrderRequest): PlaceMakerOrderRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlaceMakerOrderRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlaceMakerOrderRequest;
  static deserializeBinaryFromReader(message: PlaceMakerOrderRequest, reader: jspb.BinaryReader): PlaceMakerOrderRequest;
}

export namespace PlaceMakerOrderRequest {
  export type AsObject = {
    shiftMaker: number,
    shiftTaker: number,
    depositLength: number,
    settlementLength: number,
    sendsFromChain: string,
    receivesToChain: string,
    sendsFromAddress: string,
    receivesToAddress: string,
    sendsUnit: string,
    receivesUnit: string,
    bcAddress: string,
    bcPrivateKeyHex: string,
    collateralizedNrg: string,
    nrgUnit: string,
    txFee: string,
  }
}

export class PlaceTakerOrderRequest extends jspb.Message {
  getSendsFromAddress(): string;
  setSendsFromAddress(value: string): void;

  getReceivesToAddress(): string;
  setReceivesToAddress(value: string): void;

  getMakerTxHash(): string;
  setMakerTxHash(value: string): void;

  getMakerTxOutputIndex(): number;
  setMakerTxOutputIndex(value: number): void;

  getBcAddress(): string;
  setBcAddress(value: string): void;

  getBcPrivateKeyHex(): string;
  setBcPrivateKeyHex(value: string): void;

  getCollateralizedNrg(): string;
  setCollateralizedNrg(value: string): void;

  getTxFee(): string;
  setTxFee(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlaceTakerOrderRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PlaceTakerOrderRequest): PlaceTakerOrderRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlaceTakerOrderRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlaceTakerOrderRequest;
  static deserializeBinaryFromReader(message: PlaceTakerOrderRequest, reader: jspb.BinaryReader): PlaceTakerOrderRequest;
}

export namespace PlaceTakerOrderRequest {
  export type AsObject = {
    sendsFromAddress: string,
    receivesToAddress: string,
    makerTxHash: string,
    makerTxOutputIndex: number,
    bcAddress: string,
    bcPrivateKeyHex: string,
    collateralizedNrg: string,
    txFee: string,
  }
}

export class TakerOrder extends jspb.Message {
  getSendsFromAddress(): string;
  setSendsFromAddress(value: string): void;

  getReceivesToAddress(): string;
  setReceivesToAddress(value: string): void;

  getMakerTxHash(): string;
  setMakerTxHash(value: string): void;

  getMakerTxOutputIndex(): number;
  setMakerTxOutputIndex(value: number): void;

  getCollateralizedNrg(): string;
  setCollateralizedNrg(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TakerOrder.AsObject;
  static toObject(includeInstance: boolean, msg: TakerOrder): TakerOrder.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TakerOrder, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TakerOrder;
  static deserializeBinaryFromReader(message: TakerOrder, reader: jspb.BinaryReader): TakerOrder;
}

export namespace TakerOrder {
  export type AsObject = {
    sendsFromAddress: string,
    receivesToAddress: string,
    makerTxHash: string,
    makerTxOutputIndex: number,
    collateralizedNrg: string,
  }
}

export class PlaceTakerOrdersRequest extends jspb.Message {
  clearOrdersList(): void;
  getOrdersList(): Array<TakerOrder>;
  setOrdersList(value: Array<TakerOrder>): void;
  addOrders(value?: TakerOrder, index?: number): TakerOrder;

  getBcAddress(): string;
  setBcAddress(value: string): void;

  getBcPrivateKeyHex(): string;
  setBcPrivateKeyHex(value: string): void;

  getTxFee(): string;
  setTxFee(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): PlaceTakerOrdersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: PlaceTakerOrdersRequest): PlaceTakerOrdersRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: PlaceTakerOrdersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): PlaceTakerOrdersRequest;
  static deserializeBinaryFromReader(message: PlaceTakerOrdersRequest, reader: jspb.BinaryReader): PlaceTakerOrdersRequest;
}

export namespace PlaceTakerOrdersRequest {
  export type AsObject = {
    ordersList: Array<TakerOrder.AsObject>,
    bcAddress: string,
    bcPrivateKeyHex: string,
    txFee: string,
  }
}

export class CalculateMakerFeeRequest extends jspb.Message {
  getShiftStartsAt(): number;
  setShiftStartsAt(value: number): void;

  getDepositEndsAt(): number;
  setDepositEndsAt(value: number): void;

  getSettleEndsAt(): number;
  setSettleEndsAt(value: number): void;

  getPaysWithChainId(): string;
  setPaysWithChainId(value: string): void;

  getPaysUnit(): string;
  setPaysUnit(value: string): void;

  getWantsChainId(): string;
  setWantsChainId(value: string): void;

  getWantsUnit(): string;
  setWantsUnit(value: string): void;

  getCollateralizedNrg(): string;
  setCollateralizedNrg(value: string): void;

  getNrgUnit(): string;
  setNrgUnit(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CalculateMakerFeeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CalculateMakerFeeRequest): CalculateMakerFeeRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CalculateMakerFeeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CalculateMakerFeeRequest;
  static deserializeBinaryFromReader(message: CalculateMakerFeeRequest, reader: jspb.BinaryReader): CalculateMakerFeeRequest;
}

export namespace CalculateMakerFeeRequest {
  export type AsObject = {
    shiftStartsAt: number,
    depositEndsAt: number,
    settleEndsAt: number,
    paysWithChainId: string,
    paysUnit: string,
    wantsChainId: string,
    wantsUnit: string,
    collateralizedNrg: string,
    nrgUnit: string,
  }
}

export class CalculateTakerFeeRequest extends jspb.Message {
  getMakerTxHash(): string;
  setMakerTxHash(value: string): void;

  getMakerTxOutputIndex(): number;
  setMakerTxOutputIndex(value: number): void;

  getCollateralizedNrg(): string;
  setCollateralizedNrg(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CalculateTakerFeeRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CalculateTakerFeeRequest): CalculateTakerFeeRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: CalculateTakerFeeRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CalculateTakerFeeRequest;
  static deserializeBinaryFromReader(message: CalculateTakerFeeRequest, reader: jspb.BinaryReader): CalculateTakerFeeRequest;
}

export namespace CalculateTakerFeeRequest {
  export type AsObject = {
    makerTxHash: string,
    makerTxOutputIndex: number,
    collateralizedNrg: string,
  }
}

export class FeeResponse extends jspb.Message {
  getFee(): string;
  setFee(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FeeResponse.AsObject;
  static toObject(includeInstance: boolean, msg: FeeResponse): FeeResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: FeeResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FeeResponse;
  static deserializeBinaryFromReader(message: FeeResponse, reader: jspb.BinaryReader): FeeResponse;
}

export namespace FeeResponse {
  export type AsObject = {
    fee: string,
  }
}

export class GetBlake2blRequest extends jspb.Message {
  getToBeHashed(): string;
  setToBeHashed(value: string): void;

  getTimes(): number;
  setTimes(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBlake2blRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetBlake2blRequest): GetBlake2blRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetBlake2blRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBlake2blRequest;
  static deserializeBinaryFromReader(message: GetBlake2blRequest, reader: jspb.BinaryReader): GetBlake2blRequest;
}

export namespace GetBlake2blRequest {
  export type AsObject = {
    toBeHashed: string,
    times: number,
  }
}

export class GetBlake2blResponse extends jspb.Message {
  getHash(): string;
  setHash(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBlake2blResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetBlake2blResponse): GetBlake2blResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetBlake2blResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBlake2blResponse;
  static deserializeBinaryFromReader(message: GetBlake2blResponse, reader: jspb.BinaryReader): GetBlake2blResponse;
}

export namespace GetBlake2blResponse {
  export type AsObject = {
    hash: string,
  }
}

export class VanityConvertRequest extends jspb.Message {
  getVanity(): string;
  setVanity(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VanityConvertRequest.AsObject;
  static toObject(includeInstance: boolean, msg: VanityConvertRequest): VanityConvertRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VanityConvertRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VanityConvertRequest;
  static deserializeBinaryFromReader(message: VanityConvertRequest, reader: jspb.BinaryReader): VanityConvertRequest;
}

export namespace VanityConvertRequest {
  export type AsObject = {
    vanity: string,
  }
}

export class VanityConvertResponse extends jspb.Message {
  getBcAddress(): string;
  setBcAddress(value: string): void;

  getError(): string;
  setError(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): VanityConvertResponse.AsObject;
  static toObject(includeInstance: boolean, msg: VanityConvertResponse): VanityConvertResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: VanityConvertResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): VanityConvertResponse;
  static deserializeBinaryFromReader(message: VanityConvertResponse, reader: jspb.BinaryReader): VanityConvertResponse;
}

export namespace VanityConvertResponse {
  export type AsObject = {
    bcAddress: string,
    error: string,
  }
}

export class GetRoveredBlockHashRequest extends jspb.Message {
  getBlockchain(): string;
  setBlockchain(value: string): void;

  getHash(): string;
  setHash(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRoveredBlockHashRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetRoveredBlockHashRequest): GetRoveredBlockHashRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetRoveredBlockHashRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRoveredBlockHashRequest;
  static deserializeBinaryFromReader(message: GetRoveredBlockHashRequest, reader: jspb.BinaryReader): GetRoveredBlockHashRequest;
}

export namespace GetRoveredBlockHashRequest {
  export type AsObject = {
    blockchain: string,
    hash: string,
  }
}

export class GetRoveredBlockHeightRequest extends jspb.Message {
  getBlockchain(): string;
  setBlockchain(value: string): void;

  getHeight(): number;
  setHeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRoveredBlockHeightRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetRoveredBlockHeightRequest): GetRoveredBlockHeightRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetRoveredBlockHeightRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRoveredBlockHeightRequest;
  static deserializeBinaryFromReader(message: GetRoveredBlockHeightRequest, reader: jspb.BinaryReader): GetRoveredBlockHeightRequest;
}

export namespace GetRoveredBlockHeightRequest {
  export type AsObject = {
    blockchain: string,
    height: number,
  }
}

export class GetBlockHashRequest extends jspb.Message {
  getHash(): string;
  setHash(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBlockHashRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetBlockHashRequest): GetBlockHashRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetBlockHashRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBlockHashRequest;
  static deserializeBinaryFromReader(message: GetBlockHashRequest, reader: jspb.BinaryReader): GetBlockHashRequest;
}

export namespace GetBlockHashRequest {
  export type AsObject = {
    hash: string,
  }
}

export class GetBlockHeightRequest extends jspb.Message {
  getHeight(): number;
  setHeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBlockHeightRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetBlockHeightRequest): GetBlockHeightRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetBlockHeightRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBlockHeightRequest;
  static deserializeBinaryFromReader(message: GetBlockHeightRequest, reader: jspb.BinaryReader): GetBlockHeightRequest;
}

export namespace GetBlockHeightRequest {
  export type AsObject = {
    height: number,
  }
}

export class GetBlocksRequest extends jspb.Message {
  getStartHeight(): number;
  setStartHeight(value: number): void;

  getEndHeight(): number;
  setEndHeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBlocksRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetBlocksRequest): GetBlocksRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetBlocksRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBlocksRequest;
  static deserializeBinaryFromReader(message: GetBlocksRequest, reader: jspb.BinaryReader): GetBlocksRequest;
}

export namespace GetBlocksRequest {
  export type AsObject = {
    startHeight: number,
    endHeight: number,
  }
}

export class GetBlocksResponse extends jspb.Message {
  clearBlocksList(): void;
  getBlocksList(): Array<core_pb.BcBlock>;
  setBlocksList(value: Array<core_pb.BcBlock>): void;
  addBlocks(value?: core_pb.BcBlock, index?: number): core_pb.BcBlock;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetBlocksResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetBlocksResponse): GetBlocksResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetBlocksResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetBlocksResponse;
  static deserializeBinaryFromReader(message: GetBlocksResponse, reader: jspb.BinaryReader): GetBlocksResponse;
}

export namespace GetBlocksResponse {
  export type AsObject = {
    blocksList: Array<core_pb.BcBlock.AsObject>,
  }
}

export class Transfer extends jspb.Message {
  getFrom(): string;
  setFrom(value: string): void;

  getTo(): string;
  setTo(value: string): void;

  getAmount(): string;
  setAmount(value: string): void;

  getTxHash(): string;
  setTxHash(value: string): void;

  getTxOutputIndex(): number;
  setTxOutputIndex(value: number): void;

  getTimestamp(): number;
  setTimestamp(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Transfer.AsObject;
  static toObject(includeInstance: boolean, msg: Transfer): Transfer.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: Transfer, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Transfer;
  static deserializeBinaryFromReader(message: Transfer, reader: jspb.BinaryReader): Transfer;
}

export namespace Transfer {
  export type AsObject = {
    from: string,
    to: string,
    amount: string,
    txHash: string,
    txOutputIndex: number,
    timestamp: number,
  }
}

export class TransferResponse extends jspb.Message {
  clearTransfersList(): void;
  getTransfersList(): Array<Transfer>;
  setTransfersList(value: Array<Transfer>): void;
  addTransfers(value?: Transfer, index?: number): Transfer;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferResponse.AsObject;
  static toObject(includeInstance: boolean, msg: TransferResponse): TransferResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferResponse;
  static deserializeBinaryFromReader(message: TransferResponse, reader: jspb.BinaryReader): TransferResponse;
}

export namespace TransferResponse {
  export type AsObject = {
    transfersList: Array<Transfer.AsObject>,
  }
}

export class TransferRequest extends jspb.Message {
  getAddress(): string;
  setAddress(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TransferRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TransferRequest): TransferRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: TransferRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TransferRequest;
  static deserializeBinaryFromReader(message: TransferRequest, reader: jspb.BinaryReader): TransferRequest;
}

export namespace TransferRequest {
  export type AsObject = {
    address: string,
  }
}

export class GetRoveredBlocksRequest extends jspb.Message {
  getBlockchain(): string;
  setBlockchain(value: string): void;

  getStartHeight(): number;
  setStartHeight(value: number): void;

  getEndHeight(): number;
  setEndHeight(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRoveredBlocksRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetRoveredBlocksRequest): GetRoveredBlocksRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetRoveredBlocksRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRoveredBlocksRequest;
  static deserializeBinaryFromReader(message: GetRoveredBlocksRequest, reader: jspb.BinaryReader): GetRoveredBlocksRequest;
}

export namespace GetRoveredBlocksRequest {
  export type AsObject = {
    blockchain: string,
    startHeight: number,
    endHeight: number,
  }
}

export class GetRawMempoolResponse extends jspb.Message {
  clearTransactionsList(): void;
  getTransactionsList(): Array<core_pb.Transaction>;
  setTransactionsList(value: Array<core_pb.Transaction>): void;
  addTransactions(value?: core_pb.Transaction, index?: number): core_pb.Transaction;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRawMempoolResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetRawMempoolResponse): GetRawMempoolResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetRawMempoolResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRawMempoolResponse;
  static deserializeBinaryFromReader(message: GetRawMempoolResponse, reader: jspb.BinaryReader): GetRawMempoolResponse;
}

export namespace GetRawMempoolResponse {
  export type AsObject = {
    transactionsList: Array<core_pb.Transaction.AsObject>,
  }
}

export class GetRoveredBlocksResponse extends jspb.Message {
  clearBlocksList(): void;
  getBlocksList(): Array<core_pb.Block>;
  setBlocksList(value: Array<core_pb.Block>): void;
  addBlocks(value?: core_pb.Block, index?: number): core_pb.Block;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetRoveredBlocksResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetRoveredBlocksResponse): GetRoveredBlocksResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetRoveredBlocksResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetRoveredBlocksResponse;
  static deserializeBinaryFromReader(message: GetRoveredBlocksResponse, reader: jspb.BinaryReader): GetRoveredBlocksResponse;
}

export namespace GetRoveredBlocksResponse {
  export type AsObject = {
    blocksList: Array<core_pb.Block.AsObject>,
  }
}

export class GetTxRequest extends jspb.Message {
  getHash(): string;
  setHash(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTxRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetTxRequest): GetTxRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetTxRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTxRequest;
  static deserializeBinaryFromReader(message: GetTxRequest, reader: jspb.BinaryReader): GetTxRequest;
}

export namespace GetTxRequest {
  export type AsObject = {
    hash: string,
  }
}

export class GetMarkedTxRequest extends jspb.Message {
  getBlockchain(): string;
  setBlockchain(value: string): void;

  getHash(): string;
  setHash(value: string): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetMarkedTxRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetMarkedTxRequest): GetMarkedTxRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetMarkedTxRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetMarkedTxRequest;
  static deserializeBinaryFromReader(message: GetMarkedTxRequest, reader: jspb.BinaryReader): GetMarkedTxRequest;
}

export namespace GetMarkedTxRequest {
  export type AsObject = {
    blockchain: string,
    hash: string,
  }
}

export class GetOutPointRequest extends jspb.Message {
  getHash(): string;
  setHash(value: string): void;

  getIndex(): number;
  setIndex(value: number): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetOutPointRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetOutPointRequest): GetOutPointRequest.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetOutPointRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetOutPointRequest;
  static deserializeBinaryFromReader(message: GetOutPointRequest, reader: jspb.BinaryReader): GetOutPointRequest;
}

export namespace GetOutPointRequest {
  export type AsObject = {
    hash: string,
    index: number,
  }
}

export class GetTradeStatusResponse extends jspb.Message {
  getSent(): boolean;
  setSent(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetTradeStatusResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetTradeStatusResponse): GetTradeStatusResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetTradeStatusResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetTradeStatusResponse;
  static deserializeBinaryFromReader(message: GetTradeStatusResponse, reader: jspb.BinaryReader): GetTradeStatusResponse;
}

export namespace GetTradeStatusResponse {
  export type AsObject = {
    sent: boolean,
  }
}

export class GetOutPointStatusResponse extends jspb.Message {
  getUnspent(): boolean;
  setUnspent(value: boolean): void;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetOutPointStatusResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetOutPointStatusResponse): GetOutPointStatusResponse.AsObject;
  static extensions: {[key: number]: jspb.ExtensionFieldInfo<jspb.Message>};
  static extensionsBinary: {[key: number]: jspb.ExtensionFieldBinaryInfo<jspb.Message>};
  static serializeBinaryToWriter(message: GetOutPointStatusResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetOutPointStatusResponse;
  static deserializeBinaryFromReader(message: GetOutPointStatusResponse, reader: jspb.BinaryReader): GetOutPointStatusResponse;
}

export namespace GetOutPointStatusResponse {
  export type AsObject = {
    unspent: boolean,
  }
}

export interface RpcTransactionResponseStatusMap {
  SUCCESS: 0;
  FAILURE: 1;
}

export const RpcTransactionResponseStatus: RpcTransactionResponseStatusMap;

