factory(function(factory){
  factory.register(true, function eventHandler(cache) {
      this.publish = function(data1, data2, data3, _callback, context) {
        var _Id = _callback.prototype.constructor.name
        cache.get(_Id, function(subscription) {
          var callContext = subscription.context || context;
          if (callContext){
            subscription.callback.call(callContext, data1, data2, data3);
          }else{
            subscription.callback(data1, data2, data3);
          }
            
        }, function() {
          console.log("WARNING: published " + _Id + " without any subscribers.");
        });
      };

      this.subscribe = function(_callback, context) {
        var msg = "the callback function requires a function name";
        var _Id = _callback.prototype.constructor.name
        if (!_Id) {
          throw msg;
        }
        console.log("subscribed to " + _Id);
        cache.get(_Id, function() {
          throw "already subscribed to " + _Id;
        }, function() {
          cache.set(_Id, {
            callback: _callback,
            context: context
          });
        });
      };

      this.unsubscribe = function(func) {
        var _Id = func.prototype.constructor.name
        cache.remove(_Id);
      };

      this.reset = function() {
      };
  }, function error(err) {});
});