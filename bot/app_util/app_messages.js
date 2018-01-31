'use strict';

var msg = {};


msg.askTimeSheetText = 'Do you want to enter timesheet details?';
msg.askTimeSheetTitle = 'If yes please select a day from dropdown list.';
msg.askTimeSheetFallback = 'You are unable to select a button.';
msg.askTimeSheetActionsText = 'Pick a day...';
// msg.askTimeSheetConfirmTitle = 'Are you sure?';
// msg.askTimeSheetConfirmText = 'Do you want to enter details now?';


// msg.askRegistrationTitle = 'Do you want to register your details now?';
// msg.askRegistrationFallback = 'Do you want to close the registration?';


msg.viewTimeSheetTitle = 'This is your current week\'s timesheet.';
msg.viewTimeSheetBtnTitle = 'Close the timesheet view.';
msg.viewTimeSheetBtnFallback = 'Do you want to close the timesheet?';


msg.helpText = 'These are available commands:';
msg.helpTSText = 'timesheet/time : To enter time sheet detail.';
msg.helpViewText = 'view : To view your current week\'s timesheet.';
msg.helpRegistrationText = 'register : To register your information to access dashboard.';
msg.helpDashBoardText = 'dashboard : To view dashboard url.';


msg.dialogTextStatus = 'Status';
msg.dialogTextStatusPh = 'Enter your today status.';
msg.dialogTextOfficeIn = 'Office In Time';
msg.dialogTextOfficeInPh = '09:00';
msg.dialogTextOfficeOut = 'Office Out Time';
msg.dialogTextOfficeOutPh = '18:30';
msg.dialogTextHomeIn = 'Home In Time';
msg.dialogTextHomeInPh = '21:30';
msg.dialogTextHomeOut = 'Home Out Time';
msg.dialogTextHomeOutPh = '23:00';

// msg.dialogRegTitle = 'User Registration';
// msg.dialogRegTextName = 'Full Name';
// msg.dialogRegTextNamePh = 'Please enter your name.';
// msg.dialogRegTextEmail = 'Email';
// msg.dialogRegTextEmailPh = 'Please enter your email.';
// msg.dialogRegTextPwd = 'Password';
// msg.dialogRegTextPwdPh = 'Please enter your password.';
// msg.dialogRegTextGender = 'Gender';
// msg.dialogRegTextGenderPh = 'Please select your gender';
// msg.dialogRegSelectGenderMail = 'Male';
// msg.dialogRegSelectGenderFemale = 'Female';

msg.userRegister1 = 'Thank you ';
msg.userRegister2 = ' for registration. Now you can login our dashboard using (URL : http://newput.timetracker.s3-website-us-west-1.amazonaws.com, UserId : ';
msg.userRegister3 = ', Password : newput123)';
msg.userDashBoardUrl = 'http://newput.timetracker.s3-website-us-west-1.amazonaws.com';

msg.cronDaily = ', Please fill your today\'s time sheet.';
msg.cronWeekly = ', This is the last reminder to fill current week\'s timesheet. It will be sent to management after one hour. Thanks.';
msg.cronMonthEnd = ', This is the last reminder to fill current month\'s timesheet. It will be sent to management after three hour. Thanks.';


msg.closeTimeSheetFlow = 'Thank you! Please use me when you want to fill timesheet.';
msg.closeDialogFlowSuccess = 'Thank you for using Time.';
msg.closeDialogFlowError = 'Something went wrong. Please try again later.';

// error
msg.errorOfficeIn = 'Please enter a valid office in time.';
msg.errorOfficeOut = 'Please enter a valid office out time.';
msg.errorHomeIn = 'Please enter a valid home in time.';
msg.errorHomeOut = 'Please enter a valid home out time.';

module.exports = msg;
