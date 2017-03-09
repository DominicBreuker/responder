module.exports = function load(apiAiClient) {

  var handleError = function(reject, error) {
    console.log("IntentManagementError", error);
    reject({
      intentManagerError: error
    });
  }

  var parseApiAiIntent = function(intent) {
    return {
      name: intent.intent.name,
      action: intent.intent.responses[0].action
    }
  }

  return {
    getIntents: function() {
      return new Promise(function(fulfill, reject) {
        apiAiClient.syncIntents().then(function() {
          fulfill(apiAiClient.getIntents());
        }).catch(function(error) {
          handleError(reject, error);
        });
      });
    },

    getIntent: function(id) {
      return new Promise(function(fulfill, reject) {
        apiAiClient.getIntent(id).then(function(success) {
          fulfill(parseApiAiIntent(success));
        }).catch(function(error) {
          handleError(reject, error);
        });
      });
    },

    createIntent: function(intent) {
      return new Promise(function(fulfill, reject) {
        apiAiClient.createIntent(intent.name, intent.action, null).then(function(intentId) {
          fulfill(intentId);
        }).catch(function(error) {
          handleError(reject, error);
        });
      });
    },

    deleteIntent: function(id) {
      return new Promise(function(fulfill, reject) {
        apiAiClient.deleteIntent(id).then(function(id) {
          fulfill(id);
        }).catch(function(error) {
          handleError(reject, error);
        });
      });
    },

    addMessage: function(intentId, message) {
      return new Promise(function(fulfill, reject) {
        apiAiClient.addMessage(intentId, message).then(function(id) {
          fulfill(id);
        }).catch(function(error) {
          handleError(reject, error);
        });
      });
    }
  }
}
