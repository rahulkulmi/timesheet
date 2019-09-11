var multer  =   require('multer');
var path = require('path');
var mustacheExpress = require('mustache')
var csv = require('csv-parser')
var underscore = require('underscore');
var fs = require('fs');
var pdf = require('html-pdf');
var uploadFolderPath = path.resolve('public/');
var Salarydetail = require('../models/salarydetail');
var Employee = require('../models/employee');
var appException = require('../app_util/exceptions');
var appHelpers = require('../app_util/helpers');
var emailService = require('./email_service');
var companyService = require('./company_service');


var salaryItemsInfo = [
  {employeeFullName: "Employee Name"}, {employeeDesignation: "Designation"} , 
  {basic: "Basic"} , {professionalTax: "Prof Tax"} ,
  {hra: "HRA"}, {tds: "TDS"}, {lta: "LTA"}, 
  {esic: "ESIC"}, {advanceBonus: "Advance Bonus"} ,
  {pf: "PF"} , {advanceGratuity: "Advance Gratuity"} , {} , 
  {professionalAllowance: "Professional Allowance"}, {} ,
  {grossSalary: "Gross Salary"} , {totalDeductions: "Total Deductions"} ,
  {netSalaryPayable: "Net Salary Payable", isHeading: true} , 
  {bankName: "Bank"} , {accountNo: "Account No"} , 
  {ifscNo: "IFSC"} , {esicNo: "ESIC No"} , {pfUAN: "PF UAN"}
];

var storage = multer.diskStorage({ //multers disk storage settings
  destination: function (req, file, cb) {
      cb(null, uploadFolderPath)
  },
  filename: function (req, file, cb) {
      var datetimestamp = Date.now();
      cb(null, 'salary-slip-' + datetimestamp + '.' + file.originalname.split('.')[file.originalname.split('.').length -1])
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
        if(err) {
            return callback(err);
        } else {
            fs.createReadStream(request.file.path)
            .pipe(csv())
            .on('data', (data) => {
              try {
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
                      console.log('file deleted ', request.file.path);
                    })
                    var salaryData = [];
                    var emailsNotFound = [];
                    CSVData.forEach(function(item){
                      Employee.findOne({'email': item.employee_email}, null, null, function(err, response) {
                        if(err) {
                            return callback(err);
                        } else {
                          if(response == null) {
                            emailsNotFound.push(item.employee_email);
                            if(emailsNotFound.length == CSVData.length) {
                              Salarydetail.find({month: item.month, year: item.year}, null, {sort: {month: 1, year: 1}}, function(err, salaries){
                                if(err) {
                                  return callback(appException.INTERNAL_SERVER_ERROR());
                                } else {
                                  if(salaries.length == 0) {
                                    return callback(null, {'employeeData': [], 'invalidEmails': emailsNotFound});
                                  } else {
                                    return callback(null, {'employeeData': underscore.sortBy( salaries, 'employeeFullName'), 'invalidEmails': emailsNotFound});
                                  }
                                }
                              });
                            }
                          } else {
                            var row = {
                              employeeFullName: response.fullName,
                              empID: response.id,
                              employeeEmail: item.employee_email,
                              employeeDesignation: item.employee_designation,
                              month: item.month,
                              year: item.year,
                              basic: parseFloat(item.basic),
                              hra: parseFloat(item.hra),
                              lta: parseFloat(item.lta),
                              advanceBonus: parseFloat(item.advance_bonus),
                              advanceGratuity: parseFloat(item.advance_gratuity),
                              professionalAllowance: parseFloat(item.professional_allowance),
                              grossSalary: parseFloat(item.gross_salary),
                              netSalaryPayable: parseFloat(item.net_salary_payable),
                              professionalTax: parseFloat(item.professional_tax),
                              tds: parseFloat(item.tds),
                              pf: parseFloat(item.pf),
                              totalDeductions: parseFloat(item.total_deductions),
                              bankName: item.bank_name,
                              accountNo: item.account_no,
                              ifscNo: item.ifsc,
                              esic:item.esic,
                              esicNo: item.esic_no,
                              pfUAN: item.pf_UAN
                            }
                            Salarydetail.collection.findOneAndUpdate({month: row.month, year: row.year, employeeEmail: row.employeeEmail}, row, {upsert: true}, function(err, response) {
                              if(err) {
                                return callback(appException.INTERNAL_SERVER_ERROR());
                              } else {
                                salaryData.push(row);
                                if((salaryData.length + emailsNotFound.length) == CSVData.length) {
                                  Salarydetail.find({month: row.month, year: row.year}, null, {sort: {month: 1, year: 1}}, function(err, salaries){
                                    if(err) {
                                      return callback(appException.INTERNAL_SERVER_ERROR());
                                    } else {
                                      if(salaries.length == 0) {
                                        return callback(null, {'employeeData': [], 'invalidEmails': emailsNotFound});
                                      } else {
                                        return callback(null, {'employeeData': underscore.sortBy( salaries, 'employeeFullName'), 'invalidEmails': emailsNotFound});
                                      }
                                    }
                                  });
                                }
                              }
                            });
                          } 
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
        Salarydetail.find(reqData, null, {sort: {year: -1, month: -1}}, function(err, resp){
            if(err) {
                return callback(err);
            } else {
                return callback(null, resp)
            }
        });
    } catch (err) {
        return callback(err);
    }
};

service['generatePDfSendEmail'] = function(reqData, callback) {
  try {
    var query;
    if(reqData.empEmails){
      query = {month: reqData.month, year: reqData.year, employeeEmail: { $in: reqData.empEmails.split(',')}}
    } else {
      query = {month: reqData.month, year: reqData.year}
    }
    
    Salarydetail.find(query, null, {sort: {month: 1, year: 1}}, function(err, data){
      if(err) {
          return callback(appException.INTERNAL_SERVER_ERROR());
      } else {
        fs.readFile(path.resolve('template/salaryslip.html'), "utf8", function (error, pgResp) {
          if (error) {
              return callback(error)
          } else {
            if(data.length > 0) {
              if (!fs.existsSync(path.join(__dirname, '../salary-slips/' + data[0].month + '-' + data[0].year + '/'))){
                fs.mkdirSync(path.join(__dirname, '../salary-slips/' + data[0].month + '-' + data[0].year + '/'));
              }
              companyService.getDetail(function(err, companyData){
                if(err){
                  return callback(err);
                } else {
                  data.forEach(element => {
                    loadTemplateAndPrepareData(reqData, element, pgResp, companyData, function(err, resp){
                      if(err) {
                        return callback(err);
                      } else{
                        return callback(null, resp);
                      }
                      
                    });
                  });
                }
              });
              return callback(null, {message: 'We are processing your request.'});
            } else {
              return callback(null, appException.RECORD_NOT_FOUND());
            }
            
          }
      });
      }
  });
  } catch (err) {
      return callback(err);
  }
};

function loadTemplateAndPrepareData(reqData, data, template, compData, callback) {
    var salaryDisplayItems = [];
    for (var i = 0; i < salaryItemsInfo.length; i++) {
        var itemInfo = salaryItemsInfo[i];
        var itemkey = Object.keys(itemInfo)[0];
        salaryDisplayItems.push({
          itemLabel: itemInfo[itemkey],
          itemValue: ((itemkey == 'esicNo' || itemkey == 'pfUAN') && !convertAmount(data[itemkey])) ? 'Not Applicable': convertAmount(data[itemkey]),
          isHeading: itemInfo.isHeading
        });
    } 
    salaryDisplayItems.splice(2, 0, {itemLabel: "Earnings", itemValue: "Amount(Rs)", isHeading: true},
    {itemLabel: "Deductions" , itemValue: "Amount(Rs)", isHeading: true});
    var htmlToSend = mustacheExpress.render(template, {'salaryDisplayItems': salaryDisplayItems, 'currentMonth': appHelpers.monthsInAYear[reqData.month - 1], 'currentYear': reqData.year, 'currentMonthDays': new Date(reqData.year, reqData.month, 0).getDate(), 'companyData':compData });
    pdf.create(htmlToSend, {
      "directory": path.resolve('salary-slips/' + data.month + '-' + data.year), 
      "format": "A3",
      "type": "pdf"}).toBuffer(function(err, buffer){
        if(err) {
          return callback(err);
        } else {
          fs.writeFileSync(path.join(path.resolve('salary-slips/' + data.month + '-' + data.year), salaryDisplayItems[0].itemValue.split(' ').join('_') + '_' + data.month + '_' + data.year + '.pdf'), buffer);
          emailService.sendSalarySlipEmail(data, 'salary-slips/' + data.month + '-' + data.year + '/' + salaryDisplayItems[0].itemValue.split(' ').join('_') + '_' + data.month + '_' + data.year + '.pdf', function(err, resp){
            if(err) {
              return callback(err);
            }
          });
        }
      });
}

function convertAmount(value){
  if (typeof(value) == 'number') {
    const arrayOfDigit = value.toString().split('.');
    let lastThreeDigits = arrayOfDigit[0].substring(arrayOfDigit[0].length - 3);
    const otherNumbers = arrayOfDigit[0].substring(0, arrayOfDigit[0].length - 3);
    if (otherNumbers != '' && otherNumbers != '-') {
      lastThreeDigits = ',' + lastThreeDigits;
    }
    let formatedAmount = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ',') + lastThreeDigits;
    if (arrayOfDigit.length > 1) {
      formatedAmount +=  ',' + arrayOfDigit[1];
    }
    return formatedAmount;
  } else {
    return value;
  }
}

service['removeSalarySlip'] = function(reqData, callback) {
  try {
      Salarydetail.remove({month: reqData.month, year: reqData.year, employeeEmail: { $in: reqData.empEmails.split(',')}}, function(err, resp){
          if(err) {
              return callback(err);
          } else {
            if(resp.result && resp.result.n > 1) {
              return callback(null, {message: "SalarySlips has been deleted successfully"})
            } else {
              return callback(null, {message: "SalarySlip has been deleted successfully"});
            }
          }
      });
  } catch (err) {
      return callback(err);
  }
};

module.exports = service;