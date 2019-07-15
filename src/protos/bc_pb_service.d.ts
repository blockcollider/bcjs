// package: bc
// file: bc.proto

import * as bc_pb from "./bc_pb";
import * as core_pb from "./core_pb";
import {grpc} from "@improbable-eng/grpc-web";

type BcGetRoveredBlockHash = {
  readonly methodName: string;
  readonly service: typeof Bc;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof bc_pb.GetRoveredBlockHashRequest;
  readonly responseType: typeof core_pb.Block;
};

type BcGetRoveredBlockHeight = {
  readonly methodName: string;
  readonly service: typeof Bc;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof bc_pb.GetRoveredBlockHeightRequest;
  readonly responseType: typeof core_pb.Block;
};

type BcGetRoveredBlocks = {
  readonly methodName: string;
  readonly service: typeof Bc;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof bc_pb.GetRoveredBlocksRequest;
  readonly responseType: typeof bc_pb.GetRoveredBlocksResponse;
};

type BcGetLatestRoveredBlocks = {
  readonly methodName: string;
  readonly service: typeof Bc;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof core_pb.Null;
  readonly responseType: typeof bc_pb.GetRoveredBlocksResponse;
};

type BcGetBlockHash = {
  readonly methodName: string;
  readonly service: typeof Bc;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof bc_pb.GetBlockHashRequest;
  readonly responseType: typeof core_pb.BcBlock;
};

type BcGetBlockHeight = {
  readonly methodName: string;
  readonly service: typeof Bc;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof bc_pb.GetBlockHeightRequest;
  readonly responseType: typeof core_pb.BcBlock;
};

type BcGetBlocks = {
  readonly methodName: string;
  readonly service: typeof Bc;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof bc_pb.GetBlocksRequest;
  readonly responseType: typeof bc_pb.GetBlocksResponse;
};

type BcGetLatestBlock = {
  readonly methodName: string;
  readonly service: typeof Bc;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof core_pb.Null;
  readonly responseType: typeof core_pb.BcBlock;
};

type BcGetTx = {
  readonly methodName: string;
  readonly service: typeof Bc;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof bc_pb.GetTxRequest;
  readonly responseType: typeof core_pb.Transaction;
};

type BcGetMarkedTx = {
  readonly methodName: string;
  readonly service: typeof Bc;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof bc_pb.GetMarkedTxRequest;
  readonly responseType: typeof core_pb.MarkedTransaction;
};

type BcHelp = {
  readonly methodName: string;
  readonly service: typeof Bc;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof core_pb.Null;
  readonly responseType: typeof bc_pb.HelpResponse;
};

type BcStats = {
  readonly methodName: string;
  readonly service: typeof Bc;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof core_pb.Null;
  readonly responseType: typeof bc_pb.StatsResponse;
};

type BcNewTx = {
  readonly methodName: string;
  readonly service: typeof Bc;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof bc_pb.RpcTransaction;
  readonly responseType: typeof bc_pb.RpcTransactionResponse;
};

type BcGetBalance = {
  readonly methodName: string;
  readonly service: typeof Bc;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof bc_pb.GetBalanceRequest;
  readonly responseType: typeof bc_pb.GetBalanceResponse;
};

type BcGetSpendableCollateral = {
  readonly methodName: string;
  readonly service: typeof Bc;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof bc_pb.GetSpendableCollateralRequest;
  readonly responseType: typeof bc_pb.GetSpendableCollateralResponse;
};

type BcUnlockCollateral = {
  readonly methodName: string;
  readonly service: typeof Bc;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof bc_pb.UnlockCollateralRequest;
  readonly responseType: typeof bc_pb.RpcTransactionResponse;
};

type BcPlaceMakerOrder = {
  readonly methodName: string;
  readonly service: typeof Bc;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof bc_pb.PlaceMakerOrderRequest;
  readonly responseType: typeof bc_pb.RpcTransactionResponse;
};

type BcPlaceTakerOrder = {
  readonly methodName: string;
  readonly service: typeof Bc;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof bc_pb.PlaceTakerOrderRequest;
  readonly responseType: typeof bc_pb.RpcTransactionResponse;
};

type BcPlaceTakerOrders = {
  readonly methodName: string;
  readonly service: typeof Bc;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof bc_pb.PlaceTakerOrdersRequest;
  readonly responseType: typeof bc_pb.RpcTransactionResponse;
};

type BcCalculateMakerFee = {
  readonly methodName: string;
  readonly service: typeof Bc;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof bc_pb.CalculateMakerFeeRequest;
  readonly responseType: typeof bc_pb.FeeResponse;
};

type BcCalculateTakerFee = {
  readonly methodName: string;
  readonly service: typeof Bc;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof bc_pb.CalculateTakerFeeRequest;
  readonly responseType: typeof bc_pb.FeeResponse;
};

type BcGetOpenOrders = {
  readonly methodName: string;
  readonly service: typeof Bc;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof core_pb.Null;
  readonly responseType: typeof bc_pb.GetOpenOrdersResponse;
};

type BcGetMatchedOrders = {
  readonly methodName: string;
  readonly service: typeof Bc;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof bc_pb.GetMatchedOrdersRequest;
  readonly responseType: typeof bc_pb.GetMatchedOrdersResponse;
};

type BcGetBlake2bl = {
  readonly methodName: string;
  readonly service: typeof Bc;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof bc_pb.GetBlake2blRequest;
  readonly responseType: typeof bc_pb.GetBlake2blResponse;
};

type BcGetBcAddressViaVanity = {
  readonly methodName: string;
  readonly service: typeof Bc;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof bc_pb.VanityConvertRequest;
  readonly responseType: typeof bc_pb.VanityConvertResponse;
};

export class Bc {
  static readonly serviceName: string;
  static readonly GetRoveredBlockHash: BcGetRoveredBlockHash;
  static readonly GetRoveredBlockHeight: BcGetRoveredBlockHeight;
  static readonly GetRoveredBlocks: BcGetRoveredBlocks;
  static readonly GetLatestRoveredBlocks: BcGetLatestRoveredBlocks;
  static readonly GetBlockHash: BcGetBlockHash;
  static readonly GetBlockHeight: BcGetBlockHeight;
  static readonly GetBlocks: BcGetBlocks;
  static readonly GetLatestBlock: BcGetLatestBlock;
  static readonly GetTx: BcGetTx;
  static readonly GetMarkedTx: BcGetMarkedTx;
  static readonly Help: BcHelp;
  static readonly Stats: BcStats;
  static readonly NewTx: BcNewTx;
  static readonly GetBalance: BcGetBalance;
  static readonly GetSpendableCollateral: BcGetSpendableCollateral;
  static readonly UnlockCollateral: BcUnlockCollateral;
  static readonly PlaceMakerOrder: BcPlaceMakerOrder;
  static readonly PlaceTakerOrder: BcPlaceTakerOrder;
  static readonly PlaceTakerOrders: BcPlaceTakerOrders;
  static readonly CalculateMakerFee: BcCalculateMakerFee;
  static readonly CalculateTakerFee: BcCalculateTakerFee;
  static readonly GetOpenOrders: BcGetOpenOrders;
  static readonly GetMatchedOrders: BcGetMatchedOrders;
  static readonly GetBlake2bl: BcGetBlake2bl;
  static readonly GetBcAddressViaVanity: BcGetBcAddressViaVanity;
}

export type ServiceError = { message: string, code: number; metadata: grpc.Metadata }
export type Status = { details: string, code: number; metadata: grpc.Metadata }

interface UnaryResponse {
  cancel(): void;
}
interface ResponseStream<T> {
  cancel(): void;
  on(type: 'data', handler: (message: T) => void): ResponseStream<T>;
  on(type: 'end', handler: (status?: Status) => void): ResponseStream<T>;
  on(type: 'status', handler: (status: Status) => void): ResponseStream<T>;
}
interface RequestStream<T> {
  write(message: T): RequestStream<T>;
  end(): void;
  cancel(): void;
  on(type: 'end', handler: (status?: Status) => void): RequestStream<T>;
  on(type: 'status', handler: (status: Status) => void): RequestStream<T>;
}
interface BidirectionalStream<ReqT, ResT> {
  write(message: ReqT): BidirectionalStream<ReqT, ResT>;
  end(): void;
  cancel(): void;
  on(type: 'data', handler: (message: ResT) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'end', handler: (status?: Status) => void): BidirectionalStream<ReqT, ResT>;
  on(type: 'status', handler: (status: Status) => void): BidirectionalStream<ReqT, ResT>;
}

export class BcClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  getRoveredBlockHash(
    requestMessage: bc_pb.GetRoveredBlockHashRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: core_pb.Block|null) => void
  ): UnaryResponse;
  getRoveredBlockHash(
    requestMessage: bc_pb.GetRoveredBlockHashRequest,
    callback: (error: ServiceError|null, responseMessage: core_pb.Block|null) => void
  ): UnaryResponse;
  getRoveredBlockHeight(
    requestMessage: bc_pb.GetRoveredBlockHeightRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: core_pb.Block|null) => void
  ): UnaryResponse;
  getRoveredBlockHeight(
    requestMessage: bc_pb.GetRoveredBlockHeightRequest,
    callback: (error: ServiceError|null, responseMessage: core_pb.Block|null) => void
  ): UnaryResponse;
  getRoveredBlocks(
    requestMessage: bc_pb.GetRoveredBlocksRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: bc_pb.GetRoveredBlocksResponse|null) => void
  ): UnaryResponse;
  getRoveredBlocks(
    requestMessage: bc_pb.GetRoveredBlocksRequest,
    callback: (error: ServiceError|null, responseMessage: bc_pb.GetRoveredBlocksResponse|null) => void
  ): UnaryResponse;
  getLatestRoveredBlocks(
    requestMessage: core_pb.Null,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: bc_pb.GetRoveredBlocksResponse|null) => void
  ): UnaryResponse;
  getLatestRoveredBlocks(
    requestMessage: core_pb.Null,
    callback: (error: ServiceError|null, responseMessage: bc_pb.GetRoveredBlocksResponse|null) => void
  ): UnaryResponse;
  getBlockHash(
    requestMessage: bc_pb.GetBlockHashRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: core_pb.BcBlock|null) => void
  ): UnaryResponse;
  getBlockHash(
    requestMessage: bc_pb.GetBlockHashRequest,
    callback: (error: ServiceError|null, responseMessage: core_pb.BcBlock|null) => void
  ): UnaryResponse;
  getBlockHeight(
    requestMessage: bc_pb.GetBlockHeightRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: core_pb.BcBlock|null) => void
  ): UnaryResponse;
  getBlockHeight(
    requestMessage: bc_pb.GetBlockHeightRequest,
    callback: (error: ServiceError|null, responseMessage: core_pb.BcBlock|null) => void
  ): UnaryResponse;
  getBlocks(
    requestMessage: bc_pb.GetBlocksRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: bc_pb.GetBlocksResponse|null) => void
  ): UnaryResponse;
  getBlocks(
    requestMessage: bc_pb.GetBlocksRequest,
    callback: (error: ServiceError|null, responseMessage: bc_pb.GetBlocksResponse|null) => void
  ): UnaryResponse;
  getLatestBlock(
    requestMessage: core_pb.Null,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: core_pb.BcBlock|null) => void
  ): UnaryResponse;
  getLatestBlock(
    requestMessage: core_pb.Null,
    callback: (error: ServiceError|null, responseMessage: core_pb.BcBlock|null) => void
  ): UnaryResponse;
  getTx(
    requestMessage: bc_pb.GetTxRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: core_pb.Transaction|null) => void
  ): UnaryResponse;
  getTx(
    requestMessage: bc_pb.GetTxRequest,
    callback: (error: ServiceError|null, responseMessage: core_pb.Transaction|null) => void
  ): UnaryResponse;
  getMarkedTx(
    requestMessage: bc_pb.GetMarkedTxRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: core_pb.MarkedTransaction|null) => void
  ): UnaryResponse;
  getMarkedTx(
    requestMessage: bc_pb.GetMarkedTxRequest,
    callback: (error: ServiceError|null, responseMessage: core_pb.MarkedTransaction|null) => void
  ): UnaryResponse;
  help(
    requestMessage: core_pb.Null,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: bc_pb.HelpResponse|null) => void
  ): UnaryResponse;
  help(
    requestMessage: core_pb.Null,
    callback: (error: ServiceError|null, responseMessage: bc_pb.HelpResponse|null) => void
  ): UnaryResponse;
  stats(
    requestMessage: core_pb.Null,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: bc_pb.StatsResponse|null) => void
  ): UnaryResponse;
  stats(
    requestMessage: core_pb.Null,
    callback: (error: ServiceError|null, responseMessage: bc_pb.StatsResponse|null) => void
  ): UnaryResponse;
  newTx(
    requestMessage: bc_pb.RpcTransaction,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: bc_pb.RpcTransactionResponse|null) => void
  ): UnaryResponse;
  newTx(
    requestMessage: bc_pb.RpcTransaction,
    callback: (error: ServiceError|null, responseMessage: bc_pb.RpcTransactionResponse|null) => void
  ): UnaryResponse;
  getBalance(
    requestMessage: bc_pb.GetBalanceRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: bc_pb.GetBalanceResponse|null) => void
  ): UnaryResponse;
  getBalance(
    requestMessage: bc_pb.GetBalanceRequest,
    callback: (error: ServiceError|null, responseMessage: bc_pb.GetBalanceResponse|null) => void
  ): UnaryResponse;
  getSpendableCollateral(
    requestMessage: bc_pb.GetSpendableCollateralRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: bc_pb.GetSpendableCollateralResponse|null) => void
  ): UnaryResponse;
  getSpendableCollateral(
    requestMessage: bc_pb.GetSpendableCollateralRequest,
    callback: (error: ServiceError|null, responseMessage: bc_pb.GetSpendableCollateralResponse|null) => void
  ): UnaryResponse;
  unlockCollateral(
    requestMessage: bc_pb.UnlockCollateralRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: bc_pb.RpcTransactionResponse|null) => void
  ): UnaryResponse;
  unlockCollateral(
    requestMessage: bc_pb.UnlockCollateralRequest,
    callback: (error: ServiceError|null, responseMessage: bc_pb.RpcTransactionResponse|null) => void
  ): UnaryResponse;
  placeMakerOrder(
    requestMessage: bc_pb.PlaceMakerOrderRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: bc_pb.RpcTransactionResponse|null) => void
  ): UnaryResponse;
  placeMakerOrder(
    requestMessage: bc_pb.PlaceMakerOrderRequest,
    callback: (error: ServiceError|null, responseMessage: bc_pb.RpcTransactionResponse|null) => void
  ): UnaryResponse;
  placeTakerOrder(
    requestMessage: bc_pb.PlaceTakerOrderRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: bc_pb.RpcTransactionResponse|null) => void
  ): UnaryResponse;
  placeTakerOrder(
    requestMessage: bc_pb.PlaceTakerOrderRequest,
    callback: (error: ServiceError|null, responseMessage: bc_pb.RpcTransactionResponse|null) => void
  ): UnaryResponse;
  placeTakerOrders(
    requestMessage: bc_pb.PlaceTakerOrdersRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: bc_pb.RpcTransactionResponse|null) => void
  ): UnaryResponse;
  placeTakerOrders(
    requestMessage: bc_pb.PlaceTakerOrdersRequest,
    callback: (error: ServiceError|null, responseMessage: bc_pb.RpcTransactionResponse|null) => void
  ): UnaryResponse;
  calculateMakerFee(
    requestMessage: bc_pb.CalculateMakerFeeRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: bc_pb.FeeResponse|null) => void
  ): UnaryResponse;
  calculateMakerFee(
    requestMessage: bc_pb.CalculateMakerFeeRequest,
    callback: (error: ServiceError|null, responseMessage: bc_pb.FeeResponse|null) => void
  ): UnaryResponse;
  calculateTakerFee(
    requestMessage: bc_pb.CalculateTakerFeeRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: bc_pb.FeeResponse|null) => void
  ): UnaryResponse;
  calculateTakerFee(
    requestMessage: bc_pb.CalculateTakerFeeRequest,
    callback: (error: ServiceError|null, responseMessage: bc_pb.FeeResponse|null) => void
  ): UnaryResponse;
  getOpenOrders(
    requestMessage: core_pb.Null,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: bc_pb.GetOpenOrdersResponse|null) => void
  ): UnaryResponse;
  getOpenOrders(
    requestMessage: core_pb.Null,
    callback: (error: ServiceError|null, responseMessage: bc_pb.GetOpenOrdersResponse|null) => void
  ): UnaryResponse;
  getMatchedOrders(
    requestMessage: bc_pb.GetMatchedOrdersRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: bc_pb.GetMatchedOrdersResponse|null) => void
  ): UnaryResponse;
  getMatchedOrders(
    requestMessage: bc_pb.GetMatchedOrdersRequest,
    callback: (error: ServiceError|null, responseMessage: bc_pb.GetMatchedOrdersResponse|null) => void
  ): UnaryResponse;
  getBlake2bl(
    requestMessage: bc_pb.GetBlake2blRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: bc_pb.GetBlake2blResponse|null) => void
  ): UnaryResponse;
  getBlake2bl(
    requestMessage: bc_pb.GetBlake2blRequest,
    callback: (error: ServiceError|null, responseMessage: bc_pb.GetBlake2blResponse|null) => void
  ): UnaryResponse;
  getBcAddressViaVanity(
    requestMessage: bc_pb.VanityConvertRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: bc_pb.VanityConvertResponse|null) => void
  ): UnaryResponse;
  getBcAddressViaVanity(
    requestMessage: bc_pb.VanityConvertRequest,
    callback: (error: ServiceError|null, responseMessage: bc_pb.VanityConvertResponse|null) => void
  ): UnaryResponse;
}

