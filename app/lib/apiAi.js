module.exports = function load() {
  var client = {
    official: require('apiai')(process.env.API_AI_TOKEN),
    intentManager: require('./apiAi/client')(process.env.API_AI_TOKEN, process.env.API_AI_DEVELOPER_TOKEN)
  };

  return client;
}
