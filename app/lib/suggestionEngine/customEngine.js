module.exports = function load() {
  var request = require('request');

  var getSuggestion = function(message) {
    return new Promise(function(fulfull, reject) {
      var options = {
        method: "POST",
        uri: `http://${process.env.INTENT_PORT_5000_TCP_ADDR}:5000/predict`,
        json: true,
        headers: { "Content-Type": "application/json" },
      }

      options.json = { text: message.message.content };

      console.log(JSON.stringify(options));

      request(options, function(error, response, body) {
        if (error) {
          reject({
            customClassifierError: JSON.stringify(error)
          })
        } else if (response.statusCode >= 400) {
          reject({
            customClassifierStatusCode: response.statusCode,
            customClassifierError: body
          });
        } else {
          fulfull(body.prediction);
        }
      });
    });
  };

  return { suggest: getSuggestion }
}
