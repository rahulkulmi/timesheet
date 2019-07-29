var multer  =   require('multer');
var path = require('path');
var uploadFolderPath = path.resolve('public/uploads');
var Salarydetail = require('../models/salarydetail');
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
        return callback('Only csv file is allowed.')
    }
    callback(null, true)
},
}).single('file');

var service = {};

service['uploadSingle'] = function(req, res, callback) {
  try {
    uploadSingle(req,res,function(err){
        if(err){
            return callback(err);
        } else {
            fs.createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => 
            Salarydetail.collection.insert({employeeEmail: data.employee_email,
                employeeDesignation: data.employee_designation,
                month: appHelpers.monthsInAYear[data.month - 1],
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
                esicNo: data.esic_no,
                pfUAN: data.pf_UAN}, function(err, resp){
                    if (err){ 
                        return err;
                    } else {
                      console.log("CSV record inserted", resp);
                    }
                }))
            .on('end', () => {
                fs.unlink(req.file.path, function(){
                    console.log('file deleted');
                })
                Salarydetail.find(null, function(err, resp){
                    if(err) {
                        return callback(err);
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

module.exports = service;