module.exports = function load(directory) {
  var fs = require('fs');
  var Promise = require('promise');

  return {
    getDefaultIntents: function() {
      return new Promise(function(fulfill, reject) {
        var intents;
        fs.readFile(directory + '/intents_default.json', 'utf8', function (err, data) {
          if (err) {
            reject(err);
          } else {
            intents = JSON.parse(data);
            fulfill(intents);
          }
        });
      });
    }
  }
}
