/** Functions for parsing dates and times */

/*
 * Creates our recognized dateString from the date (YYYY-MM-DD) and time (HH:MM:SS)
 */
function createDateString(date, time) {
	var dateObject = new Date();
	var fullDateArray = date.toString().split('-');
	dateObject.setFullYear(fullDateArray[0], fullDateArray[1] - 1, fullDateArray[2]);
	var fullTimeArray = time.toString().split(':');
	dateObject.setHours(fullTimeArray[0], fullTimeArray[1], 0, 0); // seconds and milliseconds set to 0
	return dateObject;
}

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

/*
 * Adds an hour to the dateString. Can't just do getHours() + 1
 * in case time is close to midnight
 */
function addHour(dateString) {
	var h = 1;
	var fullDate = new Date(dateString);
	fullDate.setTime(fullDate.getTime() + (h*60*60*1000)); 
   	return fullDate; 
}

/* Displays as such:
 * Dec 08 2013 
 */
function getWordsDateString(dateString) {
	var parts = dateString.split(" ");
	return parts[1] + " " + parts[2] + " " + parts[3];
}

/*
 * Compares two different dateStrings to determine if the YYYY-MM-DD is different
 */
function isDifferentDay(a, b) {
	if (a == "") {
		return true;
	}
	var aYYYYMMDD = getCalendarString(a).split("-");
	var bYYYYMMDD = getCalendarString(b).split("-");
	for (var i = 0; i < 3; i++) {
		if (aYYYYMMDD[i] != bYYYYMMDD[i]) {
			return true;
		}
	}
	return false;
}