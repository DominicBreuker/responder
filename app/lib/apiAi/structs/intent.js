var uuid = require("uuid");

var Intent = function(json) {
  this.intent = json
}

var createFromMessageList = function(name, messages) {
  var intent = {
    name: name,
    auto: true,
    contexts: [],
    templates: [],
    userSays: [],
    responses: [{
      resetContexts: false,
      action: name,
      affectedContexts: [],
      parameters: [],
      messages: [{
        type: 0,
        speech: name
      }]
    }],
    priority: 500000
  }

  for (i in messages) {
    intent.userSays.push({
      id: uuid.v4(),
      data: [{
          text: messages[i]
      }],
      isTemplate: false,
      count: 1
    })
  }

  return intent;
}

Intent.prototype = {
  messages: function() {
    return this.intent.userSays.map(function(message) {
      return message.data[0].text;
    });
  },

  json: function() {
    return this.intent;
  },

  createFromMessageList: function(name, messages) {
    return new Intent(createFromMessageList(name, messages));
  }
}

module.exports = Intent;
