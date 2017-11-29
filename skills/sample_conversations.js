/*

WHAT IS THIS?

This module demonstrates simple uses of Botkit's conversation system.

In this example, Botkit hears a keyword, then asks a question. Different paths
through the conversation are chosen based on the user's response.

*/
var async = require('async')
var helper = require('../app_util/helpers');
var appMessages = require('../app_util/app_messages');
var coreAPI = require('../services/core_api');
var timesheetService = require('../services/timesheet_service');

module.exports = function(controller) {

    controller.hears(['color'], 'direct_message, direct_mention', function(bot, message) {

        bot.startConversation(message, function(err, convo) {
            convo.say('This is an example of using convo.ask with a single callback.');

            convo.ask('What is your favorite color?', function(response, convo) {

                convo.say('Cool, I like ' + response.text + ' too!');
                convo.next();

            });
        });

    });


    controller.hears(['question'], 'direct_message, direct_mention', function(bot, message) {

        bot.createConversation(message, function(err, convo) {

            // create a path for when a user says YES
            convo.addMessage({
                    text: 'How wonderful.',
            },'yes_thread');

            // create a path for when a user says NO
            // mark the conversation as unsuccessful at the end
            convo.addMessage({
                text: 'Cheese! It is not for everyone.',
                action: 'stop', // this marks the converation as unsuccessful
            },'no_thread');

            // create a path where neither option was matched
            // this message has an action field, which directs botkit to go back to the `default` thread after sending this message.
            convo.addMessage({
                text: 'Sorry I did not understand. Say `yes` or `no`',
                action: 'default',
            },'bad_response');

            // Create a yes/no question in the default thread...
            convo.ask('Do you like cheese?', [
                {
                    pattern:  bot.utterances.yes,
                    callback: function(response, convo) {
                        convo.gotoThread('yes_thread');
                    },
                },
                {
                    pattern:  bot.utterances.no,
                    callback: function(response, convo) {
                        convo.gotoThread('no_thread');
                    },
                },
                {
                    default: true,
                    callback: function(response, convo) {
                        convo.gotoThread('bad_response');
                    },
                }
            ]);

            convo.activate();

            // capture the results of the conversation and see what happened...
            convo.on('end', function(convo) {
                if (convo.successful()) {
                    // this still works to send individual replies...
                    bot.reply(message, 'Let us eat some!');
                    // and now deliver cheese via tcp/ip...
                }
            });
        });
    });

    // controller.hears(['timesheet'], 'direct_message, direct_mention', function(bot, message) {
    //   console.log('=============');
    //   console.log(message.user);
    //   console.log('=============');
    //   bot.startConversation(message, function(err, convo) {
    //     convo.say('Please enter the time sheet details.');
    //     convo.ask('What is your today status?', function(response, convo) {
    //       convo.next();
    //       convo.ask('Please enter your start time and end time', function(response, convo) {
    //         convo.say('Thank you for your response.');
    //         convo.next();
    //       });
    //     });
    //   });
    // });

    controller.hears('timesheet', 'direct_message', function(bot, message) {
      bot.reply(message, {
        text: appMessages.askTimeSheetText,
        attachments:[{
          title: appMessages.askTimeSheetTitle,
          fallback: appMessages.askTimeSheetFallback,
          callback_id: '1111',
          attachment_type: 'default',
          actions: [{
            "name": "days_list",
            "text": appMessages.askTimeSheetActionsText,
            "type": "select",
            "options": [{
              "text": helper.getDate(1) + ' - Monday',
              "value": helper.getDate(1)
            }, {
              "text": helper.getDate(2) + ' - Tuesday',
              "value": helper.getDate(2)
            }, {
              "text": helper.getDate(3) + ' - Wednesday',
              "value": helper.getDate(3)
            }, {
              "text": helper.getDate(4) + ' - Thursday',
              "value": helper.getDate(4)
            }, {
              "text": helper.getDate(5) + ' - Friday',
              "value": helper.getDate(5)
            }, {
              "text": helper.getDate(6) + ' - Saturday',
              "value": helper.getDate(6)
            }, {
              "text": helper.getDate(7) + ' - Sunday',
              "value": helper.getDate(7)
            }],
            "confirm": {
              "title": appMessages.askTimeSheetConfirmTitle,
              "text": appMessages.askTimeSheetConfirmText,
              "ok_text": "Yes",
              "dismiss_text": "No"
            }
          }, {
              "name":"no",
              "text": "No",
              "value": "no",
              "type": "button",
          }]
        }]
      });
    });

    // launch a dialog from a button click
    controller.on('interactive_message_callback', function(bot, trigger) {
      console.log('trigger');
      var token = trigger.token;
      var channel = trigger.channel;
      var ts = trigger.original_message.ts;
      // console.log(trigger);

      // is the name of the clicked button "yes"
      // if (trigger.actions[0].name.match(/^yes/)) {
      if (trigger.actions[0].name.match(/^days_list/)) {
        var date = trigger.actions[0].selected_options[0].value;
        var callback_id_user_date = trigger.user + '_' + date
        console.log(date);
        timesheetService.getDetailById(controller, date, trigger.user, function(resData) {
          if (resData) {
            var dialog = bot.createDialog(
              'Date: ' + date,
              callback_id_user_date,
              'Submit'
            ).addText(appMessages.dialogTextStatus, 'status', resData.status, {placeholder: appMessages.dialogTextStatusPh})
            .addText(appMessages.dialogTextOfficeIn, 'officeIn', resData.officeIn, {optional: true, placeholder: appMessages.dialogTextOfficeInPh})
            .addText(appMessages.dialogTextOfficeOut, 'officeOut', resData.officeOut, {optional: true, placeholder: appMessages.dialogTextOfficeOutPh})
            .addText(appMessages.dialogTextHomeIn, 'homeIn', resData.homeIn, {optional: true, placeholder: appMessages.dialogTextHomeInPh})
            .addText(appMessages.dialogTextHomeOut, 'homeOut', resData.homeOut, {optional: true, placeholder: appMessages.dialogTextHomeOutPh})
          } else {
            var dialog = bot.createDialog(
              'Date: ' + date,
              callback_id_user_date,
              'Submit'
            ).addText(appMessages.dialogTextStatus, 'status', null, {placeholder: appMessages.dialogTextStatusPh})
            .addText(appMessages.dialogTextOfficeIn, 'officeIn', null, {optional: true, placeholder: appMessages.dialogTextOfficeOut})
            .addText(appMessages.dialogTextOfficeIn, 'officeOut', null, {optional: true, placeholder: appMessages.dialogTextOfficeOutPh})
            .addText(appMessages.dialogTextHomeIn, 'homeIn', null, {optional: true, placeholder: appMessages.dialogTextHomeInPh})
            .addText(appMessages.dialogTextHomeOut, 'homeOut', null, {optional: true, placeholder: appMessages.dialogTextHomeOutPh})
          }
          bot.replyWithDialog(trigger, dialog.asObject(), function(err, res) {
            // handle your errors!
            coreAPI.deleteMessage(bot, token, channel, ts);
          });
        });
        // .addSelect('Select','select',null,[{label:'Foo',value:'foo'},{label:'Bar',value:'bar'}],{placeholder: 'Select One'})
        // .addTextarea('Textarea','textarea','some longer text',{placeholder: 'Put words here'});
        // .addUrl('Website','url','http://botkit.ai');
      } else {
        bot.reply(trigger, appMessages.closeTimeSheetFlow);
        coreAPI.deleteMessage(bot, token, channel, ts);
      }
  });

  // handle a dialog submission
  // the values from the form are in event.submission
  controller.on('dialog_submission', function(bot, message) {
    var submission = message.submission;
    var userId = message.user;
    var callback_id = message.callback_id;

    var regex = new RegExp('([0-1][0-9]|2[0-3]):([0-5][0-9])');
    if (submission.officeIn && !regex.test(submission.officeIn)) {
      bot.dialogError({
         "name":"officeIn",
         "error":appMessages.errorOfficeIn
      });
      return;
    } else if (submission.officeOut && !regex.test(submission.officeOut)) {
       bot.dialogError({
         "name":"officeOut",
         "error":appMessages.errorOfficeOut
      });
      return;
    } else if (submission.homeIn && !regex.test(submission.homeIn)) {
       bot.dialogError({
         "name":"homeIn",
         "error":appMessages.errorHomeIn
      });
      return;
    } else if (submission.homeOut && !regex.test(submission.homeOut)) {
       bot.dialogError({
         "name":"homeOut",
         "error":appMessages.errorHomeOut
      });
      return;
    } else {
      var req_hash = submission;
      req_hash['userId'] = userId;
      var arr = callback_id.split('_');
      req_hash['date'] = arr[1];
      console.log(req_hash);

      if (userId == arr[0]) {
        req_hash['dayTotal'] = helper.getDayTotalHours(req_hash);
        req_hash['id'] = req_hash['date'] + ':' + req_hash['userId']
        bot.reply(message, appMessages.closeDialogFlowSuccess);
        // call dialogOk or else Slack will think this is an error
        bot.dialogOk();
        controller.storage.timesheet.save(req_hash);
      } else {
        bot.reply(message, appMessages.closeDialogFlowError);
        bot.dialogOk();
      }
    }
  });

  controller.hears('view', 'direct_message', function(bot, message) {
    var tab_01 = '\t';
    var tab_02 = '\t\t';
    var tab_03 = '\t\t\t';
    var tab_04 = '\t\t\t\t';
    var tab_05 = '\t\t\t\t\t';
    var tab_06 = '\t\t\t\t\t\t';

    var attachmentArray = [{
      "title": 'Date ' + tab_06 + 'IN' + tab_03 + 'OUT' + tab_03 + 'IN' + tab_03 + 'OUT' + tab_03 + 'Total',
      "color": "#3AA3E3",
    }];
    userId = message.user;

    async.series([
      // Get value for day 1.
			function(callback) {
        timesheetService.getTitleText(controller, helper.getDate(1), userId, '#FF0000', function(resData) {
          attachmentArray.push(resData);
          return callback();
        });
			},
      // Get value for day 2.
			function(callback) {
        timesheetService.getTitleText(controller, helper.getDate(2), userId, '#4C9900', function(resData) {
          attachmentArray.push(resData);
          return callback();
        });
			},
      // Get value for day 3.
			function(callback) {
        timesheetService.getTitleText(controller, helper.getDate(3), userId, '#FF9933', function(resData) {
          attachmentArray.push(resData);
          return callback();
        });
			},
      // Get value for day 4.
			function(callback) {
        timesheetService.getTitleText(controller, helper.getDate(4), userId, '#B266FF', function(resData) {
          attachmentArray.push(resData);
          return callback();
        });
			},
      // Get value for day 5.
			function(callback) {
        timesheetService.getTitleText(controller, helper.getDate(5), userId, '#CC6600', function(resData) {
          attachmentArray.push(resData);
          return callback();
        });
			},
      // Get value for day 6.
			function(callback) {
        timesheetService.getTitleText(controller, helper.getDate(6), userId, '#CCCC00', function(resData) {
          attachmentArray.push(resData);
          return callback();
        });
			},
      // Get value for day 7.
			function(callback) {
        timesheetService.getTitleText(controller, helper.getDate(7), userId, '#00CCCC', function(resData) {
          attachmentArray.push(resData);
          return callback();
        });
			},
      // Add close view mode button.
			function(callback) {
        var closeButton = {
          "fallback": appMessages.viewTimeSheetBtnFallback,
          "title": appMessages.viewTimeSheetBtnTitle,
          "callback_id": "3333",
          "color": "#FF66FF",
          "attachment_type": "default",
          "actions": [{
            "name": "yes",
            "text": "Yes",
            "type": "button",
            "value": "yes"
          }]
        }
        attachmentArray.push(closeButton);
        return callback();
      },
      // Send response to user.
			function(callback) {
        bot.reply(message, {
          text: appMessages.viewTimeSheetTitle,
          attachments: attachmentArray
        });
        return callback();
      }
    ], function(err) {
      attachmentArray = null;
      console.log('Error inside controller.hears(view) async()');
      console.log(err);
    })
  });

};
