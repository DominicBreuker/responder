module.exports = function auth(app) {

  app.post('/pubNub/auth',
    function(req, res) {
      credentials = {
        publish_key: process.env.PUBNUB_PUBLISH_KEY,
        subscribe_key: process.env.PUBNUB_SUBSCRIBE_KEY,
        customer_channel_name: process.env.CUSTOMER_MESSAGE_CHANNEL,
        agent_channel_name: process.env.AGENT_MESSAGE_CHANNEL
      }
      res.status(200).send(JSON.stringify(credentials));
    }
  );
}
