'use strict';
var sendGrid = require('@sendgrid/mail');
var helper = require('../app_util/helper');

function sendMailTransporter(bot, mailOptions) {
  sendGrid.setApiKey(bot.botkit.config.sendGridKey);

  sendGrid.send(mailOptions, function(error, mailRes) {
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ', mailRes[0].statusCode);
    }
  });
}

// public
var api = {};

api['sendNotificationMail'] = function(bot) {
  var emailIds = bot.botkit.config.healthCheckEmailIds.split(',');
  var mailOptions = {
    from: 'Timesheet Notification <timesheet@newput.com>',
    to: emailIds,
    subject: 'Timesheet Backend Notification Date : ' + helper.getTodayDate(),
    html: 'Backend server is down.'
  };

  sendMailTransporter(bot, mailOptions);
}

module.exports = api;
