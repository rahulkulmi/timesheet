'use strict';

var msg = {};


msg.askTimeSheetText = 'Do you want to enter timesheet details?';
msg.askTimeSheetTitle = 'If yes please select a day from dropdown list.';
msg.askTimeSheetFallback = 'You are unable to select a button.';
msg.askTimeSheetActionsText = 'Pick a day...';
msg.askTimeSheetConfirmTitle = 'Are you sure?';
msg.askTimeSheetConfirmText = 'Do you want to enter details now?';


msg.viewTimeSheetTitle = 'This is your current week\'s timesheet.';
msg.viewTimeSheetBtnTitle = 'Close the timesheet view.';
msg.viewTimeSheetBtnFallback = 'Do you want to close the timesheet?';


msg.helpText = 'These are available commands:';
msg.helpTSText = 'timesheet : To enter time sheet detail.';
msg.helpViewText = 'view : To view your current week\'s timesheet.';


msg.dialogTextStatus = 'Today Status';
msg.dialogTextStatusPh = 'Enter your today status.';
msg.dialogTextOfficeIn = 'Office In Time';
msg.dialogTextOfficeInPh = '09:00';
msg.dialogTextOfficeOut = 'Office Out Time';
msg.dialogTextOfficeOutPh = '18:30';
msg.dialogTextHomeIn = 'Home In Time';
msg.dialogTextHomeInPh = '21:30';
msg.dialogTextHomeOut = 'Home Out Time';
msg.dialogTextHomeOutPh = '23:00';


msg.closeTimeSheetFlow = 'Thank you! Please use me when you want to fill timesheet.';
msg.closeDialogFlowSuccess = 'Thank you for using me.';
msg.closeDialogFlowError = 'Something went wrong. Please try again later.';

// error
msg.errorOfficeIn = 'Please enter a valid office in time.';
msg.errorOfficeOut = 'Please enter a valid office out time.';
msg.errorHomeIn = 'Please enter a valid home in time.';
msg.errorHomeOut = 'Please enter a valid home out time.';

module.exports = msg;
