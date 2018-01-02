'use strict';
var helper = require('../app_util/helper');

// public
var api = {};

api['getTodayMailCount'] = function(controller, cb) {
  var resData = null;
  var todayDate = helper.getTodayDate();
  var mailcount_hash = {
    id: todayDate + ':Backend',
    date: todayDate,
    server: 'Backend',
    count: 1
  }
  controller.storage.mailcount.get(todayDate, function(error, data) {
    if (error) {
      console.log('Error inside mailcount get getTodayMailCount()');
      console.log(error);
    }
    if (data) {
      mailcount_hash['count'] = data.count + 1;
    }
    controller.storage.mailcount.save(mailcount_hash, function(error, data) {
      if (error) {
        console.log('Error inside mailcount save getTodayMailCount()');
        console.log(error);
      }
      if (data) {
        resData = data;
      }
      cb(resData);
    });
  });
};

module.exports = api;
