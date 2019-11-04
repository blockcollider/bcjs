// package: bcsdk
// file: rover.proto

var rover_pb = require("./rover_pb");
var core_pb = require("./core_pb");
var grpc = require("@improbable-eng/grpc-web").grpc;

var Rover = (function () {
  function Rover() {}
  Rover.serviceName = "bcsdk.Rover";
  return Rover;
}());

Rover.Join = {
  methodName: "Join",
  service: Rover,
  requestStream: false,
  responseStream: true,
  requestType: rover_pb.RoverIdent,
  responseType: rover_pb.RoverMessage
};

Rover.CollectBlock = {
  methodName: "CollectBlock",
  service: Rover,
  requestStream: true,
  responseStream: false,
  requestType: core_pb.Block,
  responseType: core_pb.Null
};

Rover.ReportSyncStatus = {
  methodName: "ReportSyncStatus",
  service: Rover,
  requestStream: false,
  responseStream: false,
  requestType: rover_pb.RoverSyncStatus,
  responseType: core_pb.Null
};

Rover.ReportBlockRange = {
  methodName: "ReportBlockRange",
  service: Rover,
  requestStream: false,
  responseStream: false,
  requestType: rover_pb.RoverMessage.RoverBlockRange,
  responseType: core_pb.Null
};

Rover.IsBeforeSettleHeight = {
  methodName: "IsBeforeSettleHeight",
  service: Rover,
  requestStream: false,
  responseStream: false,
  requestType: rover_pb.SettleTxCheckReq,
  responseType: rover_pb.SettleTxCheckResponse
};

exports.Rover = Rover;

function RoverClient(serviceHost, options) {
  this.serviceHost = serviceHost;
  this.options = options || {};
}

RoverClient.prototype.join = function join(requestMessage, metadata) {
  var listeners = {
    data: [],
    end: [],
    status: []
  };
  var client = grpc.invoke(Rover.Join, {
    request: requestMessage,
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport,
    debug: this.options.debug,
    onMessage: function (responseMessage) {
      listeners.data.forEach(function (handler) {
        handler(responseMessage);
      });
    },
    onEnd: function (status, statusMessage, trailers) {
      listeners.status.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners.end.forEach(function (handler) {
        handler({ code: status, details: statusMessage, metadata: trailers });
      });
      listeners = null;
    }
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

RoverClient.prototype.collectBlock = function collectBlock(metadata) {
  var listeners = {
    end: [],
    status: []
  };
  var client = grpc.client(Rover.CollectBlock, {
    host: this.serviceHost,
    metadata: metadata,
    transport: this.options.transport
  });
  client.onEnd(function (status, statusMessage, trailers) {
    listeners.status.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners.end.forEach(function (handler) {
      handler({ code: status, details: statusMessage, metadata: trailers });
    });
    listeners = null;
  });
  return {
    on: function (type, handler) {
      listeners[type].push(handler);
      return this;
    },
    write: function (requestMessage) {
      if (!client.started) {
        client.start(metadata);
      }
      client.send(requestMessage);
      return this;
    },
    end: function () {
      client.finishSend();
    },
    cancel: function () {
      listeners = null;
      client.close();
    }
  };
};

RoverClient.prototype.reportSyncStatus = function reportSyncStatus(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Rover.ReportSyncStatus, {
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

RoverClient.prototype.reportBlockRange = function reportBlockRange(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Rover.ReportBlockRange, {
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

RoverClient.prototype.isBeforeSettleHeight = function isBeforeSettleHeight(requestMessage, metadata, callback) {
  if (arguments.length === 2) {
    callback = arguments[1];
  }
  var client = grpc.unary(Rover.IsBeforeSettleHeight, {
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

exports.RoverClient = RoverClient;

