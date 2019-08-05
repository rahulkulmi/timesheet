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
    var CSVData = [];
    uploadSingle(request, res, function(err){
        if(err){
            return callback(err);
        } else {
            fs.createReadStream(request.file.path)
            .pipe(csv())
            .on('data', (data) => {
              try{
                var hasAllKeys = appHelpers.validCSVKeys.every(function (item){
                  return data.hasOwnProperty(item);
                });
                if(hasAllKeys) {
                  CSVData.push(data);
                } else {
                    return callback(appException.INVALID_CSV());
                }
              } catch (err) {
                return callback(err);
              }
            })
            .on('end', () => {
                try {
                    fs.unlink(request.file.path, function(){
                      console.log('file deleted');
                    })
                    var salaryData = [];
                    CSVData.forEach(function(item){
                      Employee.findOne({'email': item.employee_email}, null, null, function(err, response) {
                        if(err) {
                            return callback(err);
                        } else {
                          var row = {
                            employeeFullName: item.employee_fullName,
                            empID: response.id,
                            employeeEmail: item.employee_email,
                            employeeDesignation: item.employee_designation,
                            month: appHelpers.monthsInAYear[item.month - 1].toLowerCase(),
                            year: item.year,
                            basic: item.basic,
                            hra: item.hra,
                            lta: item.lta,
                            advanceBonus: item.advance_bonus,
                            advanceGratuity: item.advance_gratuity,
                            professionalAllowance: item.professional_allowance,
                            grossSalary: item.gross_salary,
                            netSalaryPayable: item.net_salary_payable,
                            professionalTax: item.professional_tax,
                            tds: item.tds,
                            pf: item.pf,
                            totalDeductions: item.total_deductions,
                            bankName: item.bank_name,
                            accountNo: item.account_no,
                            ifscNo: item.ifsc,
                            esic:item.esic,
                            esicNo: item.esic_no,
                            pfUAN: item.pf_UAN
                          }
                          salaryData.push(row);
                        }
                        if(salaryData.length == CSVData.length) {
                          Salarydetail.find({month: appHelpers.monthsInAYear[new Date().getMonth()].toLowerCase(), year: new Date().getFullYear()}, null, {sort: {month: 1, year: 1}}, function(err, resp){
                            if(err) {
                                return callback(appException.INTERNAL_SERVER_ERROR());
                            }else {
                              if(resp.length == 0) {
                                Salarydetail.collection.insertMany(salaryData, null, function(err, resp) {
                                  if(err){
                                    return callback(appException.INTERNAL_SERVER_ERROR())
                                  } else {
                                    return callback(null, resp.ops);
                                  }
                                });
                              }else {
                                Salarydetail.collection.remove({month: salaryData[0].month,  year: salaryData[0].year}, false, function(err, resp){
                                  Salarydetail.collection.insertMany(salaryData, null, function(err, resp) {
                                    if(err){
                                      return callback(appException.INTERNAL_SERVER_ERROR())
                                    } else {
                                      return callback(null, resp.ops);
                                    }
                                  })
                                });
                              }
                            }
                          });
                          
                        }
                      });
                  });
                } catch(e) {
                  return callback(e);
                }
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