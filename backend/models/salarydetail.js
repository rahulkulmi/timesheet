'use strict';
var mongoose = require('../app_util/config').MONGOOSE_INSTANCE;
var Schema = mongoose.Schema;

var salaryDetailSchema = new Schema({
  employeeEmail: { type: String, index: true },
  employeeDesignation: { type: String },
  month: { type: String },
  year: { type: String },
  basic: { type: Number },
  hra: { type: Number },
  lta: { type: Number },
  advanceBonus: { type: Number },
  advanceGratuity: { type: Number },
  professionalAllowance: { type: Number },
  grossSalary: { type: Number },
  netSalaryPayable: { type: Number },
  professionalTax: { type: Number },
  tds: { type: Number },
  pf: { type: Number },
  totalDeductions: { type: Number },
  bankName: { type: String },
  accountNo: { type: String },
  ifscNo: { type: String },
  esicNo: { type: Number },
  pfUAN: { type: Number },
});

module.exports = mongoose.model('Salarydetail', salaryDetailSchema, 'salarydetail');