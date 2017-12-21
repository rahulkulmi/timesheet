'use strict';
var request = require('request');

// public
var api = {};

api['deleteMessage'] = function(bot, token, channel, ts) {
  var messageData = {
    token: token,
    channel: channel,
    ts: ts
  }
  var requestData = {
    uri: bot.botkit.config.slack_root_url + 'chat.delete',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + bot.team_info.token
    },
    json: messageData
  };

  request(requestData, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(response);
      console.log(body);
    } else {
      console.log('Failed calling chat.delete API');
      console.log(error);
      console.log('Failed calling chat.delete API', response.statusCode, response.statusMessage, body.error);
    }
  });
};

api['sendMessage'] = function(bot, channel, text) {
  var messageData = {
    type: 'message',
    token: bot.botkit.config.appToken,
    channel: channel,
    text: text
  }
  var requestData = {
    uri: bot.botkit.config.slack_root_url + 'chat.postMessage',
    method: 'POST',
    headers: {
      'Authorization': 'Bearer ' + bot.botkit.config.appToken
    },
    json: messageData
  };

  request(requestData, function(error, response, body) {
    if (!error && response.statusCode == 200) {
      // console.log(response);
      console.log(body);
    } else {
      console.log('Failed calling chat.postMessage API');
      console.log(error);
      console.log('Failed calling chat.postMessage API', response.statusCode, response.statusMessage, body.error);
    }
  });
};


module.exports = api;
