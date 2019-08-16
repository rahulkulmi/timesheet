'use strict';
var mongoose = require('../app_util/config').MONGOOSE_INSTANCE;
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var companySchema = new Schema({
  companyName: { type: String },
  companyAdd: { type: String },
  cinNumber: { type: String },
  companySeal: { type: String },
  directorSign: { type: String },
  gstin: { type: String }
});

module.exports = mongoose.model('Company', companySchema, 'company');