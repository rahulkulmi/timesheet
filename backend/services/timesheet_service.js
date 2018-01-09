'use strict';
var Timesheet = require('../models/timesheet');
var helper = require('../app_util/helpers');

// public
var service = {};

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

service['getTotalHoursByDate'] = function(reqData, callback) {
  try {
    service.getTimesheetByDate(reqData, function(err, dataRes) {
      if (err) return callback(null);
      if (dataRes) {
        return callback(null, helper.calculateTotalHours(dataRes));
      } else {
        // no timesheet found
        console.log('No timesheet found');
        return callback(null, null);
      }
    });
  } catch (err) {
    return callback(err);
  }
};

module.exports = service;
