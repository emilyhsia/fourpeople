/** Javascript functionality for itinerary */

var baseURL = "https://api.foursquare.com/v2/venues/";
var CLIENT_ID = "5CYXNIKAOPTKCKIGHNPPJ3DQJBY4IPL0XJL140TLN121U514";
var CLIENT_SECRET = "RPZTJ5NHBY0L213UKWP3T3DF2QVUXNKMW34FRJOUZFDIFNDM&v=20131124";
var cloudMadeAPIKey = '7da9717aa6e646c2b4d6a6a1fbc94765';

console.log(itineraries);

//get id from URL
//split at & if multiple parameters passed; id must be first
//TODO: make more robust
var idEquals = location.search.split("&")[0];
var itineraryID = parseInt(idEquals.split("=")[1]);
var n = 0;
var foundItinerary = false;
var itinerary = null;
while(!foundItinerary && n < itineraries.length) {
	if(itineraries[n].id == itineraryID) {
		console.log("Itinerary id #" + itineraryID + " found.");
		itinerary = itineraries[n];
		foundItinerary = true;
	}
	n++;
}

// TODO
if(!foundItinerary) {
	var toDisplay = '<h1>Oops, this is embarrassing!</h1>' + 
					'<h3>We could not find your itinerary.</h3>' + 
					'<p>Please make sure your ID is correct or check out ' + 
					'our <a href="existing-itineraries.html">existing itineraries</a>.</p>';
	$("#itinerary-content").html(toDisplay);
	$("#add-venues-content").hide();
}

//=============================================================================
//=============================================================================
// Viewing current itinerary
//=============================================================================
//=============================================================================

var formatVenueLookupURL = function(id) {
	var URL = baseURL + encodeURIComponent(id) + "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET;
	return URL;
}

var lookup = function(venue) {
	var urlToSend = formatVenueLookupURL(venue.id);
	$.ajax({
		  url: urlToSend
		}).done(function(data) {
			venue.venue = data.response.venue;
			console.log(data.response.venue);
			displayVenue(venue);
	});
}

// display itinerary on page load
displayAllVenues();

function displayAllVenues() {
	//sort itinerary first
	itinerary.itinerary.sort(function(a,b) {
		var dateA = new Date(a.startDate);
		var dateB = new Date(b.startDate);
		
		if(dateA > dateB) 
			return 1;
		if(dateA < dateB)
			return -1;
		return 0;
	});
	//empty table
	$("#venue-table-tbody").html(" ");
	//display all venues
	itinerary.itinerary.forEach(function(venue){
		// create and append tr element before lookup, async call might mess up order
		var row = $(document.createElement('tr')).attr("id", "tr-" + venue.id);
		//var expand = $(document.createElement('tr')).attr("id", "tr-expand-" + venue.id);

		$('tbody#venue-table-tbody').append(row);
		
		lookup(venue);
	});
}

$('h1#itinerary-title').text(itinerary.name);

var displayVenue = function(venue) {
	var category;
	venue.venue.categories.forEach(function(cat) {
		if (cat.primary) {
			category = cat;
		}
	});

	// Each venue is displayed as a single row in a table
	/*  ------------------------------------------------
	 * |  cate	|	venue	|				|			|
	 * |  gory	|   info 	|	time		|	map		|						
	 * |  icon	|			|				|			|
	 *  ------------------------------------------------
	*/  


	// Build the row and append to the table body

	// category icon
	var iconImg = document.createElement('img');
	$(iconImg).attr("src", category.icon.prefix + "bg_88" + category.icon.suffix);
	var iconColumn = $(document.createElement('td')).addClass('icon');
	iconColumn.append(iconImg);

	// venue info
	var name = $(document.createElement('h4')).addClass('list-group-item-heading').text(venue.venue.name);
	var rating = $(document.createElement('h3')).append($(document.createElement('span')).addClass('label').addClass('label-success').text(venue.venue.rating)).addClass('rating');
	var address = $(document.createElement('p')).addClass('list-group-item-text').text(venue.venue.location.address);
	var categoryLabel = $(document.createElement('p')).text(category.shortName);
	var venueInfo = $(document.createElement('div')).addClass('info').append(address).append(categoryLabel);

	// rating and venue info table
	rating = $(document.createElement('td')).append(rating);
	venueInfo = $(document.createElement('td')).append(venueInfo);
	var infoTable = $(document.createElement('table')).append($(document.createElement('tbody')).append($(document.createElement('tr')).append(rating).append(venueInfo)));
	var venueColumn = $(document.createElement('td')).addClass('venue').append(name).append(infoTable);

	// time
	var timeDisplay = $(document.createElement('div')).addClass('timeDisplay').text(getDisplayTimeString(venue.startDate) + " - " + getDisplayTimeString(venue.endDate));

	// time change
	var startTimeChangeHTML = 
	'<span width="400px;"><b>Start</b></span>' + 
	'<form class="form-inline" role="form">' + 
  		'<div class="form-group">' + 
    		'<label class="sr-only" for="start-date-picker-' + venue.id + '">Date</label>' + 
    		'<input type="date" class="form-control date-picker" id="start-date-picker-' + venue.id + '" placeholder="Date">' + 
  		'</div>' + 
 		 '<div class="form-group">' + 
			'<label class="sr-only" for="start-time-picker-' + venue.id + '">Time</label>' + 
			'<input type="time" class="form-control time-picker" id="start-time-picker-' + venue.id + '" placeholder="Time" size="10" autocomplete="OFF">' + 
  		'</div>' + 
	'</form>';

	var endTimeChangeHTML = 
	'<span width="400px;"><b>End</b></span>' + 
	'<form class="form-inline" role="form">' + 
  		'<div class="form-group">' + 
    		'<label class="sr-only" for="end-date-picker-' + venue.id + '">Date</label>' + 
    		'<input type="date" class="form-control date-picker" id="end-date-picker-' + venue.id + '" placeholder="Date">' + 
  		'</div>' + 
 		 '<div class="form-group">' + 
			'<label class="sr-only" for="end-time-picker-' + venue.id + '">Time</label>' + 
			'<input type="time" class="form-control time-picker" id="end-time-picker-' + venue.id + '" placeholder="Time" size="10" autocomplete="OFF">' + 
  		'</div>' + 
	'</form>';

	
	var doneButton = '<button class="btn btn-primary btn-sm" id="done-' + venue.id + '">Save</button>';
	var deleteButton = '<button class="btn btn-danger btn-sm" id="delete-' + venue.id + '">Delete</button>';
	var buttonGroup = $(document.createElement('div')).html(doneButton + deleteButton);
	buttonGroup.css("margin-top", "10px");
	var timeChange = $(document.createElement('div')).addClass('timeChange').html(startTimeChangeHTML + endTimeChangeHTML).append(buttonGroup);
	//var timeColumn = $(document.createElement('td')).addClass('time').append(timeDisplay).append(timeChange);

	var confirmDeleteHTML = 'Are you sure you want to delete?<br> This cannot be undone.<br><br>' + 
				'<button class="btn btn-sm btn-danger" id="yes-delete-'+venue.id+'">Yes, delete</button>' + 
				'<button class="btn btn-sm btn-primary" id="no-cancel-'+venue.id+'">No, cancel</button>';
	var confirmDelete = $(document.createElement('div')).addClass('confirmDelete').html(confirmDeleteHTML);
	var timeColumn = $(document.createElement('td')).addClass('time').append(timeDisplay).append(timeChange).append(confirmDelete);

	// map - create and append the element to DOM before Leaflet loads it
	var map = $(document.createElement('div')).addClass('mini-map').attr('id', 'map' + venue.id);
	var mapEl = $(document.createElement('td')).append(map);
	
	var editHTML = '<button class="btn btn-primary btn-sm" id="edit-' + venue.id + '">Edit</button>';
	var editColumn = $(document.createElement('td')).addClass('edit-venue').html(editHTML);

	// append the icon, venue info, time, and map columns to a row element
	var row = $(document.getElementById('tr-' + venue.id)).append(iconColumn).append(venueColumn).append(timeColumn).append(mapEl).append(editColumn);

	
	// prepopulate date/time pickers with current values
	$("#start-date-picker-" + venue.id).val(getCalendarString(venue.startDate));
	$("#start-time-picker-" + venue.id).val(getInputTimeString(venue.startDate));
	$("#end-date-picker-" + venue.id).val(getCalendarString(venue.endDate));
	$("#end-time-picker-" + venue.id).val(getInputTimeString(venue.endDate));
	

	var leafletMap = L.map('map' + venue.venue.id, {
		center: [venue.venue.location.lat, venue.venue.location.lng],
		zoom: 16,
		dragging: true
	});
	L.tileLayer('http://{s}.tile.cloudmade.com/' + cloudMadeAPIKey + '/997/256/{z}/{x}/{y}.png', {
	    maxZoom: 50
	}).addTo(leafletMap);
	L.marker([venue.venue.location.lat, venue.venue.location.lng]).addTo(leafletMap);

	// more details
}

//=============================================================================
//=============================================================================
// Adding to current itinerary
//=============================================================================
//=============================================================================

$( ".date-picker#date-picker-start" ).datepicker({
	changeMonth: true,
	changeYear: true,
	showButtonPanel: true
});
$( ".date-picker#date-picker-end" ).datepicker({
	changeMonth: true,
	changeYear: true,
	showButtonPanel: true
});
$(".time-picker#time-picker-start").timePicker({
	show24Hours: false
});
$( ".date-picker#date-picker-end" ).datepicker({
	changeMonth: true,
	changeYear: true,
	showButtonPanel: true
});

// Hide adding venues div at first
$("#add-venues-content").hide();

var durLength = 400;
// When click "Add venues," show search sidebar
$("#show-add-venues").click(function() {
	//$('.timeChange').hide();
	//$('.timeDisplay').show();
	$("#itinerary-content").animate({
       width: '50%'
    }, { duration: durLength, queue: false });
    $("#add-venues-content").show({
		effect: "slide",
		duration: durLength,
		queue: false,
		direction: "right"
	});
	$("#itinerary-content").css("border-right", "1px solid #ccc");
	$("#hide-add-venues").show();
	$("#show-add-venues").hide();
	$(".edit-venue").hide();
});

// When click "Done adding," hide search sidebar
$("#hide-add-venues").click(function() {
	$("#itinerary-content").animate({
       width: '100%'
    }, { duration: durLength, queue: false });
    $("#add-venues-content").hide({
		effect: "slide",
		duration: durLength,
		queue: false,
		direction: "right"
	});
	$("#itinerary-content").css("border-right", "none");
	$("#show-add-venues").show();
	$("#hide-add-venues").hide();
	$(".edit-venue").show();
	
	clearOldSearch();
	
	// TODO: WRITE TO FILE
});

// reset all fields and clear displayed search
function clearOldSearch() {
	$("#query").val("");
	$("#location").val("");
	$("#error-holder").css("display", "none");
	$("#search-results").html(" ");
}

// TODO: printer-friendly itinerary version
$("#printer-view").click(function(){
	alert("Coming soon :)");
});

// Gathers parameters and sends search request to Foursquare API
$("#search-for-venues").click(function() {
	//error checking first - must have venue name and geocode for search
	$("#error-holder").css("display","none");
	var error = "";
	var query = $("#query").val();
	var location = $("#location").val();
	if(query == "") {
		error += "Please give part of a venue name so we can search for you.<br>";
	}
	if(location == "") {
		error += "Please give an area within which to search.";
	}
	
	//set error to hold either "" or new error(s)
	$("#error-holder").html(error);
	if(error != ""){
		$("#error-holder").css("display","block");
	}
	
	// if no errors, send search request and parse results
	if(error == "") {
		var urlToSend = baseURL + "search?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET;
		urlToSend += "&query=" + encodeURIComponent(query) + "&near=" + encodeURIComponent(location);
		console.log("Sending request: " + urlToSend);
		
		// display loading gif to user
		$("#loading-image").css("display", "block");
		$("#search-results").html(" ");
		
		// send request
		$.ajax({
		  url: urlToSend
		}).done(function( data ) {
			// hide loading gif
			$("#loading-image").css("display", "none");
			
			// parse response data
			if(!data.response.venues[0]) {
				// display no-results error
				$("#search-results").html("Sorry, we couldn't find any matching results.");
			} else {
				// display results to user
				showResults(data.response.venues);
			}
			
			// log response for debugging
			if ( console && console.log ) {
			  console.log(data);
			}
		});
	}
});

// Next two functions allow user to search by hitting ENTER
$("#query").keypress(function(e){
	if(e.which == 13) {
		$("#search-for-venues").click();
	}
});
$("#location").keypress(function(e){
	if(e.which == 13) {
		$("#search-for-venues").click();
	}
});

// Displays results for user
function showResults(venues) {
	for(var i = 0; i < venues.length; i++) {
		var name = venues[i].name;
		var address = "";
		if(venues[i].location.address) {
			address += venues[i].location.address;
		} else {
			address += "(No address provided)";
		}
		if(venues[i].location.crossStreet) {
			address += "<br>Cross Street: " + venues[i].location.crossStreet + "";
		}
		var id = venues[i].id;
		var category;
		venues[i].categories.forEach(function(cat) {
			if (cat.primary) {
				category = cat;
			}
		});
		

		$("#search-results").append(buildResultPanel(i, name, address, id, category));
		var mapID = 'panel-map-' + i;
		var lat = venues[i].location.lat;
		var lng = venues[i].location.lng;
		var map = L.map(mapID).setView([lat, lng], 16);
		L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
			attribution: '',
			maxZoom: 18
		}).addTo(map);
		L.marker([lat, lng]).addTo(map)
			.bindPopup('Pretty popup. <br> Easily customizable.');
	}
	$('.panel-search-result').on('click', function() {
		var id = $(this).find('.hidden-venue-id').text();
		console.log(id);
		$(this).find('.panel-set-time').toggle(400);
	});

}

// Builds the panel for a single search result
function buildResultPanel(number, name, address, id, category) {
	var icon = category.icon.prefix + "bg_88" + category.icon.suffix;

	var startTimeSetHTML = 
	'<span width="400px;"><b>Start</b></span>' + 
	'<form class="form-inline" role="form">' + 
  		'<div class="form-group">' + 
    		'<label class="sr-only" for="start-date-picker-result-' + number + '">Date</label>' + 
    		'<input type="date" class="form-control date-picker" id="start-date-picker-result-' + number + '" placeholder="Date">' + 
  		'</div>' + 
 		 '<div class="form-group">' + 
			'<label class="sr-only" for="start-time-picker-result-' + number + '">Time</label>' + 
			'<input type="time" class="form-control time-picker" id="start-time-picker-result-' + number + '" placeholder="Time" size="10" autocomplete="OFF">' + 
  		'</div>' + 
	'</form>';

	var endTimeSetHTML = 
	'<span width="400px;"><b>End</b></span>' + 
	'<form class="form-inline" role="form">' + 
  		'<div class="form-group">' + 
    		'<label class="sr-only" for="end-date-picker-result-' + number + '">Date</label>' + 
    		'<input type="date" class="form-control date-picker" id="end-date-picker-result-' + number + '" placeholder="Date">' + 
  		'</div>' + 
 		 '<div class="form-group">' + 
			'<label class="sr-only" for="end-time-picker-result-' + number + '">Time</label>' + 
			'<input type="time" class="form-control time-picker" id="end-time-picker-result-' + number + '" placeholder="Time" size="10" autocomplete="OFF">' + 
  		'</div>' + 
	'</form>';

	var html = 
		'<div class="panel panel-default panel-search-result">' +
            '<div class="panel-body">' +
            	'<table><tbody>' + 
            		'<tr>' + 
            			'<td><img src="' + icon + '" style="padding-right:10px;"></td>' + 
            			'<td style="width:300px">' +
            				'<h4 class="list-group-item-heading">'+ name + '</h4>' + 
            				'<p>' + address + '</p>' + 
            				'<p>' + category.name + '</p>' + 
            			'</td>' + 
            			'<td><div class="panel-map" id="panel-map-' + number +'"></div></td>' + 
            			
            		'</tr>' + 
            	'</tbody></table>' +
            '</div>' +
            '<div class="panel-set-time style="display:none"><table>' + 
            	'<tr>' + 
            		'<td style="width:400px">' + startTimeSetHTML + endTimeSetHTML + '</td>' + 
            		'<td><div class="panel-add-button btn btn-lg btn-primary">+<br>Add<br>' + 
            				'<span class="hidden-venue-id">' + id + '</span></div>' +
            			'</td>' + 
            	'</tr>' +
            	
            	
            '</table></div>' +
          '</div>';
	return html;
}



// very similar to lookup function, but uses venueID directly
// TODO: have user select time and date instead of hard-coded
var lookupByID = function(venueID) {
	var urlToSend = formatVenueLookupURL(venueID);
	$.ajax({
		  url: urlToSend
		}).done(function(data) {
			var fullVenue = data.response.venue;
			console.log(fullVenue);
			
			itinerary.itinerary.push({
				id: venueID,
				startDate: "Tue Jul 02 2013 16:30:00 GMT-0400 (Eastern Daylight Time)",
				endDate: "Tue Jul 02 2013 16:45:00 GMT-0400 (Eastern Daylight Time)",
				venue: fullVenue
			});
			
			addSingleVenue();
	});
}

// Takes the new itinerary, sorts it, and displays everything
function addSingleVenue() {
	//sort itinerary first
	itinerary.itinerary.sort(function(a,b) {
		var dateA = new Date(a.startDate);
		var dateB = new Date(b.startDate);
		
		if(dateA > dateB) 
			return 1;
		if(dateA < dateB)
			return -1;
		return 0;
	});
	
	// clear out table
	$("#venue-table-tbody").html(" ");
	
	//go through everything in itinerary and re-display
	itinerary.itinerary.forEach(function(venue){
		// create and append tr element before lookup, async call might mess up order
		var row = $(document.createElement('tr')).attr("id", "tr-" + venue.id);
		//var expand = $(document.createElement('tr')).attr("id", "tr-expand-" + venue.id);

		$('tbody#venue-table-tbody').append(row);
		
		displayVenue(venue);
	});
}

// Add venue to itinerary when add button clicked 
// Note: jQuery .click doesn't pick up elements when added to the page after load,
// so using .on here
$(document).on('click', '.panel-add-button', function(){
	var venueID = $(event.target).children("span.hidden-venue-id").text();
	console.log("Venue ID: " + venueID);
	
	$("#search-results").hide();
	$("#add-venue-build-controls").show();
	
	$("#add-venue-get-build").click(function(){
		//TODO: error checking on inputs
		//TODO: show user feedback
		
		// create and append tr element before lookup, async call might mess up order
		var row = $(document.createElement('tr')).attr("id", "tr-" + venueID);
		$('tbody#venue-table-tbody').append(row);
		
		lookupByID(venueID);
		
		//TODO: show complete
		$("#add-venue-build-controls").hide();
		$("#search-results").show();
	});
	
	// if click "cancel" just switch view back
	$("#cancel-add").click(function(){
		$("#add-venue-build-controls").hide();
		$("#search-results").show();
	});
});

// clears all fields and old search results
$("#clear-search").click(function(){
	clearOldSearch();
});



//=============================================================================
//=============================================================================
// Editing current itinerary
//=============================================================================
//=============================================================================

//when "edit" button clicked, show edit areas for that venue
$(document).on('click', '.edit-venue', function(){
	//get id of venue clicked
	var editIDfull = $(this).children('button').attr('id');
	console.log("clicked " + editIDfull);
	
	//id in form edit-###, so split at - and take the second part
	var editParts = editIDfull.split("-");
	var editID = editParts[1];
	
	var thisVenue = null;
	var i = 0;
	var max = itinerary.itinerary.length;
	var found = false;
	//grab the venue to edit it
	while(!found && i < max) {
		//TODO: error check with dates too in case repeat venues
		if(itinerary.itinerary[i].venue.id == editID) {
			//alert("FOUND IT!");
			thisVenue = itinerary.itinerary[i].venue;
			found = true;
		}
		i++;
	}
	i--;
	if(!found) { alert("Sorry, we encountered an error."); }
	
	//assuming venue found, show editing areas and detect changes
	else {
		//get the containing tr
		var parentTR = $("#tr-" + editID);
		console.log(parentTR);
		var timeDisplayDiv = parentTR.children('.time').children('.timeDisplay');
		var timeChangeDiv = parentTR.children('.time').children('.timeChange');
		var confirmDeleteDiv = parentTR.children('.time').children('.confirmDelete');
		var editButton = $("#edit-" + thisVenue.id);
		
		//hide edit button and current time display, show editing areas
		editButton.hide();

		//timeDisplayDiv.hide('slow');
		//timeChangeDiv.show(10000); //TODO: prepopulate with current values

		timeDisplayDiv.hide( 400, function () { 
            timeChangeDiv.show( 400 ); //TODO: prepopulate with current values
        });
		

		
		//when click "delete" remove element from itinerary and table
		$("#delete-" + thisVenue.id).click(function(){
			timeChangeDiv.hide();
			confirmDeleteDiv.show();
			
			$("#no-cancel-" + thisVenue.id).click(function(){
				confirmDeleteDiv.hide();
				timeChangeDiv.show();
			});
			
			$("#yes-delete-" + thisVenue.id).click(function() {
				//remove venue from itinerary
				itinerary.itinerary.splice(i, 1);
				//remove venue from display
				var tbody = document.getElementById("venue-table-tbody");
				var trChild = document.getElementById("tr-" + thisVenue.id);
				var throwawayNode = tbody.removeChild(trChild);
			});
		});
		
		//when click "done" hide editing areas and show edit button, new time
		$("#done-" + thisVenue.id).click(function(){
			timeChangeDiv.hide(500, function() {
				timeDisplayDiv.show(); //TODO: UPDATE TIME
				editButton.show();
			});
		});
	}
});
