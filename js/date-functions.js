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

/* 
 * Format dateString to display as HH:MM AM/PM
 */
function getDisplayTimeString(dateString) {
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

/* 
 * Format dateString to prepopulate <input type="time">. Returns HH:MM:SS in military time
 */
function getInputTimeString(dateString) {
	var fullDate = new Date(dateString);
	var hour = fullDate.getHours();
	var minute = fullDate.getMinutes();

	if(hour < 10) {
		hour = "0" + hour;
	}
	if(minute < 10) {
		minute = "0" + minute;
	}
	
	// Set seconds to :00
	return hour + ":" + minute + ":00";
}