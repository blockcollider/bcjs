// package: bc
// file: miner.proto

import * as miner_pb from "./miner_pb";
import {grpc} from "@improbable-eng/grpc-web";

type MinerMine = {
  readonly methodName: string;
  readonly service: typeof Miner;
  readonly requestStream: false;
  readonly responseStream: false;
  readonly requestType: typeof miner_pb.MinerRequest;
  readonly responseType: typeof miner_pb.MinerResponse;
};

export class Miner {
  static readonly serviceName: string;
  static readonly Mine: MinerMine;
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

export class MinerClient {
  readonly serviceHost: string;

  constructor(serviceHost: string, options?: grpc.RpcOptions);
  mine(
    requestMessage: miner_pb.MinerRequest,
    metadata: grpc.Metadata,
    callback: (error: ServiceError|null, responseMessage: miner_pb.MinerResponse|null) => void
  ): UnaryResponse;
  mine(
    requestMessage: miner_pb.MinerRequest,
    callback: (error: ServiceError|null, responseMessage: miner_pb.MinerResponse|null) => void
  ): UnaryResponse;
}

