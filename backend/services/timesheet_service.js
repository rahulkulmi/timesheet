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

service['addTimeSheetEntryByDate'] = function(reqData, callback) {
  try {
    var regex = new RegExp('([0-1][0-9]|2[0-9]):([0-5][0-9])');
    var error = new Error('Validation Error');
    if (reqData.officeIn && (!regex.test(reqData.officeIn) || reqData.officeIn.length != 5)) {
      return callback(error);
    } else if (reqData.officeOut && (!regex.test(reqData.officeOut) || reqData.officeOut.length != 5)) {
      return callback(error);
    } else if (reqData.homeIn && (!regex.test(reqData.homeIn) || reqData.homeIn.length != 5)) {
      return callback(error);
    } else if (reqData.homeOut && (!regex.test(reqData.homeOut) || reqData.homeOut.length != 5)) {
      return callback(error);
    } else if (!reqData.dateString || !reqData.userId) {
      return callback(error);
    }

    var options = { upsert: true, new: true }
    var query = { id: reqData.dateString + ':' + reqData.userId }
    var tsHash = {
      id: reqData.dateString + ':' + reqData.userId,
      userId: reqData.userId,
      officeIn: reqData.officeIn,
      officeOut: reqData.officeOut,
      homeIn: reqData.homeIn,
      homeOut: reqData.homeOut,
      dayTotal: helper.getDayTotalHours(reqData),
      status: reqData.status,
      date: helper.getDateByString(reqData.dateString),
      dateString: reqData.dateString
    }

    Timesheet.findOneAndUpdate(query, tsHash, options, function(err, tsRes) {
      if (err) return callback(err);
      if (tsRes) {
        return callback(null, tsRes);
      } else {
        return callback(null, null);
      }
    });
  } catch (err) {
    return callback(err);
  }
};

module.exports = service;
