// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var miner_pb = require('./miner_pb.js');
var core_pb = require('./core_pb.js');

function serialize_bcsdk_MinerRequest(arg) {
  if (!(arg instanceof miner_pb.MinerRequest)) {
    throw new Error('Expected argument of type bcsdk.MinerRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_MinerRequest(buffer_arg) {
  return miner_pb.MinerRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_MinerResponse(arg) {
  if (!(arg instanceof miner_pb.MinerResponse)) {
    throw new Error('Expected argument of type bcsdk.MinerResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_MinerResponse(buffer_arg) {
  return miner_pb.MinerResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var MinerService = exports.MinerService = {
  mine: {
    path: '/bcsdk.Miner/Mine',
    requestStream: false,
    responseStream: false,
    requestType: miner_pb.MinerRequest,
    responseType: miner_pb.MinerResponse,
    requestSerialize: serialize_bcsdk_MinerRequest,
    requestDeserialize: deserialize_bcsdk_MinerRequest,
    responseSerialize: serialize_bcsdk_MinerResponse,
    responseDeserialize: deserialize_bcsdk_MinerResponse,
  },
};

exports.MinerClient = grpc.makeGenericClientConstructor(MinerService);
