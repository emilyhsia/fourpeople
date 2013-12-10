/** JavaScript functionalities for existing itineraries */

// Check storage for itineraries - if none, write sample itineraries;
// if stored itineraries, then get them 
var currentJSON = store.get('fourpeople');

if(currentJSON == null) {
	store.set('fourpeople', JSON.stringify(sampleItineraries));
	console.log(JSON.parse(store.get('fourpeople')));
	itineraries = JSON.parse(store.get('fourpeople'));
	store.set('fourpeopleID', nextItineraryID);
} else {
	itineraries = JSON.parse(currentJSON);
	console.log(JSON.parse(store.get('fourpeople')));
	nextItineraryID = parseInt(store.get('fourpeopleID'));
}

itineraries.forEach(function(itinerary) {
	$("#current-itinerary-holder").append(buildItineraryDiv(itinerary));
});

function buildItineraryDiv(itinerary) {
	var name = itinerary.name;
	var id = itinerary.id;
	
	var venuesExist = false;
	if(itinerary.itinerary.length > 0) {
		var startVenue = itinerary.itinerary[0];
		var endVenue = itinerary.itinerary[itinerary.itinerary.length - 1];
		var startDate = startVenue.startDate;
		var endDate = endVenue.endDate;
		venuesExist = true;
	}
	
	// start off row with id=itinerary-##, then add title
	// add '(Sample)' if sample itinerary
	var html = '<tr id="itinerary-' + id + '">' + 
					'<td><h3>'+ name + ( (id <= numSamples) ? ' (Sample)' : '') + '</h3></td>' + 
					'<td>(id: ' + id + ')</td>';
					
	//if there are venues, display start time and end time;
	//otherwise, just say no venues
	if(venuesExist) {
		html +=	'<td style="text-align:center;">' + getWordsDateString(startDate) + ' - ' + getWordsDateString(endDate) + '</td>';
	} else {
		html += '<td style="text-align: center;"> (No venues yet) </td>';
	}
	
	// if sample itinerary, have link go to sample-itinerary.html
	// otherwise go to itinerary.html
	if(id <= numSamples) {
		html += '<td><a href="sample-itinerary.html?id=' + id + '"><button id="view-' + id + '" class="btn btn-info">View</button></a></td>';
	} else {
		html += '<td><a href="itinerary.html?id=' + id + '"><button id="edit-' + id + '" class="btn btn-primary">Edit</button></a></td>';
	}
	
	// add copy column
	html += '<td class="copy-td">' + 
				'<button id="copy-' + id + '" class="btn btn-success copy-itinerary">Copy</button>' + 
			'<td>';
	
	// if not a sample itinerary, add delete column
	if(id > numSamples) {
		html += '<td class="delete-td">' + 
				'<div id="delete-div-' + id + '" class="delete-div"><button id="delete-' + id + '" class="btn btn-danger delete-itinerary">Delete</button></div>' + 
				'<div class="confirm-delete-div" style="text-align: center; display: none;">Are you sure? <br>This cannot be undone.<br>' +
					'<button id="yes-delete-' + id + '" class="btn btn-danger">Yes, Delete</button><br><br>' + 
					'<button id="no-cancel-' + id + '" class="btn btn-primary">No, Cancel</button>' +
				'</div>' + 
			'</td>';
	} else {
		html += '<td class="dummy-holder"></td>';
	}
	html +=	'<td class="hidden-id-holder" style="display:none">' + id + '</td>' + 
		'</tr>';
		
	return html;
}

// if click delete button, remove from itinerary list and stored itineraries
$(document).on('click', '.delete-itinerary', function(){
	var deleteButtonEl = event.target;
	// Get the venue ID
	var itineraryID = $(deleteButtonEl).attr('id').split("-")[1];

	console.log("Clicked delete-" + itineraryID);
	
	var parentTR = $("#itinerary-" + itineraryID);
	var deleteDiv = parentTR.children('.delete-td').children('.delete-div');
	var confirmDeleteDiv = parentTR.children('.delete-td').children('.confirm-delete-div');
	
	deleteDiv.hide();
	confirmDeleteDiv.show();
		
	$("#no-cancel-" + itineraryID).click(function(){
		confirmDeleteDiv.hide();
		deleteDiv.show();
	});
	
	$("#yes-delete-" + itineraryID).click(function() {
		var i = 0;
		var itineraryFound = false;
		while(!itineraryFound) {
			if(itineraries[i].id == itineraryID) {
				itineraryFound = true;
			}
			i++;
		}
		i--;
		//remove venue from itinerary
		itineraries.splice(i, 1);
		store.set('fourpeople', JSON.stringify(itineraries));
		
		//remove venue from display
		var tbody = document.getElementById("current-itinerary-holder");
		var trChild = document.getElementById("itinerary-" + itineraryID);
		var throwawayNode = tbody.removeChild(trChild);
	});
});

// if click copy button, copy itinerary and redirect to page
$(document).on('click', '.copy-itinerary', function(){
	var copyButtonEl = event.target;
	var itineraryID = $(copyButtonEl).attr('id').split("-")[1];
	
	var i = 0;
	var itineraryFound = false;
	var itinerary = null;
	while(!itineraryFound) {
		if(itineraries[i].id == itineraryID) {
			itinerary = itineraries[i];
			itineraryFound = true;
		}
		i++;
	}
	i--;
	var itineraryName = itinerary.name + " (Copy)";
	var itineraryID = parseInt(store.get('fourpeopleID'));
	nextItineraryID++;
	store.set('fourpeopleID', nextItineraryID);
	var venues = itinerary.itinerary;
	//var copy = $.extend(true, [], venues);
	//updateCopiedDates(copy);
	

	itineraries.push({
		name: itineraryName,
		id: itineraryID,
		itinerary: venues
	});
	
	store.set('fourpeople', JSON.stringify(itineraries));
		
	window.location.href = "itinerary.html?id=" + itineraryID;
});

var updateCopiedDates = function(venues) {
	var today = new Date();
	console.log('today: ' + today);
	today = createDateString(getCalendarString(today.toString()), "00:00");
	var newBegin = today.getTime();
	console.log('newBeing: ' + new Date(newBegin));
	venues.forEach(function(venue) {
		var oldBegin = new Date(venue.startDate);
		console.log('oldbegin: ' + oldBegin);
		oldBegin = oldBegin.getTime() % (1000*24*60*60);
		var oldEnd = new Date(venue.endDate);
		console.log('oldEnd: ' + oldEnd);
		oldEnd = oldEnd.getTime() % (1000*24*60*60);
		var newEnd = new Date(newBegin + oldEnd - oldBegin);
		console.log('newend: ' + newEnd);
		newBegin = newEnd.getTime();

		console.log('new end: ' + newEnd + " new begin: " + newBegin);
		console.log('SET: ' + new Date(newBegin).toString());
		venue.startDate = new Date(newBegin).toString();
		venue.endDate = new Date(newEnd).toString();
	});
}


// if click creat3 new button, create new itinerary and redirect to page
$(document).on('click', '#create-new', function(){
	console.log("click");
	var copyButtonEl = event.target;
	var itineraryID = $(copyButtonEl).attr('id').split("-")[1];
	
	var itineraryName = "My Kickass Itinerary";
	var itineraryID = parseInt(store.get('fourpeopleID'));
	nextItineraryID++;
	store.set('fourpeopleID', nextItineraryID);
	var venues = new Array(0);
	
	itineraries.push({
		name: itineraryName,
		id: itineraryID,
		itinerary: venues
	});
	
	store.set('fourpeople', JSON.stringify(itineraries));
	console.log(JSON.parse(store.get('fourpeople')));
		
	window.location.href = "itinerary.html?id=" + itineraryID;
});