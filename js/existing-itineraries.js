/** JavaScript functionalities for existing itineraries */

// TODO: make sure not empty - if so, just use sample
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
	
	var html = '<tr id="itinerary-' + id + '">' + 
			'<td><h3>'+ name + ( (id < numSamples + 1) ? ' (Sample)' : '') + '</h3></td>';
	if(venuesExist) {
		html +=	'<td>' + getWordsDateString(startDate) + ' at ' + getDisplayTimeString(startDate) +  ' to ' + 
			getWordsDateString(endDate) + ' at ' + getDisplayTimeString(endDate) +  '</td>';
	} else {
		html += '<td> (No venues yet) </td>';
	}
	
	html += (id < numSamples + 1) ? '<td><a href="sample-itinerary.html?id=' + id + '"><button id="view-' + id + '" class="btn btn-info">View</button></a></td>' :
									'<td><a href="itinerary.html?id=' + id + '"><button id="edit-' + id + '" class="btn btn-primary">Edit</button></a></td>';
	html += '<td class="delete-td">' + 
				'<div id="delete-div-' + id + '" class="delete-div"><button id="delete-' + id + '" class="btn btn-danger delete-itinerary">Delete</button></div>' + 
				'<div class="confirm-delete-div" style="text-align: center; display: none;">Are you sure? <br>This cannot be undone.<br>' +
					'<button id="yes-delete-' + id + '" class="btn btn-danger">Yes, Delete</button><br><br>' + 
					'<button id="no-cancel-' + id + '" class="btn btn-primary">No, Cancel</button>' +
				'</div>' + 
			'</td>' + 
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