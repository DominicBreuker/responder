module.exports = function load(pubSub, suggestor) {
  var uuid = require("uuid");

  return {
    listenAndSuggest: function(listenChannelName, suggestChannelName) {
      var listenChannel = pubSub.channel(listenChannelName);
      var suggestChannel = pubSub.channel(suggestChannelName);

      listenChannel.addCallback(function(message){
        suggestor.suggest(message).then(function(suggestion) {
          suggestChannel.publish({
            version: 'v1',
            uuid: uuid.v4(),
            type: 'AI',
            sender: 'thoth',
            content: suggestion,
            date: (new Date).getTime(),
            lang: 'en',
            conversationId: message.message.conversationId
          });
        }, function(error) { console.log("SUGGESTION ERROR", error); });
      });
      listenChannel.subscribe();
    }
  }
}
