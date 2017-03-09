module.exports = function load(pubSub, intentProvider) {
  var uuid = require("uuid");

  var responses = {};
  intentProvider.getDefaultIntents().then(function(intents) {
    intents.map(function(intent) {
      responses[intent.name] = intent.response;
    });
  });

  return {
    listenAndRespond: function(suggestChannelName, autoResonseChannelName) {
      var suggestChannel = pubSub.channel(suggestChannelName);
      var autoResonseChannel = pubSub.channel(autoResonseChannelName);

      suggestChannel.addCallback(function(message){
        let suggestion = message.message.content;
        if (suggestion in responses) {
          autoResonseChannel.publish({
            version: 'v1',
            uuid: uuid.v4(),
            type: 'AI',
            sender: 'Bot',
            content: responses[suggestion],
            date: (new Date).getTime(),
            lang: 'en',
            conversationId: message.message.conversationId
          });
        }
      });
      suggestChannel.subscribe();
    }
  }
}
