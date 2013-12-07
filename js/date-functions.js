/** Functions for parsing dates and times */

// get string in form mm/dd/yyyy from date string
function getCalendarString(dateString) {
	var fullDate = new Date(dateString);
	var year = fullDate.getFullYear();
	var month = fullDate.getMonth() + 1; //indexes at 0
	var day = fullDate.getDate();
	
	if(month < 10) {
		month = "0" + month;
	}
	if(day < 10) {
		day = "0" + day;
	}
	
	
	return year + "-" + month + "-" + day;
}

// get string in form of hh:mm PM from date string
function getTimeString(dateString) {
	var fullDate = new Date(dateString);
	var hour = fullDate.getHours();
	var minute = fullDate.getMinutes();
	var AMPM = "AM";
	
	if(hour == 12) {
		AMPM = "PM";
	} else if(12 < hour && hour < 24) {
		hour = hour - 12;
		AMPM = "PM";
	} else if(hour == 0) {
		hour = 12;
	}

	if(minute < 10) {
		minute = "0" + minute;
	}
	
	return hour + ":" + minute + " " + AMPM;
}