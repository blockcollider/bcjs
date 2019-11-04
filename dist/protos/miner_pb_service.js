// package: bcsdk
// file: miner.proto

var miner_pb = require("./miner_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var Miner = (function () {
  function Miner() {}
  Miner.serviceName = "bcsdk.Miner";
  return Miner;
}());

Miner.Mine = {
  methodName: "Mine",
  service: Miner,
  requestStream: false,
  responseStream: false,
  requestType: miner_pb.MinerRequest,
  responseType: miner_pb.MinerResponse
};

exports.Miner = Miner;

function MinerClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

MinerClient.prototype.mine = function mine(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Miner.Mine, {
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

exports.MinerClient = MinerClient;

