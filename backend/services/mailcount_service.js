'use strict';
var Mailcount = require('../models/mailcount');
var helper = require('../app_util/helpers');
var log = require('../app_util/logger');
var emailService = require('./email_service');

// public
var service = {};

service['getTodayMailCount'] = function() {
  var todayDate = helper.getTodayDate();
  var mailcount_hash = {
    id: todayDate + ':Bot',
    date: todayDate,
    server: 'Bot',
    count: 1
  }
  service.getDetailById(mailcount_hash, function(error, mailcountRes) {
    if (error) {
      log.info('Error inside mailcount getDetailById getTodayMailCount()');
      log.info(error);
    }
    if (mailcountRes) {
      mailcount_hash['count'] = mailcountRes.count + 1;
    }
    service.updateDetailById(mailcount_hash, function(error, dataRes) {
      if (error) {
        log.info('Error inside mailcount updateDetailById getTodayMailCount()');
        log.info(error);
      }
      if (dataRes) {
        if (dataRes.count == 4) {
          emailService.sendNotificationMail(function(err, mailRes) {
            if (err) {
              log.info('Error inside mailcount sendNotificationMail()');
              log.info(err);
            } else {
              log.info('Succefully email send to admin.');
            }
          });
        } else {
          log.info('Mail count value : ', dataRes.count);
        }
      } else {
        log.info('Do not find any mailcount data.');
      }
    });
  });
};

service['getDetailById'] = function(reqData, callback) {
  try {
    Mailcount.findOne({ id: reqData.id }, function(err, mailcountRes) {
      if (err) return callback(err);
      if (mailcountRes) {
        return callback(null, mailcountRes);
      } else {
        return callback(null, null);
      }
    });
  } catch (err) {
    return callback(err);
  }
};

service['updateDetailById'] = function(reqData, callback) {
  try {
    var option = { upsert: true, new: true };
    Mailcount.findOneAndUpdate({id: reqData.id}, reqData, option, function(err, mailcountRes) {
      if (err) return callback(err);
      if (mailcountRes) {
        return callback(null, mailcountRes);
      } else {
        return callback(null, null);
      }
    });
  } catch (err) {
    return callback(err);
  }
};

module.exports = service;
