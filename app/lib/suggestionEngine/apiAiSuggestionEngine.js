module.exports = function load(apiAi, intentProvider) {
  var uuid = require('uuid');

  if (process.env.SETUP_API_AI_INTENTS == "true") {
    intentProvider.getDefaultIntents().then(function(intents) {
      apiAi.intentManager.syncIntents().then(function() {
        var apiAiintents = apiAi.intentManager.getIntents();

        deleteRequests = [];
        for (var intentId in apiAiintents) {
          deleteRequests.push(apiAi.intentManager.deleteIntent(intentId));
        }
        Promise.all(deleteRequests).then(function(success) {
          console.log("all existing intents deleted", success);

          var createRequests = [];
          for (i in intents) {
            createRequests.push(apiAi.intentManager.createIntent(intents[i].name, intents[i].name, intents[i].messages));
          }
          Promise.all(createRequests).then(function(success) {
            console.log("all intents created", success);
          }, function(error) {
            console.log("could no create", error);
          });
        }, function(error) {
          console.log("could not delete", error);
        });
      }, function(error) {
        console.log("could not sync intents", error);
      })
    });
  }

  return {
    suggest: function(message) {
      return new Promise(function(fulfill, reject) {
        var request = apiAi.official.textRequest(message.message.content, {
          sessionId: uuid.v4()
        });

        request.on('response', function(response) {
          if ((response.result !== undefined) && (response.result.action !== undefined)) {
            fulfill(response.result.action);
          } else {
            console.log("INFO: API.ai did not find response for", message.message.content);
          }
        });

        request.on('error', function(error) {
          console.log("ERROR: API.ai suggestor:", error);
          reject(error);
        });

        request.end();
      });
    }
  }
}
