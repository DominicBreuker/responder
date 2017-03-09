module.exports = function loadClient(clientToken, developerToken) {
  var request = require('request');
  var uuid = require("uuid");

  var Intent = require("./structs/intent");

  var apiVersion = 'v1';
  var baseUri = 'https://api.api.ai';

  var makeRequest = function(method, endpoint, body) {
    return new Promise(function(fulfull, reject) {
      var options = {
        method: method,
        uri: [baseUri, apiVersion, endpoint].join("/"),
        json: true,
        headers: {
          "Authorization": "Bearer " + developerToken,
          "Content-Type": "application/json; charset=utf-8"
        },
        qs: {
          "v": "20150910"
        }
      }

      if (["POST", "PUT"].indexOf(method) >= 0) {
        options.json = body;
      }

      request(options, function(error, response, body) {
        if ('status' in body && body.status.code >= 400) {
          reject({
            apiAiStatusCode: ('status' in body) ? body.status.code : response.statusCode,
            apiAiError: body
          });
        } else {
          fulfull(body);
        }
      });
    });
  };

  var intentCache = {};

  var client = {
    getIntent: function(id) {
      return new Promise(function(fulfill, reject) {
        var endpoint = ["intents", id].join("/");
        makeRequest('GET', endpoint, null).then(function(success) {
          fulfill(new Intent(success));
        }).catch(function(error) {
          reject(error);
        });
      });
    },

    getIntents: function() {
      return intentCache;
    },

    syncIntents: function() {
      return new Promise(function(fulfill, reject) {
        makeRequest('GET', "intents", null).then(function(success) {
          intentCache = {};
          for (i in success) {
            intentCache[success[i].id] = success[i].name;
          }
          fulfill();
        }).catch(function(error) {
          reject(error);
        });
      });
    },

    createIntent: function(name, action, messages) {
      return new Promise(function(fulfill, reject) {
        var intent = Intent.prototype.createFromMessageList(name, messages).json();
        makeRequest('POST', "intents", intent).then(function(success){
          intentCache[success.id] = intent.name;
          fulfill(success.id);
        }).catch(function(error) {
          reject(error);
        });
      });
    },

    deleteIntent: function(id) {
      return new Promise(function(fulfill, reject) {
        var endpoint = ["intents", id].join("/");
        makeRequest('DELETE', endpoint, null).then(function(success) {
          delete intentCache[id];
          fulfill(id);
        }).catch(function(error) {
          reject(error);
        });
      });
    },

    addMessage(id, message) {
      return new Promise(function(fulfill, reject) {
        var endpoint = ["intents", id].join("/");
        var apiAiMessage = {
          id: uuid.v4(),
          data: [{
              text: message
          }],
          isTemplate: false,
          count: 1
        }

        // first get current intent with all it's messages
        makeRequest('GET', endpoint, null).then(function(apiAiIntent) {
          // remove ID and add message, then update
          delete apiAiIntent["id"];
          apiAiIntent.userSays.push(apiAiMessage);
          makeRequest('PUT', endpoint, apiAiIntent).then(function(success) {
            fulfill(id);
          }).catch(function(error) {
            reject(error);
          });
        }).catch(function(error) {
          reject(error);
        });
      });
    }
  };

  return client;
}
