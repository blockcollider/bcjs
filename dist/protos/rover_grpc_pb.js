// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var rover_pb = require('./rover_pb.js');
var core_pb = require('./core_pb.js');

function serialize_bcsdk_Block(arg) {
  if (!(arg instanceof core_pb.Block)) {
    throw new Error('Expected argument of type bcsdk.Block');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_Block(buffer_arg) {
  return core_pb.Block.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_Null(arg) {
  if (!(arg instanceof core_pb.Null)) {
    throw new Error('Expected argument of type bcsdk.Null');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_Null(buffer_arg) {
  return core_pb.Null.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_RoverIdent(arg) {
  if (!(arg instanceof rover_pb.RoverIdent)) {
    throw new Error('Expected argument of type bcsdk.RoverIdent');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_RoverIdent(buffer_arg) {
  return rover_pb.RoverIdent.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_RoverMessage(arg) {
  if (!(arg instanceof rover_pb.RoverMessage)) {
    throw new Error('Expected argument of type bcsdk.RoverMessage');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_RoverMessage(buffer_arg) {
  return rover_pb.RoverMessage.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_RoverMessage_RoverBlockRange(arg) {
  if (!(arg instanceof rover_pb.RoverMessage.RoverBlockRange)) {
    throw new Error('Expected argument of type bcsdk.RoverMessage.RoverBlockRange');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_RoverMessage_RoverBlockRange(buffer_arg) {
  return rover_pb.RoverMessage.RoverBlockRange.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_RoverSyncStatus(arg) {
  if (!(arg instanceof rover_pb.RoverSyncStatus)) {
    throw new Error('Expected argument of type bcsdk.RoverSyncStatus');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_RoverSyncStatus(buffer_arg) {
  return rover_pb.RoverSyncStatus.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_SettleTxCheckReq(arg) {
  if (!(arg instanceof rover_pb.SettleTxCheckReq)) {
    throw new Error('Expected argument of type bcsdk.SettleTxCheckReq');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_SettleTxCheckReq(buffer_arg) {
  return rover_pb.SettleTxCheckReq.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_SettleTxCheckResponse(arg) {
  if (!(arg instanceof rover_pb.SettleTxCheckResponse)) {
    throw new Error('Expected argument of type bcsdk.SettleTxCheckResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_SettleTxCheckResponse(buffer_arg) {
  return rover_pb.SettleTxCheckResponse.deserializeBinary(new Uint8Array(buffer_arg));
}


var RoverService = exports.RoverService = {
  // Sends a greeting
  join: {
    path: '/bcsdk.Rover/Join',
    requestStream: false,
    responseStream: true,
    requestType: rover_pb.RoverIdent,
    responseType: rover_pb.RoverMessage,
    requestSerialize: serialize_bcsdk_RoverIdent,
    requestDeserialize: deserialize_bcsdk_RoverIdent,
    responseSerialize: serialize_bcsdk_RoverMessage,
    responseDeserialize: deserialize_bcsdk_RoverMessage,
  },
  // Rovers sends block collected from the respective network
  collectBlock: {
    path: '/bcsdk.Rover/CollectBlock',
    requestStream: true,
    responseStream: false,
    requestType: core_pb.Block,
    responseType: core_pb.Null,
    requestSerialize: serialize_bcsdk_Block,
    requestDeserialize: deserialize_bcsdk_Block,
    responseSerialize: serialize_bcsdk_Null,
    responseDeserialize: deserialize_bcsdk_Null,
  },
  // Rover reports back sync status
  reportSyncStatus: {
    path: '/bcsdk.Rover/ReportSyncStatus',
    requestStream: false,
    responseStream: false,
    requestType: rover_pb.RoverSyncStatus,
    responseType: core_pb.Null,
    requestSerialize: serialize_bcsdk_RoverSyncStatus,
    requestDeserialize: deserialize_bcsdk_RoverSyncStatus,
    responseSerialize: serialize_bcsdk_Null,
    responseDeserialize: deserialize_bcsdk_Null,
  },
  // Rover submits block range
  reportBlockRange: {
    path: '/bcsdk.Rover/ReportBlockRange',
    requestStream: false,
    responseStream: false,
    requestType: rover_pb.RoverMessage.RoverBlockRange,
    responseType: core_pb.Null,
    requestSerialize: serialize_bcsdk_RoverMessage_RoverBlockRange,
    requestDeserialize: deserialize_bcsdk_RoverMessage_RoverBlockRange,
    responseSerialize: serialize_bcsdk_Null,
    responseDeserialize: deserialize_bcsdk_Null,
  },
  // Check is TX reciveved in rover is watched and before settlement height
  isBeforeSettleHeight: {
    path: '/bcsdk.Rover/IsBeforeSettleHeight',
    requestStream: false,
    responseStream: false,
    requestType: rover_pb.SettleTxCheckReq,
    responseType: rover_pb.SettleTxCheckResponse,
    requestSerialize: serialize_bcsdk_SettleTxCheckReq,
    requestDeserialize: deserialize_bcsdk_SettleTxCheckReq,
    responseSerialize: serialize_bcsdk_SettleTxCheckResponse,
    responseDeserialize: deserialize_bcsdk_SettleTxCheckResponse,
  },
};

exports.RoverClient = grpc.makeGenericClientConstructor(RoverService);
