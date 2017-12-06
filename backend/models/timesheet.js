'use strict';
// var mongoose = require('mongoose');
var mongoose = require('../app_util/config').MONGOOSE_INSTANCE;
var Schema = mongoose.Schema;

var timesheetSchema = new Schema({
  id: { type: String },
  userId: { type: String, index: true },
  // userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String },
  date: { type: Date, index: true },
  dateString: { type: String, index: true },
  officeIn: { type: String },
  officeOut: { type: String },
  homeIn: { type: String },
  homeOut: { type: String },
  dayTotal: { type: String }
});

module.exports = mongoose.model('Timesheet', timesheetSchema, 'timesheet');
