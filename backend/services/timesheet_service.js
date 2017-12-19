'use strict';
var Timesheet = require('../models/timesheet');
// var Session = require('../models/session');
var helper = require('../app_util/helpers');

// public
var service = {};

// service['getMonthlyData'] = function(reqData, callback) {
//   try {
//     Timesheet.find({userId: reqData.userId, date: { $gte: reqData.startDate, $lte: reqData.endDate }}, function(err, feedRes) {
//       if (err) return callback(err);
//       if (feedRes) {
//         return callback(null, feedRes);
//       } else {
//         return callback(null, null);
//       }
//     });
//   } catch (err) {
//     return callback(err);
//   }
// };

service['getTimesheetByDate'] = function(reqData, callback) {
  try {
    var query = { userId: reqData.userId, date: {$gte: reqData.formattedStartDate, $lte: reqData.formattedEndDate} };
    var sort = {sort: {date: 1}};
    Timesheet.find(query, null, sort, function(err, feedRes) {
      if (err) return callback(err);
      if (feedRes) {
        return callback(null, feedRes, reqData);
      } else {
        return callback(null, null, null);
      }
    });
  } catch (err) {
    return callback(err);
  }
};

module.exports = service;
