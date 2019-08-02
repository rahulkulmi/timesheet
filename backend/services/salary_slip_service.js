var multer  =   require('multer');
var path = require('path');
var appException = require('../app_util/exceptions');
var uploadFolderPath = path.resolve('public/uploads');
var Salarydetail = require('../models/salarydetail');
var Employee = require('../models/employee');
var appHelpers = require('../app_util/helpers');
var csv = require('csv-parser')
const fs = require('fs')
var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
      cb(null, uploadFolderPath)
  },
  filename: function (req, file, cb) {
      var datetimestamp = Date.now();
      cb(null, file.fieldname + '-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
  }
});
var uploadSingle = multer({ //multer settings
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname);
    if(ext !== '.csv') {
        return callback(appException.INVALID_FILE_ERROR())
    }
    callback(null, true)
},
}).single('file');

var service = {};

service['uploadSingle'] = function(request, res, callback) {
  try {
    uploadSingle(request, res, function(err){
        if(err){
            return callback(err);
        } else {
            fs.createReadStream(request.file.path)
            .pipe(csv())
            .on('data', (data) => {
              var hasAllKeys = appHelpers.validCSVKeys.every(function (item){
                return data.hasOwnProperty(item);
              });
              if(hasAllKeys) {
                Employee.findOne({'email': data.employee_email}, null, null, function(err, response) {
                  if(err) {
                      return callback(err);
                  }
                  else {
                    Salarydetail.collection.insert({
                      employeeFullName: data.employee_fullName,
                      empID: response.id,
                      employeeEmail: data.employee_email,
                      employeeDesignation: data.employee_designation,
                      month: appHelpers.monthsInAYear[data.month - 1].toLowerCase(),
                      year: data.year,
                      basic: data.basic,
                      hra: data.hra,
                      lta: data.lta,
                      advanceBonus: data.advance_bonus,
                      advanceGratuity: data.advance_gratuity,
                      professionalAllowance: data.professional_allowance,
                      grossSalary: data.gross_salary,
                      netSalaryPayable: data.net_salary_payable,
                      professionalTax: data.professional_tax,
                      tds: data.tds,
                      pf: data.pf,
                      totalDeductions: data.total_deductions,
                      bankName: data.bank_name,
                      accountNo: data.account_no,
                      ifscNo: data.ifsc,
                      esic:data.esic,
                      esicNo: data.esic_no,
                      pfUAN: data.pf_UAN}, function(err, resp){
                          if (err){ 
                              return err;
                          } else {
                           console.log("CSV record inserted", resp);
                          }
                      })
                  } 
                
                })
              } else {
                return callback(appException.INVALID_CSV());
              }
            })
            .on('end', () => {
                fs.unlink(request.file.path, function(){
                    console.log('file deleted');
                })
                Salarydetail.find({month: appHelpers.monthsInAYear[new Date().getMonth()].toLowerCase(), year: new Date().getFullYear()}, null, {sort: {month: 1, year: 1}}, function(err, resp){
                    if(err) {
                        return callback(appException.INTERNAL_SERVER_ERROR());
                    }
                    else {
                        return callback(null, resp)
                    }
                });
            });
            
        }
    })
  } catch (err) {
    return callback(err);
  }
};

service['getEmployeeSalarySlips'] = function(reqData, callback) {
    try {
        Salarydetail.find(reqData, null, {sort: {month: 1, year: 1}}, function(err, resp){
            if(err) {
                return callback(err);
            }
            else {
                return callback(null, resp)
            }
        });
    } catch (err) {
        return callback(err);
    }
};

module.exports = service;