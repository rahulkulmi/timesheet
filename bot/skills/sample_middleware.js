module.exports = function(controller) {

    controller.middleware.receive.use(function(bot, message, next) {
        // do something...
        // console.log('RCVD: ', message);
        console.log('Inside middleware receive function');
        if (message.type == 'message_deleted') {
          console.log('Delete message response.');
          next();
        } else if (message.type == 'bot_message') {
          console.log('Bot message for cron response.');
          next();
        } else {
          global.start = new Date().getTime();
          global.timeout = setTimeout(function() {
            global.timeout = null;
            var msg = 'This is not related to text event.'
            console.log('RCVD: ', message);
            if (message.event && message.event.text) {
            // if (message.event.text) {
              msg = message.event.text
            }
            var error = new Error('[' + new Date() + '] Request did not respond within 20 seconds. User text message : ' + msg);
            console.log(error);
            process.exit(0);
          }, 20000);
          next();
        }
    });

    controller.middleware.send.use(function(bot, message, next) {
        // do something...
        // console.log('SEND: ', message);
        console.log('Inside middleware send function');
        if (global.timeout) {
          clearTimeout(global.timeout);
          global.timeout = null;
          global.start = null;
          next();
        } else {
          next();
        }
    });

}
