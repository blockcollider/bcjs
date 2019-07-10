// package: bc
// file: bc.proto

var bc_pb = require("./bc_pb");
var core_pb = require("./core_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var Bc = (function () {
  function Bc() {}
  Bc.serviceName = "bc.Bc";
  return Bc;
}());

Bc.GetLatestBlocks = {
  methodName: "GetLatestBlocks",
  service: Bc,
  requestStream: false,
  responseStream: false,
  requestType: core_pb.Null,
  responseType: bc_pb.GetLatestBlocksResponse
};

Bc.Help = {
  methodName: "Help",
  service: Bc,
  requestStream: false,
  responseStream: false,
  requestType: core_pb.Null,
  responseType: bc_pb.HelpResponse
};

Bc.Stats = {
  methodName: "Stats",
  service: Bc,
  requestStream: false,
  responseStream: false,
  requestType: core_pb.Null,
  responseType: bc_pb.StatsResponse
};

Bc.NewTx = {
  methodName: "NewTx",
  service: Bc,
  requestStream: false,
  responseStream: false,
  requestType: bc_pb.RpcTransaction,
  responseType: bc_pb.RpcTransactionResponse
};

Bc.GetBalance = {
  methodName: "GetBalance",
  service: Bc,
  requestStream: false,
  responseStream: false,
  requestType: bc_pb.GetBalanceRequest,
  responseType: bc_pb.GetBalanceResponse
};

Bc.GetSpendableCollateral = {
  methodName: "GetSpendableCollateral",
  service: Bc,
  requestStream: false,
  responseStream: false,
  requestType: bc_pb.GetSpendableCollateralRequest,
  responseType: bc_pb.GetSpendableCollateralResponse
};

Bc.UnlockCollateral = {
  methodName: "UnlockCollateral",
  service: Bc,
  requestStream: false,
  responseStream: false,
  requestType: bc_pb.UnlockCollateralRequest,
  responseType: bc_pb.RpcTransactionResponse
};

Bc.PlaceMakerOrder = {
  methodName: "PlaceMakerOrder",
  service: Bc,
  requestStream: false,
  responseStream: false,
  requestType: bc_pb.PlaceMakerOrderRequest,
  responseType: bc_pb.RpcTransactionResponse
};

Bc.PlaceTakerOrder = {
  methodName: "PlaceTakerOrder",
  service: Bc,
  requestStream: false,
  responseStream: false,
  requestType: bc_pb.PlaceTakerOrderRequest,
  responseType: bc_pb.RpcTransactionResponse
};

Bc.PlaceTakerOrders = {
  methodName: "PlaceTakerOrders",
  service: Bc,
  requestStream: false,
  responseStream: false,
  requestType: bc_pb.PlaceTakerOrdersRequest,
  responseType: bc_pb.RpcTransactionResponse
};

Bc.CalculateMakerFee = {
  methodName: "CalculateMakerFee",
  service: Bc,
  requestStream: false,
  responseStream: false,
  requestType: bc_pb.CalculateMakerFeeRequest,
  responseType: bc_pb.FeeResponse
};

Bc.CalculateTakerFee = {
  methodName: "CalculateTakerFee",
  service: Bc,
  requestStream: false,
  responseStream: false,
  requestType: bc_pb.CalculateTakerFeeRequest,
  responseType: bc_pb.FeeResponse
};

Bc.GetOpenOrders = {
  methodName: "GetOpenOrders",
  service: Bc,
  requestStream: false,
  responseStream: false,
  requestType: core_pb.Null,
  responseType: bc_pb.GetOpenOrdersResponse
};

Bc.GetMatchedOrders = {
  methodName: "GetMatchedOrders",
  service: Bc,
  requestStream: false,
  responseStream: false,
  requestType: bc_pb.GetMatchedOrdersRequest,
  responseType: bc_pb.GetMatchedOrdersResponse
};

Bc.GetBlake2bl = {
  methodName: "GetBlake2bl",
  service: Bc,
  requestStream: false,
  responseStream: false,
  requestType: bc_pb.GetBlake2blRequest,
  responseType: bc_pb.GetBlake2blResponse
};

Bc.GetBcAddressViaVanity = {
  methodName: "GetBcAddressViaVanity",
  service: Bc,
  requestStream: false,
  responseStream: false,
  requestType: bc_pb.VanityConvertRequest,
  responseType: bc_pb.VanityConvertResponse
};

exports.Bc = Bc;

function BcClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

BcClient.prototype.getLatestBlocks = function getLatestBlocks(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Bc.GetLatestBlocks, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

BcClient.prototype.help = function help(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Bc.Help, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

BcClient.prototype.stats = function stats(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Bc.Stats, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

BcClient.prototype.newTx = function newTx(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Bc.NewTx, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

BcClient.prototype.getBalance = function getBalance(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Bc.GetBalance, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

BcClient.prototype.getSpendableCollateral = function getSpendableCollateral(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Bc.GetSpendableCollateral, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

BcClient.prototype.unlockCollateral = function unlockCollateral(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Bc.UnlockCollateral, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

BcClient.prototype.placeMakerOrder = function placeMakerOrder(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Bc.PlaceMakerOrder, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

BcClient.prototype.placeTakerOrder = function placeTakerOrder(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Bc.PlaceTakerOrder, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

BcClient.prototype.placeTakerOrders = function placeTakerOrders(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Bc.PlaceTakerOrders, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

BcClient.prototype.calculateMakerFee = function calculateMakerFee(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Bc.CalculateMakerFee, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

BcClient.prototype.calculateTakerFee = function calculateTakerFee(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Bc.CalculateTakerFee, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

BcClient.prototype.getOpenOrders = function getOpenOrders(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Bc.GetOpenOrders, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

BcClient.prototype.getMatchedOrders = function getMatchedOrders(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Bc.GetMatchedOrders, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

BcClient.prototype.getBlake2bl = function getBlake2bl(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Bc.GetBlake2bl, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

BcClient.prototype.getBcAddressViaVanity = function getBcAddressViaVanity(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Bc.GetBcAddressViaVanity, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onEnd: function (response) {
      if (callback) {
        if (response.status !== grpc.Code.OK) {
          var err = new Error(response.statusMessage);
          err.code = response.status;
          err.metadata = response.trailers;
          callback(err, null);
        } else {
          callback(null, response.message);
        }
      }
    }
  });
  return {
    cancel: function () {
      callback = null;
      client.close();
    }
  };
};

exports.BcClient = BcClient;

