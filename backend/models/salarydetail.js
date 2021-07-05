'use strict';
var mongoose = require('../app_util/config').MONGOOSE_INSTANCE;
var Schema = mongoose.Schema;

var salaryDetailSchema = new Schema({
  employeeFullName: {type: String},
  empID: {type: String},
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
  esic: {type: String},
  esicNo: { type: String },
  pfUAN: { type: String },
});

module.exports = mongoose.model('Salarydetail', salaryDetailSchema, 'salarydetail');