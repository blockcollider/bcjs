// GENERATED CODE -- DO NOT EDIT!

'use strict';
var grpc = require('grpc');
var bc_pb = require('./bc_pb.js');
var core_pb = require('./core_pb.js');

function serialize_bcsdk_BcBlock(arg) {
  if (!(arg instanceof core_pb.BcBlock)) {
    throw new Error('Expected argument of type bcsdk.BcBlock');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_BcBlock(buffer_arg) {
  return core_pb.BcBlock.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_Block(arg) {
  if (!(arg instanceof core_pb.Block)) {
    throw new Error('Expected argument of type bcsdk.Block');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_Block(buffer_arg) {
  return core_pb.Block.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_CurrentWork(arg) {
  if (!(arg instanceof bc_pb.CurrentWork)) {
    throw new Error('Expected argument of type bcsdk.CurrentWork');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_CurrentWork(buffer_arg) {
  return bc_pb.CurrentWork.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetBalanceRequest(arg) {
  if (!(arg instanceof bc_pb.GetBalanceRequest)) {
    throw new Error('Expected argument of type bcsdk.GetBalanceRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetBalanceRequest(buffer_arg) {
  return bc_pb.GetBalanceRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetBalanceResponse(arg) {
  if (!(arg instanceof bc_pb.GetBalanceResponse)) {
    throw new Error('Expected argument of type bcsdk.GetBalanceResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetBalanceResponse(buffer_arg) {
  return bc_pb.GetBalanceResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetBlake2blRequest(arg) {
  if (!(arg instanceof bc_pb.GetBlake2blRequest)) {
    throw new Error('Expected argument of type bcsdk.GetBlake2blRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetBlake2blRequest(buffer_arg) {
  return bc_pb.GetBlake2blRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetBlake2blResponse(arg) {
  if (!(arg instanceof bc_pb.GetBlake2blResponse)) {
    throw new Error('Expected argument of type bcsdk.GetBlake2blResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetBlake2blResponse(buffer_arg) {
  return bc_pb.GetBlake2blResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetBlockHashRequest(arg) {
  if (!(arg instanceof bc_pb.GetBlockHashRequest)) {
    throw new Error('Expected argument of type bcsdk.GetBlockHashRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetBlockHashRequest(buffer_arg) {
  return bc_pb.GetBlockHashRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetBlockHeightRequest(arg) {
  if (!(arg instanceof bc_pb.GetBlockHeightRequest)) {
    throw new Error('Expected argument of type bcsdk.GetBlockHeightRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetBlockHeightRequest(buffer_arg) {
  return bc_pb.GetBlockHeightRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetBlocksRequest(arg) {
  if (!(arg instanceof bc_pb.GetBlocksRequest)) {
    throw new Error('Expected argument of type bcsdk.GetBlocksRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetBlocksRequest(buffer_arg) {
  return bc_pb.GetBlocksRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetBlocksResponse(arg) {
  if (!(arg instanceof bc_pb.GetBlocksResponse)) {
    throw new Error('Expected argument of type bcsdk.GetBlocksResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetBlocksResponse(buffer_arg) {
  return bc_pb.GetBlocksResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetHistoricalOrdersResponse(arg) {
  if (!(arg instanceof bc_pb.GetHistoricalOrdersResponse)) {
    throw new Error('Expected argument of type bcsdk.GetHistoricalOrdersResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetHistoricalOrdersResponse(buffer_arg) {
  return bc_pb.GetHistoricalOrdersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetHistoryRequest(arg) {
  if (!(arg instanceof bc_pb.GetHistoryRequest)) {
    throw new Error('Expected argument of type bcsdk.GetHistoryRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetHistoryRequest(buffer_arg) {
  return bc_pb.GetHistoryRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetMarkedTxRequest(arg) {
  if (!(arg instanceof bc_pb.GetMarkedTxRequest)) {
    throw new Error('Expected argument of type bcsdk.GetMarkedTxRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetMarkedTxRequest(buffer_arg) {
  return bc_pb.GetMarkedTxRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetMarkedTxs(arg) {
  if (!(arg instanceof bc_pb.GetMarkedTxs)) {
    throw new Error('Expected argument of type bcsdk.GetMarkedTxs');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetMarkedTxs(buffer_arg) {
  return bc_pb.GetMarkedTxs.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetMatchedOrdersResponse(arg) {
  if (!(arg instanceof bc_pb.GetMatchedOrdersResponse)) {
    throw new Error('Expected argument of type bcsdk.GetMatchedOrdersResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetMatchedOrdersResponse(buffer_arg) {
  return bc_pb.GetMatchedOrdersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetNrgSupplyResponse(arg) {
  if (!(arg instanceof bc_pb.GetNrgSupplyResponse)) {
    throw new Error('Expected argument of type bcsdk.GetNrgSupplyResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetNrgSupplyResponse(buffer_arg) {
  return bc_pb.GetNrgSupplyResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetOpenOrdersResponse(arg) {
  if (!(arg instanceof bc_pb.GetOpenOrdersResponse)) {
    throw new Error('Expected argument of type bcsdk.GetOpenOrdersResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetOpenOrdersResponse(buffer_arg) {
  return bc_pb.GetOpenOrdersResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetOutPointRequest(arg) {
  if (!(arg instanceof bc_pb.GetOutPointRequest)) {
    throw new Error('Expected argument of type bcsdk.GetOutPointRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetOutPointRequest(buffer_arg) {
  return bc_pb.GetOutPointRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetOutPointStatusResponse(arg) {
  if (!(arg instanceof bc_pb.GetOutPointStatusResponse)) {
    throw new Error('Expected argument of type bcsdk.GetOutPointStatusResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetOutPointStatusResponse(buffer_arg) {
  return bc_pb.GetOutPointStatusResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetRawMempoolResponse(arg) {
  if (!(arg instanceof bc_pb.GetRawMempoolResponse)) {
    throw new Error('Expected argument of type bcsdk.GetRawMempoolResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetRawMempoolResponse(buffer_arg) {
  return bc_pb.GetRawMempoolResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetRoveredBlockHashRequest(arg) {
  if (!(arg instanceof bc_pb.GetRoveredBlockHashRequest)) {
    throw new Error('Expected argument of type bcsdk.GetRoveredBlockHashRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetRoveredBlockHashRequest(buffer_arg) {
  return bc_pb.GetRoveredBlockHashRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetRoveredBlockHeightRequest(arg) {
  if (!(arg instanceof bc_pb.GetRoveredBlockHeightRequest)) {
    throw new Error('Expected argument of type bcsdk.GetRoveredBlockHeightRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetRoveredBlockHeightRequest(buffer_arg) {
  return bc_pb.GetRoveredBlockHeightRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetRoveredBlocksRequest(arg) {
  if (!(arg instanceof bc_pb.GetRoveredBlocksRequest)) {
    throw new Error('Expected argument of type bcsdk.GetRoveredBlocksRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetRoveredBlocksRequest(buffer_arg) {
  return bc_pb.GetRoveredBlocksRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetRoveredBlocksResponse(arg) {
  if (!(arg instanceof bc_pb.GetRoveredBlocksResponse)) {
    throw new Error('Expected argument of type bcsdk.GetRoveredBlocksResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetRoveredBlocksResponse(buffer_arg) {
  return bc_pb.GetRoveredBlocksResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetSpendableCollateralRequest(arg) {
  if (!(arg instanceof bc_pb.GetSpendableCollateralRequest)) {
    throw new Error('Expected argument of type bcsdk.GetSpendableCollateralRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetSpendableCollateralRequest(buffer_arg) {
  return bc_pb.GetSpendableCollateralRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetSpendableCollateralResponse(arg) {
  if (!(arg instanceof bc_pb.GetSpendableCollateralResponse)) {
    throw new Error('Expected argument of type bcsdk.GetSpendableCollateralResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetSpendableCollateralResponse(buffer_arg) {
  return bc_pb.GetSpendableCollateralResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetTradeStatusResponse(arg) {
  if (!(arg instanceof bc_pb.GetTradeStatusResponse)) {
    throw new Error('Expected argument of type bcsdk.GetTradeStatusResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetTradeStatusResponse(buffer_arg) {
  return bc_pb.GetTradeStatusResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetTxRequest(arg) {
  if (!(arg instanceof bc_pb.GetTxRequest)) {
    throw new Error('Expected argument of type bcsdk.GetTxRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetTxRequest(buffer_arg) {
  return bc_pb.GetTxRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetUnlockTakerTxParamsRequest(arg) {
  if (!(arg instanceof bc_pb.GetUnlockTakerTxParamsRequest)) {
    throw new Error('Expected argument of type bcsdk.GetUnlockTakerTxParamsRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetUnlockTakerTxParamsRequest(buffer_arg) {
  return bc_pb.GetUnlockTakerTxParamsRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetUnlockTakerTxParamsResponse(arg) {
  if (!(arg instanceof bc_pb.GetUnlockTakerTxParamsResponse)) {
    throw new Error('Expected argument of type bcsdk.GetUnlockTakerTxParamsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetUnlockTakerTxParamsResponse(buffer_arg) {
  return bc_pb.GetUnlockTakerTxParamsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetUtxoLengthRequest(arg) {
  if (!(arg instanceof bc_pb.GetUtxoLengthRequest)) {
    throw new Error('Expected argument of type bcsdk.GetUtxoLengthRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetUtxoLengthRequest(buffer_arg) {
  return bc_pb.GetUtxoLengthRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_GetUtxoLengthResponse(arg) {
  if (!(arg instanceof bc_pb.GetUtxoLengthResponse)) {
    throw new Error('Expected argument of type bcsdk.GetUtxoLengthResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_GetUtxoLengthResponse(buffer_arg) {
  return bc_pb.GetUtxoLengthResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_HelpResponse(arg) {
  if (!(arg instanceof bc_pb.HelpResponse)) {
    throw new Error('Expected argument of type bcsdk.HelpResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_HelpResponse(buffer_arg) {
  return bc_pb.HelpResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_MarkedTransaction(arg) {
  if (!(arg instanceof core_pb.MarkedTransaction)) {
    throw new Error('Expected argument of type bcsdk.MarkedTransaction');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_MarkedTransaction(buffer_arg) {
  return core_pb.MarkedTransaction.deserializeBinary(new Uint8Array(buffer_arg));
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

function serialize_bcsdk_RpcTransaction(arg) {
  if (!(arg instanceof bc_pb.RpcTransaction)) {
    throw new Error('Expected argument of type bcsdk.RpcTransaction');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_RpcTransaction(buffer_arg) {
  return bc_pb.RpcTransaction.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_RpcTransactionResponse(arg) {
  if (!(arg instanceof bc_pb.RpcTransactionResponse)) {
    throw new Error('Expected argument of type bcsdk.RpcTransactionResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_RpcTransactionResponse(buffer_arg) {
  return bc_pb.RpcTransactionResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_SettingsResponse(arg) {
  if (!(arg instanceof bc_pb.SettingsResponse)) {
    throw new Error('Expected argument of type bcsdk.SettingsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_SettingsResponse(buffer_arg) {
  return bc_pb.SettingsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_StatsResponse(arg) {
  if (!(arg instanceof bc_pb.StatsResponse)) {
    throw new Error('Expected argument of type bcsdk.StatsResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_StatsResponse(buffer_arg) {
  return bc_pb.StatsResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_SyncStatus(arg) {
  if (!(arg instanceof bc_pb.SyncStatus)) {
    throw new Error('Expected argument of type bcsdk.SyncStatus');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_SyncStatus(buffer_arg) {
  return bc_pb.SyncStatus.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_Transaction(arg) {
  if (!(arg instanceof core_pb.Transaction)) {
    throw new Error('Expected argument of type bcsdk.Transaction');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_Transaction(buffer_arg) {
  return core_pb.Transaction.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_TransferRequest(arg) {
  if (!(arg instanceof bc_pb.TransferRequest)) {
    throw new Error('Expected argument of type bcsdk.TransferRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_TransferRequest(buffer_arg) {
  return bc_pb.TransferRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_TransferResponse(arg) {
  if (!(arg instanceof bc_pb.TransferResponse)) {
    throw new Error('Expected argument of type bcsdk.TransferResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_TransferResponse(buffer_arg) {
  return bc_pb.TransferResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_VanityConvertRequest(arg) {
  if (!(arg instanceof bc_pb.VanityConvertRequest)) {
    throw new Error('Expected argument of type bcsdk.VanityConvertRequest');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_VanityConvertRequest(buffer_arg) {
  return bc_pb.VanityConvertRequest.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_VanityConvertResponse(arg) {
  if (!(arg instanceof bc_pb.VanityConvertResponse)) {
    throw new Error('Expected argument of type bcsdk.VanityConvertResponse');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_VanityConvertResponse(buffer_arg) {
  return bc_pb.VanityConvertResponse.deserializeBinary(new Uint8Array(buffer_arg));
}

function serialize_bcsdk_WalletData(arg) {
  if (!(arg instanceof core_pb.WalletData)) {
    throw new Error('Expected argument of type bcsdk.WalletData');
  }
  return Buffer.from(arg.serializeBinary());
}

function deserialize_bcsdk_WalletData(buffer_arg) {
  return core_pb.WalletData.deserializeBinary(new Uint8Array(buffer_arg));
}


var BcService = exports.BcService = {
  getRoveredBlockHash: {
    path: '/bcsdk.Bc/GetRoveredBlockHash',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetRoveredBlockHashRequest,
    responseType: core_pb.Block,
    requestSerialize: serialize_bcsdk_GetRoveredBlockHashRequest,
    requestDeserialize: deserialize_bcsdk_GetRoveredBlockHashRequest,
    responseSerialize: serialize_bcsdk_Block,
    responseDeserialize: deserialize_bcsdk_Block,
  },
  getRoveredBlockHeight: {
    path: '/bcsdk.Bc/GetRoveredBlockHeight',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetRoveredBlockHeightRequest,
    responseType: core_pb.Block,
    requestSerialize: serialize_bcsdk_GetRoveredBlockHeightRequest,
    requestDeserialize: deserialize_bcsdk_GetRoveredBlockHeightRequest,
    responseSerialize: serialize_bcsdk_Block,
    responseDeserialize: deserialize_bcsdk_Block,
  },
  getRoveredBlocks: {
    path: '/bcsdk.Bc/GetRoveredBlocks',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetRoveredBlocksRequest,
    responseType: bc_pb.GetRoveredBlocksResponse,
    requestSerialize: serialize_bcsdk_GetRoveredBlocksRequest,
    requestDeserialize: deserialize_bcsdk_GetRoveredBlocksRequest,
    responseSerialize: serialize_bcsdk_GetRoveredBlocksResponse,
    responseDeserialize: deserialize_bcsdk_GetRoveredBlocksResponse,
  },
  getLatestRoveredBlocks: {
    path: '/bcsdk.Bc/GetLatestRoveredBlocks',
    requestStream: false,
    responseStream: false,
    requestType: core_pb.Null,
    responseType: bc_pb.GetRoveredBlocksResponse,
    requestSerialize: serialize_bcsdk_Null,
    requestDeserialize: deserialize_bcsdk_Null,
    responseSerialize: serialize_bcsdk_GetRoveredBlocksResponse,
    responseDeserialize: deserialize_bcsdk_GetRoveredBlocksResponse,
  },
  getNrgSupply: {
    path: '/bcsdk.Bc/GetNrgSupply',
    requestStream: false,
    responseStream: false,
    requestType: core_pb.Null,
    responseType: bc_pb.GetNrgSupplyResponse,
    requestSerialize: serialize_bcsdk_Null,
    requestDeserialize: deserialize_bcsdk_Null,
    responseSerialize: serialize_bcsdk_GetNrgSupplyResponse,
    responseDeserialize: deserialize_bcsdk_GetNrgSupplyResponse,
  },
  getBlockHash: {
    path: '/bcsdk.Bc/GetBlockHash',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetBlockHashRequest,
    responseType: core_pb.BcBlock,
    requestSerialize: serialize_bcsdk_GetBlockHashRequest,
    requestDeserialize: deserialize_bcsdk_GetBlockHashRequest,
    responseSerialize: serialize_bcsdk_BcBlock,
    responseDeserialize: deserialize_bcsdk_BcBlock,
  },
  getBlockHeight: {
    path: '/bcsdk.Bc/GetBlockHeight',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetBlockHeightRequest,
    responseType: core_pb.BcBlock,
    requestSerialize: serialize_bcsdk_GetBlockHeightRequest,
    requestDeserialize: deserialize_bcsdk_GetBlockHeightRequest,
    responseSerialize: serialize_bcsdk_BcBlock,
    responseDeserialize: deserialize_bcsdk_BcBlock,
  },
  getBlocksHeight: {
    path: '/bcsdk.Bc/GetBlocksHeight',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetBlockHeightRequest,
    responseType: bc_pb.GetBlocksResponse,
    requestSerialize: serialize_bcsdk_GetBlockHeightRequest,
    requestDeserialize: deserialize_bcsdk_GetBlockHeightRequest,
    responseSerialize: serialize_bcsdk_GetBlocksResponse,
    responseDeserialize: deserialize_bcsdk_GetBlocksResponse,
  },
  getBlocks: {
    path: '/bcsdk.Bc/GetBlocks',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetBlocksRequest,
    responseType: bc_pb.GetBlocksResponse,
    requestSerialize: serialize_bcsdk_GetBlocksRequest,
    requestDeserialize: deserialize_bcsdk_GetBlocksRequest,
    responseSerialize: serialize_bcsdk_GetBlocksResponse,
    responseDeserialize: deserialize_bcsdk_GetBlocksResponse,
  },
  getLatestBlock: {
    path: '/bcsdk.Bc/GetLatestBlock',
    requestStream: false,
    responseStream: false,
    requestType: core_pb.Null,
    responseType: core_pb.BcBlock,
    requestSerialize: serialize_bcsdk_Null,
    requestDeserialize: deserialize_bcsdk_Null,
    responseSerialize: serialize_bcsdk_BcBlock,
    responseDeserialize: deserialize_bcsdk_BcBlock,
  },
  getLatestUTXOBlock: {
    path: '/bcsdk.Bc/GetLatestUTXOBlock',
    requestStream: false,
    responseStream: false,
    requestType: core_pb.Null,
    responseType: core_pb.BcBlock,
    requestSerialize: serialize_bcsdk_Null,
    requestDeserialize: deserialize_bcsdk_Null,
    responseSerialize: serialize_bcsdk_BcBlock,
    responseDeserialize: deserialize_bcsdk_BcBlock,
  },
  getTx: {
    path: '/bcsdk.Bc/GetTx',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetTxRequest,
    responseType: core_pb.Transaction,
    requestSerialize: serialize_bcsdk_GetTxRequest,
    requestDeserialize: deserialize_bcsdk_GetTxRequest,
    responseSerialize: serialize_bcsdk_Transaction,
    responseDeserialize: deserialize_bcsdk_Transaction,
  },
  getMarkedTx: {
    path: '/bcsdk.Bc/GetMarkedTx',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetMarkedTxRequest,
    responseType: core_pb.MarkedTransaction,
    requestSerialize: serialize_bcsdk_GetMarkedTxRequest,
    requestDeserialize: deserialize_bcsdk_GetMarkedTxRequest,
    responseSerialize: serialize_bcsdk_MarkedTransaction,
    responseDeserialize: deserialize_bcsdk_MarkedTransaction,
  },
  getMarkedTxsForMatchedOrder: {
    path: '/bcsdk.Bc/GetMarkedTxsForMatchedOrder',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetOutPointRequest,
    responseType: bc_pb.GetMarkedTxs,
    requestSerialize: serialize_bcsdk_GetOutPointRequest,
    requestDeserialize: deserialize_bcsdk_GetOutPointRequest,
    responseSerialize: serialize_bcsdk_GetMarkedTxs,
    responseDeserialize: deserialize_bcsdk_GetMarkedTxs,
  },
  getTradeStatus: {
    path: '/bcsdk.Bc/GetTradeStatus',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetOutPointRequest,
    responseType: bc_pb.GetTradeStatusResponse,
    requestSerialize: serialize_bcsdk_GetOutPointRequest,
    requestDeserialize: deserialize_bcsdk_GetOutPointRequest,
    responseSerialize: serialize_bcsdk_GetTradeStatusResponse,
    responseDeserialize: deserialize_bcsdk_GetTradeStatusResponse,
  },
  getOutpointStatus: {
    path: '/bcsdk.Bc/GetOutpointStatus',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetOutPointRequest,
    responseType: bc_pb.GetOutPointStatusResponse,
    requestSerialize: serialize_bcsdk_GetOutPointRequest,
    requestDeserialize: deserialize_bcsdk_GetOutPointRequest,
    responseSerialize: serialize_bcsdk_GetOutPointStatusResponse,
    responseDeserialize: deserialize_bcsdk_GetOutPointStatusResponse,
  },
  getTxClaimedBy: {
    path: '/bcsdk.Bc/GetTxClaimedBy',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetOutPointRequest,
    responseType: core_pb.Transaction,
    requestSerialize: serialize_bcsdk_GetOutPointRequest,
    requestDeserialize: deserialize_bcsdk_GetOutPointRequest,
    responseSerialize: serialize_bcsdk_Transaction,
    responseDeserialize: deserialize_bcsdk_Transaction,
  },
  getRawMempool: {
    path: '/bcsdk.Bc/GetRawMempool',
    requestStream: false,
    responseStream: false,
    requestType: core_pb.Null,
    responseType: bc_pb.GetRawMempoolResponse,
    requestSerialize: serialize_bcsdk_Null,
    requestDeserialize: deserialize_bcsdk_Null,
    responseSerialize: serialize_bcsdk_GetRawMempoolResponse,
    responseDeserialize: deserialize_bcsdk_GetRawMempoolResponse,
  },
  getBlockByTx: {
    path: '/bcsdk.Bc/GetBlockByTx',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetTxRequest,
    responseType: core_pb.BcBlock,
    requestSerialize: serialize_bcsdk_GetTxRequest,
    requestDeserialize: deserialize_bcsdk_GetTxRequest,
    responseSerialize: serialize_bcsdk_BcBlock,
    responseDeserialize: deserialize_bcsdk_BcBlock,
  },
  getRoveredBlockForMarkedTx: {
    path: '/bcsdk.Bc/GetRoveredBlockForMarkedTx',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetMarkedTxRequest,
    responseType: core_pb.Block,
    requestSerialize: serialize_bcsdk_GetMarkedTxRequest,
    requestDeserialize: deserialize_bcsdk_GetMarkedTxRequest,
    responseSerialize: serialize_bcsdk_Block,
    responseDeserialize: deserialize_bcsdk_Block,
  },
  help: {
    path: '/bcsdk.Bc/Help',
    requestStream: false,
    responseStream: false,
    requestType: core_pb.Null,
    responseType: bc_pb.HelpResponse,
    requestSerialize: serialize_bcsdk_Null,
    requestDeserialize: deserialize_bcsdk_Null,
    responseSerialize: serialize_bcsdk_HelpResponse,
    responseDeserialize: deserialize_bcsdk_HelpResponse,
  },
  stats: {
    path: '/bcsdk.Bc/Stats',
    requestStream: false,
    responseStream: false,
    requestType: core_pb.Null,
    responseType: bc_pb.StatsResponse,
    requestSerialize: serialize_bcsdk_Null,
    requestDeserialize: deserialize_bcsdk_Null,
    responseSerialize: serialize_bcsdk_StatsResponse,
    responseDeserialize: deserialize_bcsdk_StatsResponse,
  },
  getSettings: {
    path: '/bcsdk.Bc/GetSettings',
    requestStream: false,
    responseStream: false,
    requestType: core_pb.Null,
    responseType: bc_pb.SettingsResponse,
    requestSerialize: serialize_bcsdk_Null,
    requestDeserialize: deserialize_bcsdk_Null,
    responseSerialize: serialize_bcsdk_SettingsResponse,
    responseDeserialize: deserialize_bcsdk_SettingsResponse,
  },
  newTx: {
    path: '/bcsdk.Bc/NewTx',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.RpcTransaction,
    responseType: bc_pb.RpcTransactionResponse,
    requestSerialize: serialize_bcsdk_RpcTransaction,
    requestDeserialize: deserialize_bcsdk_RpcTransaction,
    responseSerialize: serialize_bcsdk_RpcTransactionResponse,
    responseDeserialize: deserialize_bcsdk_RpcTransactionResponse,
  },
  sendTx: {
    path: '/bcsdk.Bc/SendTx',
    requestStream: false,
    responseStream: false,
    requestType: core_pb.Transaction,
    responseType: bc_pb.RpcTransactionResponse,
    requestSerialize: serialize_bcsdk_Transaction,
    requestDeserialize: deserialize_bcsdk_Transaction,
    responseSerialize: serialize_bcsdk_RpcTransactionResponse,
    responseDeserialize: deserialize_bcsdk_RpcTransactionResponse,
  },
  getBalance: {
    path: '/bcsdk.Bc/GetBalance',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetBalanceRequest,
    responseType: bc_pb.GetBalanceResponse,
    requestSerialize: serialize_bcsdk_GetBalanceRequest,
    requestDeserialize: deserialize_bcsdk_GetBalanceRequest,
    responseSerialize: serialize_bcsdk_GetBalanceResponse,
    responseDeserialize: deserialize_bcsdk_GetBalanceResponse,
  },
  getWallet: {
    path: '/bcsdk.Bc/GetWallet',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetBalanceRequest,
    responseType: core_pb.WalletData,
    requestSerialize: serialize_bcsdk_GetBalanceRequest,
    requestDeserialize: deserialize_bcsdk_GetBalanceRequest,
    responseSerialize: serialize_bcsdk_WalletData,
    responseDeserialize: deserialize_bcsdk_WalletData,
  },
  getSpendableOutpoints: {
    path: '/bcsdk.Bc/GetSpendableOutpoints',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetSpendableCollateralRequest,
    responseType: core_pb.WalletData,
    requestSerialize: serialize_bcsdk_GetSpendableCollateralRequest,
    requestDeserialize: deserialize_bcsdk_GetSpendableCollateralRequest,
    responseSerialize: serialize_bcsdk_WalletData,
    responseDeserialize: deserialize_bcsdk_WalletData,
  },
  getSpendableCollateral: {
    path: '/bcsdk.Bc/GetSpendableCollateral',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetSpendableCollateralRequest,
    responseType: bc_pb.GetSpendableCollateralResponse,
    requestSerialize: serialize_bcsdk_GetSpendableCollateralRequest,
    requestDeserialize: deserialize_bcsdk_GetSpendableCollateralRequest,
    responseSerialize: serialize_bcsdk_GetSpendableCollateralResponse,
    responseDeserialize: deserialize_bcsdk_GetSpendableCollateralResponse,
  },
  getUnlockTakerTxParams: {
    path: '/bcsdk.Bc/GetUnlockTakerTxParams',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetUnlockTakerTxParamsRequest,
    responseType: bc_pb.GetUnlockTakerTxParamsResponse,
    requestSerialize: serialize_bcsdk_GetUnlockTakerTxParamsRequest,
    requestDeserialize: deserialize_bcsdk_GetUnlockTakerTxParamsRequest,
    responseSerialize: serialize_bcsdk_GetUnlockTakerTxParamsResponse,
    responseDeserialize: deserialize_bcsdk_GetUnlockTakerTxParamsResponse,
  },
  getTransfers: {
    path: '/bcsdk.Bc/GetTransfers',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.TransferRequest,
    responseType: bc_pb.TransferResponse,
    requestSerialize: serialize_bcsdk_TransferRequest,
    requestDeserialize: deserialize_bcsdk_TransferRequest,
    responseSerialize: serialize_bcsdk_TransferResponse,
    responseDeserialize: deserialize_bcsdk_TransferResponse,
  },
  getOpenOrders: {
    path: '/bcsdk.Bc/GetOpenOrders',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetSpendableCollateralRequest,
    responseType: bc_pb.GetOpenOrdersResponse,
    requestSerialize: serialize_bcsdk_GetSpendableCollateralRequest,
    requestDeserialize: deserialize_bcsdk_GetSpendableCollateralRequest,
    responseSerialize: serialize_bcsdk_GetOpenOrdersResponse,
    responseDeserialize: deserialize_bcsdk_GetOpenOrdersResponse,
  },
  getMatchedOrders: {
    path: '/bcsdk.Bc/GetMatchedOrders',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetSpendableCollateralRequest,
    responseType: bc_pb.GetMatchedOrdersResponse,
    requestSerialize: serialize_bcsdk_GetSpendableCollateralRequest,
    requestDeserialize: deserialize_bcsdk_GetSpendableCollateralRequest,
    responseSerialize: serialize_bcsdk_GetMatchedOrdersResponse,
    responseDeserialize: deserialize_bcsdk_GetMatchedOrdersResponse,
  },
  getHistoricalOrders: {
    path: '/bcsdk.Bc/GetHistoricalOrders',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetHistoryRequest,
    responseType: bc_pb.GetHistoricalOrdersResponse,
    requestSerialize: serialize_bcsdk_GetHistoryRequest,
    requestDeserialize: deserialize_bcsdk_GetHistoryRequest,
    responseSerialize: serialize_bcsdk_GetHistoricalOrdersResponse,
    responseDeserialize: deserialize_bcsdk_GetHistoricalOrdersResponse,
  },
  getUnmatchedOrders: {
    path: '/bcsdk.Bc/GetUnmatchedOrders',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetBalanceRequest,
    responseType: bc_pb.GetOpenOrdersResponse,
    requestSerialize: serialize_bcsdk_GetBalanceRequest,
    requestDeserialize: deserialize_bcsdk_GetBalanceRequest,
    responseSerialize: serialize_bcsdk_GetOpenOrdersResponse,
    responseDeserialize: deserialize_bcsdk_GetOpenOrdersResponse,
  },
  getUTXOLength: {
    path: '/bcsdk.Bc/GetUTXOLength',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetUtxoLengthRequest,
    responseType: bc_pb.GetUtxoLengthResponse,
    requestSerialize: serialize_bcsdk_GetUtxoLengthRequest,
    requestDeserialize: deserialize_bcsdk_GetUtxoLengthRequest,
    responseSerialize: serialize_bcsdk_GetUtxoLengthResponse,
    responseDeserialize: deserialize_bcsdk_GetUtxoLengthResponse,
  },
  getSTXOLength: {
    path: '/bcsdk.Bc/GetSTXOLength',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetUtxoLengthRequest,
    responseType: bc_pb.GetUtxoLengthResponse,
    requestSerialize: serialize_bcsdk_GetUtxoLengthRequest,
    requestDeserialize: deserialize_bcsdk_GetUtxoLengthRequest,
    responseSerialize: serialize_bcsdk_GetUtxoLengthResponse,
    responseDeserialize: deserialize_bcsdk_GetUtxoLengthResponse,
  },
  getBlake2bl: {
    path: '/bcsdk.Bc/GetBlake2bl',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.GetBlake2blRequest,
    responseType: bc_pb.GetBlake2blResponse,
    requestSerialize: serialize_bcsdk_GetBlake2blRequest,
    requestDeserialize: deserialize_bcsdk_GetBlake2blRequest,
    responseSerialize: serialize_bcsdk_GetBlake2blResponse,
    responseDeserialize: deserialize_bcsdk_GetBlake2blResponse,
  },
  getBcAddressViaVanity: {
    path: '/bcsdk.Bc/GetBcAddressViaVanity',
    requestStream: false,
    responseStream: false,
    requestType: bc_pb.VanityConvertRequest,
    responseType: bc_pb.VanityConvertResponse,
    requestSerialize: serialize_bcsdk_VanityConvertRequest,
    requestDeserialize: deserialize_bcsdk_VanityConvertRequest,
    responseSerialize: serialize_bcsdk_VanityConvertResponse,
    responseDeserialize: deserialize_bcsdk_VanityConvertResponse,
  },
  getCurrentWork: {
    path: '/bcsdk.Bc/GetCurrentWork',
    requestStream: false,
    responseStream: false,
    requestType: core_pb.Null,
    responseType: bc_pb.CurrentWork,
    requestSerialize: serialize_bcsdk_Null,
    requestDeserialize: deserialize_bcsdk_Null,
    responseSerialize: serialize_bcsdk_CurrentWork,
    responseDeserialize: deserialize_bcsdk_CurrentWork,
  },
  getSyncStatus: {
    path: '/bcsdk.Bc/GetSyncStatus',
    requestStream: false,
    responseStream: false,
    requestType: core_pb.Null,
    responseType: bc_pb.SyncStatus,
    requestSerialize: serialize_bcsdk_Null,
    requestDeserialize: deserialize_bcsdk_Null,
    responseSerialize: serialize_bcsdk_SyncStatus,
    responseDeserialize: deserialize_bcsdk_SyncStatus,
  },
  getFastSyncStatus: {
    path: '/bcsdk.Bc/GetFastSyncStatus',
    requestStream: false,
    responseStream: false,
    requestType: core_pb.Null,
    responseType: bc_pb.SyncStatus,
    requestSerialize: serialize_bcsdk_Null,
    requestDeserialize: deserialize_bcsdk_Null,
    responseSerialize: serialize_bcsdk_SyncStatus,
    responseDeserialize: deserialize_bcsdk_SyncStatus,
  },
};

exports.BcClient = grpc.makeGenericClientConstructor(BcService);
