'use strict';
// var mongoose = require('mongoose');
// var mongoose = require('../config/config').MONGOOSE_INSTANCE;
// var Schema = mongoose.Schema;

var sessionSchema = new Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  device_id: { type: String },
  token: { type: String },
  expires_at: { type: Date },
  security_code: { type: Number },
  code_expires_at: { type: Date }
});

module.exports = mongoose.model('Session', sessionSchema);
