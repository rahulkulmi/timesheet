'use strict';
var bcrypt = require('bcrypt');

// public
var utility = {};

utility['daysInMonth'] = function(year, month) {
  return new Date(year, month, 0).getDate();
};
utility['monthsInAYear'] = ['January', 'February', 'March', 'April', 'May', 'June',
'July', 'August', 'September', 'October', 'November', 'December'];

utility['getDate'] = function(userDay) {
  var todayDate = new Date();
  var todayDay = todayDate.getDay();
  if (userDay > todayDay) {
    todayDate.setDate(todayDate.getDate() + (userDay - todayDay));
  } else if (userDay < todayDay) {
    todayDate.setDate(todayDate.getDate() - (todayDay - userDay));
  }
  var date = todayDate.getDate();
  if (date < 10) {
    date = '0' + date;
  }
  var month = 1 + todayDate.getMonth();
  if (month < 10) {
    month = '0' + month;
  }
  var year = todayDate.getFullYear();
  var newDate = date + '-' + month + '-' + year;
  return newDate;
};

utility['getDateByNumber'] = function(number) {
  var todayDate = new Date();
  var date = number;
  if (date < 10) {
    date = '0' + date;
  }
  var month = 1 + todayDate.getMonth();
  if (month < 10) {
    month = '0' + month;
  }
  var year = todayDate.getFullYear();
  var newDate = date + '-' + month + '-' + year;
  return newDate;
};

utility['prepareMonthlyStartEndDate'] = function(reqData) {
  var date = new Date();
  var year = date.getFullYear();
  if (reqData.year) {
    year = reqData.year;
  }
  var month = date.getMonth() + 1;
  if (reqData.month) {
    month = reqData.month;
  }
  if (month < 10) {
    month = '0' + month;
  }
  var startDate = '01' + '-' + month + '-' + year;
  var endDate = utility.daysInMonth(year, month) + '-' + month + '-' + year;
  reqData['startDate'] = startDate;
  reqData['endDate'] = endDate;
  return reqData;
};

utility['getMonthStartDate'] = function() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  var startDate = '01' + '-' + month + '-' + year;
  return startDate;
};

utility['getTodayDate'] = function() {
  var date = new Date();
  var year = date.getFullYear();
  var month = date.getMonth() + 1;
  if (month < 10) {
    month = '0' + month;
  }
  var day = date.getDate();
  if (day < 10) {
    day = '0' + day;
  }
  var todayDate = day + '-' + month + '-' + year;
  return todayDate;
};

utility['prepareFormattedStartEndDate'] = function(reqData) {
  var reverseStartDate = reqData.startDate.split('-').reverse().join('-');
  var reverseEndDate = reqData.endDate.split('-').reverse().join('-');
  reqData['formattedStartDate'] = new Date(reverseStartDate);
  reqData['formattedEndDate'] = new Date(reverseEndDate);
  return reqData;
};

utility['convertMinToHour'] = function(totalMin) {
  var totalHours = '00:00';
  if (totalMin > 0) {
    var hours = (totalMin / 60);
    var hr = Math.floor(hours);
    var minutes = (hours - hr) * 60;
    var min = Math.round(minutes);
    if (hr < 10) {
      totalHours = '0' + hr + ':';
    } else {
      totalHours = hr + ':';
    }
    if (min < 10) {
      totalHours += '0' + min;
    } else {
      totalHours += min;
    }
  }
  return totalHours;
};

utility['getCurrentYear'] = function() {
  var date = new Date();
  return date.getFullYear();
};

utility['getCurrentMonthName'] = function() {
  var monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'];
  var date = new Date();
  return monthNames[date.getMonth()];
};

utility['prepareTimesheetData'] = function(reqData) {
  var responseData = [];
  // create blank space array
  for(var i=1; i<32; i++) {
    var defaultObject = {
      officeIn: '',
      officeOut: '',
      homeIn: '',
      homeOut: '',
      dateString: utility.getDateByNumber(i),
      dayTotal: '',
      status: ''
    }
    responseData.push(defaultObject);
  }
  // now fill the blank space
  for(var i=0; i<reqData.length; i++) {
    var data = reqData[i];
    var dateValue = parseInt(data.dateString.substring(0, 2));
    responseData[dateValue - 1] = data;
  }

  return responseData;
};

utility['getEncryptedPassword'] = function(plainPassword) {
  var encryptedPassword = bcrypt.hashSync(plainPassword, 12);
  return encryptedPassword;
};

utility['calculateTotalHours'] = function(resArray) {
  var totalMin = 0;
  var totalHours = '00:00';
  resArray.forEach(function(sheet) {
    var a = sheet.dayTotal.split(':');
    totalMin = totalMin + (a[0]*60 + a[1]*1);
  });
  totalHours = utility.convertMinToHour(totalMin);
  return totalHours;
};

utility['getTimesheetData'] = function(emp, fileName, startDate, endDate) {
  var hash = {
    fileName: fileName,
    empName: emp.fullName,
    empEmail: emp.email,
    month: utility.getCurrentMonthName(),
    year: utility.getCurrentYear(),
    userId: emp.id,
    startDate: startDate,
    endDate: endDate,
    formattedStartDate: startDate,
    formattedEndDate: endDate
  };
  var updatedHash = utility.prepareFormattedStartEndDate(hash);

  return updatedHash;
};

utility['getTimesheetDataArray'] = function(empList, fileName, startDate, endDate) {
  var reqHashArray = [];
  empList.forEach(function(emp) {
    var hash = {
      fileName: fileName,
      empName: emp.fullName,
      empEmail: emp.email,
      month: utility.getCurrentMonthName(),
      year: utility.getCurrentYear(),
      userId: emp.id,
      startDate: startDate,
      endDate: endDate,
      formattedStartDate: startDate,
      formattedEndDate: endDate
    };
    var updatedHash = utility.prepareFormattedStartEndDate(hash);
    reqHashArray.push(updatedHash);
  });

  return reqHashArray;
};

utility['getHoursheetData'] = function(reqData) {
  var hash = {
    fileName: reqData.fileName,
    startDate: reqData.startDate,
    endDate: reqData.endDate,
    formattedStartDate: reqData.startDate,
    formattedEndDate: reqData.endDate
  };
  var updatedHash = utility.prepareFormattedStartEndDate(hash);

  return updatedHash;
};

utility['getDayTotalHours'] = function(hash) {
  var totalMin = 0;
  var total = '00:00';
  if (hash.officeIn && hash.officeOut) {
    var a = hash.officeIn.split(':');
    var b = hash.officeOut.split(':');
    totalMin = totalMin + (b[0]*60 + b[1]*1) - (a[0]*60 + a[1]*1)
  }
  if (hash.homeIn && hash.homeOut) {
    var c = hash.homeIn.split(':');
    var d = hash.homeOut.split(':');
    totalMin = totalMin + (d[0]*60 + d[1]*1) - (c[0]*60 + c[1]*1)
  }
  if (totalMin > 0) {
    var hours = (totalMin / 60);
    var hr = Math.floor(hours);
    var minutes = (hours - hr) * 60;
    var min = Math.round(minutes);
    if (hr < 10) {
      total = '0' + hr + ':';
    } else {
      total = hr + ':';
    }
    if (min < 10) {
      total += '0' + min;
    } else {
      total += min;
    }
  }
  return total;
};

utility['getDateByString'] = function(dateString) {
  var newDateString = dateString.split('-').reverse().join('-');
  var date = new Date(newDateString);
  return date;
};

utility['validCSVKeys'] = ['employee_email','employee_fullName', 'employee_designation','month','year','basic', 'hra', 'lta','advance_bonus', 'advance_gratuity', 'professional_allowance', 'gross_salary', 'net_salary_payable', 'professional_tax', 'tds', 'esic', 'pf', 'total_deductions', 'bank_name', 'account_no', 'ifsc', 'esic_no', 'pf_uan']

module.exports = utility;
