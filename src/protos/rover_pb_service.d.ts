// package: bcsdk
// file: rover.proto

import * as rover_pb from "./rover_pb";
import * as core_pb from "./core_pb";
import {grpc} from "@improbable-eng/grpc-web";

type RoverJoin = {
  readonly methodName: string;
  readonly service: typeof Rover;
  readonly requestStream: false;
  readonly responseStream: true;
  readonly requestType: typeof rover_pb.RoverIdent;
  readonly responseType: typeof rover_pb.RoverMessage;
};

type RoverCollectBlock = {
  readonly methodName: string;
  readonly service: typeof Rover;
  readonly requestStream: true;
  readonly responseStream: false;
  readonly requestType: typeof core_pb.Block;
  readonly responseType: typeof core_pb.Null;
};

type RoverReportSyncStatus = {
  readonly methodName: string;
  readonly service: typeof Rover;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rover_pb.RoverSyncStatus;
  readonly responseType: typeof core_pb.Null;
};

type RoverReportBlockRange = {
  readonly methodName: string;
  readonly service: typeof Rover;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rover_pb.RoverMessage.RoverBlockRange;
  readonly responseType: typeof core_pb.Null;
};

type RoverIsBeforeSettleHeight = {
  readonly methodName: string;
  readonly service: typeof Rover;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof rover_pb.SettleTxCheckReq;
  readonly responseType: typeof rover_pb.SettleTxCheckResponse;
};

export class Rover {
  static readonly serviceName: string;
  static readonly Join: RoverJoin;
  static readonly CollectBlock: RoverCollectBlock;
  static readonly ReportSyncStatus: RoverReportSyncStatus;
  static readonly ReportBlockRange: RoverReportBlockRange;
  static readonly IsBeforeSettleHeight: RoverIsBeforeSettleHeight;
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

export class RoverClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  join(requestMessage: rover_pb.RoverIdent, metadata?: grpc.Metadata): ResponseStream<rover_pb.RoverMessage>;
  collectBlock(metadata?: grpc.Metadata): RequestStream<core_pb.Block>;
  reportSyncStatus(
    requestMessage: rover_pb.RoverSyncStatus,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: core_pb.Null|null) => void
  ): UnaryResponse;
  reportSyncStatus(
    requestMessage: rover_pb.RoverSyncStatus,
    callback: (error: ServiceError|null, responseMessage: core_pb.Null|null) => void
  ): UnaryResponse;
  reportBlockRange(
    requestMessage: rover_pb.RoverMessage.RoverBlockRange,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: core_pb.Null|null) => void
  ): UnaryResponse;
  reportBlockRange(
    requestMessage: rover_pb.RoverMessage.RoverBlockRange,
    callback: (error: ServiceError|null, responseMessage: core_pb.Null|null) => void
  ): UnaryResponse;
  isBeforeSettleHeight(
    requestMessage: rover_pb.SettleTxCheckReq,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: rover_pb.SettleTxCheckResponse|null) => void
  ): UnaryResponse;
  isBeforeSettleHeight(
    requestMessage: rover_pb.SettleTxCheckReq,
    callback: (error: ServiceError|null, responseMessage: rover_pb.SettleTxCheckResponse|null) => void
  ): UnaryResponse;
}

