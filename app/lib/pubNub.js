module.exports = function load() {
  var PubNub = require('pubnub')
  var randomAuthKey = PubNub.generateUUID();

  var pubNub = new PubNub({
    authKey: randomAuthKey,
    publishKey : process.env.PUBNUB_PUBLISH_KEY,
    subscribeKey : process.env.PUBNUB_SUBSCRIBE_KEY,
    ssl: true
  });

  return pubNub;
}
