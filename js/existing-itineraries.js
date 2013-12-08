/** JavaScript functionalities for existing itineraries */

// TODO: make sure not empty - if so, just use sample
var currentJSON = store.get('fourpeople');

if(currentJSON == null) {
	itineraries.forEach(function(itinerary){
		$("table tbody").append(buildItineraryDiv(itinerary));
	});
} else {
	itineraries = JSON.parse(currentJSON);
	itineraries.forEach(function(itinerary) {
		$("table tbody").append(buildItineraryDiv(itinerary));
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
			'<td><button id="delete-' + id + '" class="btn btn-danger">Delete</button></td>' + 
			'<td class="hidden-id-holder" style="display:none">' + id + '</td>' + 
		'</tr>';
		
	return html;
}

$(document).on('click', '.btn-danger', function(){
	var deleteButtonEl = event.target;
	// Get the venue ID
	var itineraryID = $(deleteButtonEl).attr('id').split("-")[1];

	console.log("Clicked delete-" + itineraryID);
	alert("Coming soon :) ");
	
	/*//remove venue from itinerary
	itinerary.itinerary.splice(i, 1);
	//remove venue from display
	var tbody = document.getElementById("venue-table-tbody");
	var trChild = document.getElementById("tr-" + thisVenue.id);
	var throwawayNode = tbody.removeChild(trChild);*/
});