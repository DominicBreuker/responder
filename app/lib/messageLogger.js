module.exports = function load(pubSub) {
  return {
    subscribe: function(channelName) {
      var channel = pubSub.channel(channelName);
      channel.addCallback(function(message){
        console.log("LOGGER: channel:", channelName, "-", message);
      });
      channel.subscribe();
    }
  }
}
