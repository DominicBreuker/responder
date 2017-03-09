$(document).ready(function() {

  var chatWindow = function() {
    var getRandomName = function() {
      var names = ["Rudi", "Andreas", "Anil", "Dominic"];
      return names[Math.floor(Math.random() * names.length)];
    };

    var senderName = getRandomName();
    document.title = "Chat: " + senderName;
    $('#sender-name').val(senderName);


    $('#sender-name')[0].onchange = function() {
      senderName = $('#sender-name').val();
      document.title = "Chat: " + senderName;
    }

    var send_cb = function(sender, message) {
      console.log("DEFAULT CB called", sender, message);
    }

    $('#send_message')[0].addEventListener('click', function(evt){
      evt.preventDefault();
      send_cb(chatWindow.getSenderName(), chatWindow.getTypedMessage());
      chatWindow.deleteTypedMessage();
    });

    return {
      getSenderName: function() {
        return senderName;
      },

      addMessage: function(msg) {
        var typeCssClass = "unknown-message-type";
        if (msg["type"] == "CUSTOMER") {
          typeCssClass = "customer-message-type";
        } else if (msg["type"] == "AGENT") {
          typeCssClass = "agent-message-type";
        } else if (msg["type"] == "AI") {
          typeCssClass = "ai-message-type";
        }
        $('#messages').append($('<li>')
                              .text(msg["sender"] + ": " + msg["content"])
                              .addClass(typeCssClass)
                              .attr("data-date", msg["date"]));

        $("#messages").html(
          $("#messages").children("li").sort(function(a,b){
            return $(a).data("date") - $(b).data("date");
          })
        );

        $("#messages").scrollTop($("#messages").outerHeight());

      },

      getTypedMessage: function() {
        return $('#m').val();
      },

      deleteTypedMessage: function() {
        $('#m').val('');
      },

      register_send_cb: function(cb) {
        send_cb = cb;
      }
    };
  }();

  var pubNubClient = function() {
    var loadClient = function(publishKey, subscribeKey,
                              customerChannelName, agentChannelName) {

      // load pubnub client
      var authKey = PubNub.generateUUID();
      var clientId = PubNub.generateUUID();

      var pubNub = new PubNub({
        authKey: authKey,
        uuid: PubNub.generateUUID(),
        subscribeKey: publishKey,
        publishKey: subscribeKey,
        ssl: true
      });

      // add listener for messages and subscribe
      pubNub.addListener({
        message: function(msg) {
          console.log("MSG received", msg);
          chatWindow.addMessage(msg.message);
        }
      });

      var subscribe = function(channelName) {
        pubNub.subscribe({
          channels: [channelName]
        });

        pubNub.history({
          channel: channelName,
          count: 10
        }, function(status, response){
          console.log("HISTORY", response);
          if (response !== undefined && response.messages !== undefined) {
            var messages = response.messages;
            for (var i = 0 ; i < messages.length ; i++) {
              var message = messages[i].entry;
              if (message != undefined) {
                chatWindow.addMessage(message);
              }
            }
          }
        });
      };

      subscribe(customerChannelName);
      subscribe(agentChannelName);

      // add message publisher and register for send key
      function create_UUID(){
        var dt = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
          var r = (dt + Math.random()*16)%16 | 0;
          dt = Math.floor(dt/16);
          return (c=='x' ? r :(r&0x3|0x8)).toString(16);
        });
        return uuid;
      }


      var sendMessage = function(sender, msg) {
        pubNub.publish({
          channel: customerChannelName,
          message: {
            version: 'v1',
            uuid: create_UUID(),
            type: 'CUSTOMER',
            sender: sender,
            content: msg,
            date: (new Date).getTime(),
            lang: 'en'
          }
        });
      };

      chatWindow.register_send_cb(sendMessage);
    }

    // get credentials and load pubNub client
    var baseAddress = location.protocol + '//' + location.hostname + (location.port ? ':'+location.port: '');
    $.ajax({
      url: baseAddress + "/api/v1/pubNub/auth",
      type: 'POST',
      success: function(credentials) {
        credentials = JSON.parse(credentials);
        loadClient(credentials.subscribe_key,
                   credentials.publish_key,
                   credentials.customer_channel_name,
                   credentials.agent_channel_name
                 );
      }
    });
  }();
});
