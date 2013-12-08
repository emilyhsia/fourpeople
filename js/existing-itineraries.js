/** JavaScript functionalities for existing itineraries */

// TODO: make sure not empty - if so, just use sample
var currentJSON = store.get('fourpeople');

if(currentJSON == null) {
	itineraries.forEach(function(itinerary){
		$("#current-itinerary-holder").append(buildItineraryDiv(itinerary));
	});
} else {
	itineraries = JSON.parse(currentJSON);
	itineraries.forEach(function(itinerary) {
		$("#current-itinerary-holder").append(buildItineraryDiv(itinerary));
	});
}

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
	
	var html = '<tr id="itinerary-' + id + '">' + 
			'<td><h3>'+ name + ( (id < 3) ? ' (Sample)' : '') + '</h3></td>';
	if(venuesExist) {
		html +=	'<td>' + getWordsDateString(startDate) + ' at ' + getDisplayTimeString(startDate) +  ' to ' + 
			getWordsDateString(endDate) + ' at ' + getDisplayTimeString(endDate) +  '</td>';
	} else {
		html += '<td> (No venues yet) </td>';
	}
	
	html += '<td><a href="itinerary.html?id=' + id + '"><button id="edit-' + id + '" class="btn btn-primary">Edit</button></a></td>' + 
			'<td><button id="delete-' + id + '" class="btn btn-danger delete-itinerary">Delete</button></td>' + 
			'<td class="hidden-id-holder" style="display:none">' + id + '</td>' + 
		'</tr>';
		
	return html;
}

// if click delete button, remove from itinerary list and stored itineraries
$(document).on('click', '.delete-itinerary', function(){
	var deleteButtonEl = event.target;
	// Get the venue ID
	var itineraryID = $(deleteButtonEl).attr('id').split("-")[1];

	console.log("Clicked delete-" + itineraryID);
	
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