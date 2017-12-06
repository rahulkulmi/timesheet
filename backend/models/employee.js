'use strict';
// var mongoose = require('mongoose');
var mongoose = require('../app_util/config').MONGOOSE_INSTANCE;
var Schema = mongoose.Schema;

var employeeSchema = new Schema({
  id: { type: String, index: true },
  firstName: { type: String },
  lastName: { type: String },
  fullName: { type: String },
  email: { type: String, index: true },
  password: { type: String, index: true },
  profileImgSmall: { type: String },
  profileImg: { type: String }
});

module.exports = mongoose.model('Employee', employeeSchema, 'employee');
