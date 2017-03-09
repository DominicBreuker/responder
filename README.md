# Responder service

Provides a chat interface and pipes requests to a suggestion engine
- API.ai
- custom backend

## How to use

You need an [API.ai](https://api.ai/) and [PubNub](https://www.pubnub.com/) account.

Create the following file: `secrets/env`
```
PUBNUB_PUBLISH_KEY=...
PUBNUB_SUBSCRIBE_KEY=...
API_AI_TOKEN=...
API_AI_DEVELOPER_TOKEN=...
SETUP_API_AI_INTENTS=false
CUSTOMER_MESSAGE_CHANNEL=CUSTOMER_MESSAGES
SUGGESTION_CHANNEL=SUGGESTIONS
AGENT_MESSAGE_CHANNEL=AGENT_REPLIES
WEBSERVER_PORT=8888
```

Get the secrets out of your account and put them there.

If you set `SETUP_API_AI_INTENTS=true`, the service will read `app/intents/intents_default.json` on startup. It will create these intents in API.ai.

Run the service with `bin/run.sh`. You must have Docker installed.
