'use strict';
var request = require('request');

// public
var api = {};

api['getTitleText'] = function(controller, date, userId, color, cb) {
  var tab_01 = '\t';
  var tab_02 = '\t\t';
  var tab_03 = '\t\t\t';
  var tab_04 = '\t\t\t\t';
  var tab_05 = '\t\t\t\t\t';
  var tab_06 = '\t\t\t\t\t\t';
  var row = {
    "title": "",
    "text": date,
    "color": color
  }
  var dateUserId = date + ':' + userId;
  controller.storage.timesheet.get(dateUserId, function(error, data){
    if (data) {
      row['title'] = data.status;
      var text = date + tab_02;
      if (data.officeIn) {
        text += data.officeIn + tab_02
      } else {
        text += tab_05;
      }
      if (data.officeOut) {
        text += data.officeOut + tab_02
      } else {
        text += tab_04 + ' ';
      }
      if (data.homeIn) {
        text += data.homeIn + tab_02
      } else {
        text += tab_05;
      }
      if (data.homeOut) {
        text += data.homeOut + tab_02
      } else {
        text += tab_04 + ' ';
      }
      text += data.dayTotal;
      row['text'] = text;
    }
    cb(row);
  });
};

api['getDetailById'] = function(controller, date, userId, cb) {
  var resData = null;
  var dateUserId = date + ':' + userId;
  controller.storage.timesheet.get(dateUserId, function(error, data) {
    if (error) {
      console.log('Error inside getTitleText()');
      console.log(error);
    }
    if (data) {
      resData = data;
    }
    cb(resData);
  });
};

module.exports = api;
