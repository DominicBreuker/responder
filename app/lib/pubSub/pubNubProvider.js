module.exports = function load(pubNub) {
  const uuid = require('uuid');

  var clientInstanceId = uuid.v4();

  // create a registry for channel-specific callbacks
  var callbacks = function() {
    var channelCallbacks = {};

    return {
      add: function(channelName, callback) {
        if (!(channelName in channelCallbacks)) {
          channelCallbacks[channelName] = [];
        }
        channelCallbacks[channelName].push(callback);
      },

      get: function(channelName) {
        if (!(channelName in channelCallbacks)) {
          return [];
        }
        return channelCallbacks[channelName];
      },

      deleteAll: function(channelName) {
        delete channelCallbacks[channelName];
      }
    }
  }();

  // let pubnub execute all callbacks for a channel on messages
  pubNub.addListener({
    message: function(message) {
      var cbList = callbacks.get(message.channel);
      for (i in cbList) {
        cbList[i](message);
      }
    }
  });


  // create channel-specific management methods
  var channel = function(channelName) {
    return {
      addCallback: function(cb) {
        callbacks.add(channelName, cb);
      },

      subscribe: function() {
        pubNub.subscribe({
          channels: [channelName]
        });
      },

      unsubscribe: function() {
        pubNub.unsubscribe({
          channels: [channelName]
        });
      },

      publish: function(message) {
        pubNub.publish({
          channel: channelName,
          message: message
        });
      },

      history: function(start, count, cb) {
        pubNub.history({
          channel: channelName,
          count: count,
          start: start
        }, function(status, response) {
          var result = {
            start: response.startTimeToken,
            end: response.endTimeToken,
            messages: response.messages
          }
          cb(result);
        })
      }
    }
  }

  var pubSub = {
    channel: channel
  }

  return pubSub;
}
