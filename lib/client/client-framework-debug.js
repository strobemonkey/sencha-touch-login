var Messaging = (function() {
  var devKey;
  var clientId;
  var serverUrl;
  var listeners = {}; // response listeners


  return {
    setOptions : function(options) {
      this.devKey = options.key;
      this.serverUrl = options.url;
      this.clientId = Naming.getClientId();

      // we are use polling transport
      PollingTransport.setDuration(1000);
      PollingTransport.start();
    }
    ,
    setDeveloperKey : function(devKey) {
      this.devKey = devKey;
    }
    ,
    getDeveloperKey : function() {
      return this.devKey;
    }
    ,
    setClientId : function(clientId) {
      this.clientId = clientId;
    }
    ,
    getClientId : function() {
      return this.clientId;
    }
    ,
    setServerUrl : function(serverUrl) {
      this.serverUrl = serverUrl;
    }
    ,
    getServerUrl : function() {
      return this.serverUrl;
    }
    ,
    setListener : function(serviceName, listener) {
      console.log("Messaging set listener for " + serviceName);
      listeners[serviceName] = listener;
    }
    ,
    removeListener : function(serviceName) {
      delete listeners[serviceName];
    }
    ,
    sendToService : function(serviceName, payload, callbackFunction) {
      this.send({service: serviceName, msg: payload}, callbackFunction)
    }
    ,
    sendToClient : function(targetClientId, payload, callbackFunction) {
      this.send({to: targetClientId, service: "courier", msg: payload}, callbackFunction);
    }
    ,
    // Send an envelope to the server
    send : function(envelope, callbackFunction) {
      var self = this;

      envelope.from = self.clientId;

      console.log("Messaging.send " + JSON.stringify(envelope));

      // actual send
			Ext.Ajax.request({
				method: "POST",
				url: self.serverUrl + "/send",
				params: { key: self.devKey },
				jsonData: envelope,
				scope: self,
        success: function(response) {
          callbackFunction();
        },
        failure: function(response) {
          callbackFunction('error');
        }
			});
    }
    ,
    // Handle an incoming envelope (either polling or Socket.IO)
    receive : function(envelope) {
      console.log("Messaging.receive " + JSON.stringify(envelope));

      // dispatch it to the correct service listener
      if(listeners[envelope.service]) {
        listeners[envelope.service](envelope); // pass to the listener
      } else {
        console.log("No listener for " + envelope.service);
      }
    }
    ,
    subscribe : function(serviceName, callbackFunction) {
      var self = this;

      console.log("Messaging.subscribe " + serviceName);

			Ext.Ajax.request({
				method: "POST",
				url: self.serverUrl + "/subscribe",
				params: { key: self.devKey, client_id: self.clientId, service: serviceName },
				jsonData: {},
				scope: self,
        success: function(response) {
          callbackFunction();
        },
        failure: function(response) {
          callbackFunction('error');
        }
			});
    }
    ,
    unsubscribe : function(serviceName, callbackFunction) {
      var self = this;

      console.log("Messaging.unsubscribe " + serviceName);

			Ext.Ajax.request({
				method: "POST",
				url: self.serverUrl + "/unsubscribe",
				params: { key: self.devKey, client_id: self.clientId, service: serviceName },
				jsonData: {},
				scope: self,
        success: function(response) {
          callbackFunction();
        },
        failure: function(response) {
          callbackFunction('error');
        }
			});
    }
  }
})();


var Rpc = (function() {
  // member variables
  var currentCallId = 0;
  var callMap = {};

  // private methods
  var generateCallId = function() {
    return ++currentCallId;
  };

  var corelate = function(corrId, callback) {
    callMap[corrId] = callback;
  };

  var dispatch = function(envelope, callbackFunction) {
    var corrId = generateCallId();
    envelope.msg["corr-id"] = corrId;
    envelope.from = Messaging.getClientId();

    // send the envelope
    Messaging.send(envelope, function() {
      corelate(corrId, callbackFunction);
    });
  };

  var callback = function(corrId, envelope) {
    corrId = parseInt(corrId);
    if (!callMap[corrId]) {
      console.log("Error, no associated call with this envelope available: " + corrId);
    } else {
      callMap[corrId](envelope.msg.result);
      delete callMap[corrId];
    }
  };

  var subscribe = function(envelope) {
    // got a response envelope, now handle it
    callback(envelope.msg["corr-id"], envelope);
  };

  // register for rpc-direct receive calls
  Messaging.setListener("rpc", subscribe);

  // public methods
  return {
    call : function(callbackFunction, serviceName, style, method, args) {
      Messaging.setListener(serviceName, subscribe);
      if(style == 'subscriber') {
        var envelope = {service: serviceName, from: Messaging.getClientId(), msg: {method: method, args: args}};
        dispatch(envelope, callbackFunction);
      } else if(style == 'direct') {
        var envelope = {service: 'rpc', from: Messaging.getClientId(), msg: {service: serviceName, method: method, args: args}};
        dispatch(envelope, callbackFunction);
      } else {
        throw "Invalid RPC style: " + style;
      }
    }
  }
})();


var Proxy = function(name, descriptor) {
  this.name = name;
  this.descriptor = descriptor;

  if(this.descriptor.kind != 'rpc') {
    throw "Error, proxy does not support non-rpc calls";
  }

  this._createMethodProxies();
}

Proxy.prototype._createMethodProxies = function() {
  var self = this;
  for(var i = 0; i < this.descriptor.methods.length; i++) {
    var methodName = this.descriptor.methods[i];
    self[methodName] = self._createMethodProxy(methodName);
  }
}

Proxy.prototype._createMethodProxy = function(methodName) {
  var self = this;

  return function() {
    arguments.slice = Array.prototype.slice;
    var serviceArguments = arguments.slice(0);
    var style = self.descriptor.style[0];
    if(self.descriptor.style.indexOf("subscriber") > 0) {
      style = "subscriber"; // prefer subscriber style if available
    }

    Rpc.call(serviceArguments[0], self.name, style, methodName, serviceArguments.slice(1));
  }
}


var Naming = (function() {

  var generateClientId = function() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  var getClientIdFromLocalStorage = function() {
    var clientId = null;

    try {
      if('localStorage' in window && window['localStorage'] !== null) {
        clientId = window.localStorage["clientId"];
      }
    } catch(e) {
      clientId = null;
    }

    return clientId;
  }

  var storeClientIdInLocalStorage = function(clientId) {
    window.localStorage["clientId"] = clientId;
  }


  return {
    // get a client ID
    getClientId : function() {
      var clientId = getClientIdFromLocalStorage();
      if(!clientId) {
        clientId = generateClientId();
        storeClientIdInLocalStorage(clientId);
      }

      return clientId;
    }
    ,
    // get a service descriptor
    getServiceDescriptor : function(serviceName, callbackFunction) {
      if(serviceName == "naming-rpc") {
        callbackFunction({
          kind: "rpc",
          style: ["direct"],
          access: ["clients"],
          depends: ["messaging", "naming"],
          methods: ["getServiceDescriptor"]
        });
      } else {
        Service.get("naming-rpc", function(namingRpc) {
          namingRpc.getServiceDescriptor(
            function(result) {
              if(result.status == "success") {
                callbackFunction(result.value);
              } else {
                callbackFunction(null);
              }
            }, serviceName);
        });
      }
    }
  };
})();


var Service = (function() {
  var proxyCache = {};

  return {
    // get a service proxy
    get : function(serviceName, callbackFunction) {
      var service = proxyCache[serviceName];
      if(service) {
        callbackFunction(service);
      } else {
        Naming.getServiceDescriptor(serviceName, function(serviceDescriptor) {
          if(serviceDescriptor == null) {
            callbackFunction(null);
          } else {
            service = new Proxy(serviceName, serviceDescriptor);
            proxyCache[serviceName] = service;
            callbackFunction(service);
          }
        });
      }
    }
  }
})();


// HTTP polling based receive
var PollingTransport = (function() {
  var intervalId;
  var pollDuration = 5 * 1000; // 5 secs

  // public methods
  return {
    setDuration : function(duration) {
      pollDuration = duration;
    }
    ,
    start : function() {
      var self = this;

      intervalId = setInterval(function() {
        console.log("PollingTransport requesting...");
        Ext.Ajax.request({
		      method: "POST",
		      url: Messaging.getServerUrl() + "/receive",
		      params: {key: Messaging.getDeveloperKey(), client_id: Messaging.getClientId()},
		      jsonData: {},
		      scope: self,
          success: function(response){
            console.log("PollingTransport response: " + response.responseText);
            var envelope = Ext.decode(response.responseText);
            if(envelope !== null) {
              Messaging.receive(envelope);
            }
          },
          failure: function(response) {
            console.log('PollingTransport error on receive: ' + response.status);
          }
	      });
      }, pollDuration);
    }
    ,
    stop : function() {
      clearInterval(intervalId);
    }
  }
})();


// Socket.IO based receive
var SocketIoTransport = (function() {


})();




