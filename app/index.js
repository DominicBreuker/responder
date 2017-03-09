var express = require('express');
var http = require('http');

// ##################
// ###### libs ######
// ##################

var pubNub = require('./lib/pubNub')();
var pubSub = require('./lib/pubSub')(pubNub);
var apiAi = require('./lib/apiAi')();
var intentManager = require('./lib/intentManager')(apiAi.intentManager);

var customerMessageChannelName = process.env.CUSTOMER_MESSAGE_CHANNEL
var suggestionChannelName = process.env.SUGGESTION_CHANNEL
var agentMessageChannelName = process.env.AGENT_MESSAGE_CHANNEL

// log all messages to console
var messageLogger = require('./lib/messageLogger')(pubSub);
messageLogger.subscribe(customerMessageChannelName);
messageLogger.subscribe(suggestionChannelName);
messageLogger.subscribe(agentMessageChannelName);

var intentProvider = require('./lib/intentProvider')('./intents');
var suggestionEngine = require('./lib/suggestionEngine')(apiAi, intentProvider);

var responseSuggestor = require('./lib/responseSuggestor')(pubSub, suggestionEngine);
responseSuggestor.listenAndSuggest(customerMessageChannelName,
                                   suggestionChannelName);

var autoResponder = require("./lib/autoResponder")(pubSub, intentProvider);
autoResponder.listenAndRespond(suggestionChannelName,
                               agentMessageChannelName);

// ########################
// ###### web server ######
// ########################

var app = express();

app.use("/chat", express.static('static'));

var api = express.Router();
require('./api')(api);
app.use('/api/v1', api);

const server = http.createServer(app);
server.listen(process.env.WEBSERVER_PORT, function listening() {
  console.log('SERVER: Listening on %d', server.address().port);
});
