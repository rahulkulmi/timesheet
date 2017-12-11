'use strict';
var mongoose = require('../app_util/config').MONGOOSE_INSTANCE;
var bcrypt = require('bcrypt');
var Schema = mongoose.Schema;

var employeeSchema = new Schema({
  id: { type: String, index: true },
  firstName: { type: String },
  lastName: { type: String },
  fullName: { type: String, index: true },
  email: { type: String, index: true },
  password: { type: String, index: true },
  // hashPassword: { type: String, index: true },
  profileImgSmall: { type: String },
  profileImg: { type: String }
});

employeeSchema.methods.comparePassword = function(password) {
  return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model('Employee', employeeSchema, 'employee');
