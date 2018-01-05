'use strict';

// public
var utility = {};

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

utility['getDateByString'] = function(dateString) {
  var newDateString = dateString.split('-').reverse().join('-');
  var date = new Date(newDateString);
  return date;
};

utility['getDayOptionList'] = function() {
  var optionsArray = [];
  var dayNames = [' - Monday', ' - Tuesday', ' - Wednesday', ' - Thursday',
    ' - Friday', ' - Saturday', ' - Sunday'];

  var todayDate = new Date();
  var todayDay = todayDate.getDay();
  // Add this conduction due to showing wrong date on sunday.
  if (todayDay == 0) {
    todayDay = 7;
    for (var i=1; i<=todayDay; i++) {
      var listHash = {
        text: utility.getDate(i-7) + dayNames[i - 1],
        value: utility.getDate(i-7)
      }
      optionsArray.push(listHash);
    }
  } else {
    for (var i=1; i<=todayDay; i++) {
      var listHash = {
        text: utility.getDate(i) + dayNames[i - 1],
        value: utility.getDate(i)
      }
      optionsArray.push(listHash);
    }
  }

  return optionsArray;
};

module.exports = utility;
