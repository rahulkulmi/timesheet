'use strict';
var mongoose = require('../app_util/config').MONGOOSE_INSTANCE;
var Schema = mongoose.Schema;

var mailcountSchema = new Schema({
  id: { type: String, index: true },
  date: { type: String },
  server: { type: String },
  count: { type: Number }
});

module.exports = mongoose.model('Mailcount', mailcountSchema, 'mailcount');
