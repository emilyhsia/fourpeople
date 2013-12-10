/** Javascript functionality for itinerary */

var baseURL = "https://api.foursquare.com/v2/venues/";
var CLIENT_ID = "5CYXNIKAOPTKCKIGHNPPJ3DQJBY4IPL0XJL140TLN121U514";
var CLIENT_SECRET = "RPZTJ5NHBY0L213UKWP3T3DF2QVUXNKMW34FRJOUZFDIFNDM&v=20131124";
var cloudMadeAPIKey = '7da9717aa6e646c2b4d6a6a1fbc94765';

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

//get id from URL
//split at & if multiple parameters passed; id must be first
//TODO: make more robust
var idEquals = location.search.split("&")[0];
var itineraryID = parseInt(idEquals.split("=")[1]);

//if sample itinerary, redirect to sample page (non-edit)
if(itineraryID <= numSamples && location.href.indexOf("sample-itinerary.html") == -1 ) {
	window.location.href = "sample-itinerary.html?id=" + itineraryID;
}
//if not sample itinerary and accidentally on sample page, redirect to regular 
if(itineraryID > numSamples && location.href.indexOf("sample-itinerary.html") != -1 ) {
	window.location.href = "itinerary.html?id=" + itineraryID;
}

//locate itinerary and put in variable as handle for page
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
n--;

// TODO: make this error message cooler
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

//set printer button
$("#printer-view-ahref").attr('href', 'printer-view.html?id='+itinerary.id);

$('h1#itinerary-title span#itinerary-title-name').text(itinerary.name);
$('h1#itinerary-title span#itinerary-title-id').text('(id: ' + itinerary.id + ')');
$('#itinerary-name').val(itinerary.name);
$('#itinerary-name').hide();
$('#save-itinerary-name').hide();
$('#cancel-save-itinerary-name').hide();
$('#confirm-delete-info').hide();

// if click "edit name," show editing input/buttons
$("#edit-itinerary-name").click(function(){
	$('h1#itinerary-title').hide();
	$('#itinerary-title-action-buttons').hide();
	$('#itinerary-name').val(itinerary.name);
	$('#itinerary-name').show();
	$('#save-itinerary-name').show();
	$('#cancel-save-itinerary-name').show();
});

// if cancel name edit, hide editing input/buttons 
$('#cancel-save-itinerary-name').click(function() {	
	$('#itinerary-name').hide();
	$('#save-itinerary-name').hide();
	$('#itinerary-title-action-buttons').show();
	$('#cancel-save-itinerary-name').hide();
	$('h1#itinerary-title').show();

});

// if save name edit, hide editing input/buttons,
// save input as name, and update name h1
$('#save-itinerary-name').click(function() {
	$('#itinerary-name').hide();
	$('#save-itinerary-name').hide();
	$('#cancel-save-itinerary-name').hide();
	$('#itinerary-title-action-buttons').show();
	itinerary.name = $('#itinerary-name').val();
	$('h1#itinerary-title span#itinerary-title-name').html(itinerary.name);
	$('h1#itinerary-title').show();
	
	// store new itinerary name
	storeItinerary();
});

// if click "delete," make user confirm first
$("#delete-itinerary").click(function() {
	$('#confirm-delete-info').show();
	$('#yes-delete-this-itinerary').show();
	$('#no-cancel-this-delete').show();
});

// if click cancel, hide delete info
$('#no-cancel-this-delete').click(function(){
	$('#yes-delete-this-itinerary').hide();
	$('#no-cancel-this-delete').hide();
	$('#confirm-delete-info').hide();
});

// if click yes, delete, then delete itinerary and redirect to existing itineraries
$('#yes-delete-this-itinerary').click(function(){
	var i = 0;
	var itineraryFound = false;
	while(!itineraryFound) {
		if(itineraries[i].id == itinerary.id) {
			itineraryFound = true;
		}
		i++;
	}
	i--;
	//remove venue from itinerary
	itineraries.splice(i, 1);
	store.set('fourpeople', JSON.stringify(itineraries));
	
	//redirect to existing itineraries
	window.location.href = "existing-itineraries.html";
});

var formatVenueLookupURL = function(id) {
	var URL = baseURL + encodeURIComponent(id) + "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET;
	return URL;
}

/*
 * Given a venueObject, retreives the corresponding Foursquare venue
 * and calls callback with the Foursquare result injected into our
 * venueObject
 */
var lookupFoursquareVenue = function(venueObject, callback) {
	var urlToSend = formatVenueLookupURL(venueObject.id);
	$.ajax({
		  url: urlToSend
		}).done(function(data) {
			// data.response.venue is the Foursquare venue object
			// We inject the Foursquare venue to our venue object to display
			venueObject.venue = data.response.venue;
			// call the callback with the venueObject that now includes the injected Foursqaure venue
			callback(venueObject);
	});
}


/* 
 * Displays a single venue. The venue param is the a venue Object with the injected Foursquare venue
 * The <tr> element for the single venue should already be created and appended to the DOM (do this to preserve order
 * from async calls)
 * 
 * Each venue is displayed as a single row in a table
 * ------------------------------------------------
 * |  cate	|	venue	|				|			|
 * |  gory	|   info 	|	time		|	map		|						
 * |  icon	|			|				|			|
 *  ------------------------------------------------  
 */
var displayVenue = function(venue) {
	
	// Get the venue category
	// Foursquare gives us a lot of different categories, but we only care about the "primary" one
	var category = _setVenuePrimaryCategory(venue);

	// category icon
	var iconColumn = _createCategoryIconColumn(category);

	// venue info
	var venueInfoColumn = _createVenueInfoColumn(venue);

	// The time column handles the bulk of the work. It displays time, allows the user to change the time, and allows the user to delete the venue
	var timeDisplay = $(document.createElement('div')).addClass('timeDisplay').text(getDisplayTimeString(venue.startDate) + " - " + getDisplayTimeString(venue.endDate));

	// time change
	var startTimeChangeHTML = 
	'<span width="400px;"><b>Start</b></span>' + 
	'<form class="form-inline" role="form">' + 
  		'<div class="form-group">' + 
    		'<label class="sr-only" for="start-date-picker-' + venue.id + '">Date</label>' + 
    		'<input type="date" class="start-date-picker form-control date-picker" id="start-date-picker-' + venue.id + '" placeholder="Date">' + 
  		'</div>' + 
 		 '<div class="form-group">' + 
			'<label class="sr-only" for="start-time-picker-' + venue.id + '">Time</label>' + 
			'<input type="time" class="start-time-picker form-control time-picker" id="start-time-picker-' + venue.id + '" placeholder="Time" size="10" autocomplete="OFF">' + 
  		'</div>' + 
	'</form>';

	var endTimeChangeHTML = 
	'<span width="400px;"><b>End</b></span>' + 
	'<form class="form-inline" role="form">' + 
  		'<div class="form-group">' + 
    		'<label class="sr-only" for="end-date-picker-' + venue.id + '">Date</label>' + 
    		'<input type="date" class="end-date-picker form-control date-picker" id="end-date-picker-' + venue.id + '" placeholder="Date">' + 
  		'</div>' + 
 		 '<div class="form-group">' + 
			'<label class="sr-only" for="end-time-picker-' + venue.id + '">Time</label>' + 
			'<input type="time" class="end-time-picker form-control time-picker" id="end-time-picker-' + venue.id + '" placeholder="Time" size="10" autocomplete="OFF">' + 
  		'</div>' + 
	'</form>';

	var timeChangeStatusHolder = '<div class="alert" id="datetime-status-holder-venue-' + venue.id + '" style="display: none;"></div>';
	var doneButton = '<button class="btn btn-primary btn-sm" id="done-' + venue.id + '">Save</button>';
	var deleteButton = '<button class="btn btn-danger btn-sm" id="delete-' + venue.id + '">Delete</button>';
	var buttonGroup = $(document.createElement('div')).html(doneButton + deleteButton);
	buttonGroup.css("margin-top", "10px");
	var timeChange = $(document.createElement('div')).addClass('timeChange').html(timeChangeStatusHolder + startTimeChangeHTML + endTimeChangeHTML).append(buttonGroup);

	// Confirm delete
	var confirmDeleteHTML = 'Are you sure you want to delete?<br> This cannot be undone.<br><br>' + 
				'<button class="btn btn-sm btn-danger" id="yes-delete-'+venue.id+'">Yes, delete</button>' + 
				'<button class="btn btn-sm btn-primary" id="no-cancel-'+venue.id+'">No, cancel</button>';
	var confirmDelete = $(document.createElement('div')).addClass('confirmDelete').html(confirmDeleteHTML);
	var timeColumn = $(document.createElement('td')).addClass('time').append(timeDisplay).append(timeChange).append(confirmDelete);

	
	
	var editHTML = '<button class="btn btn-primary btn-sm" id="edit-' + venue.id + '">Edit</button>';
	var editColumn = $(document.createElement('td')).addClass('edit-venue').html(editHTML);

	// append the icon, venue info, time, and map columns to a row element
	var row = $(document.getElementById('tr-' + venue.id)).append(iconColumn).append(venueInfoColumn).append(timeColumn).append(editColumn);

	$(row).on('mouseover', function() {
		if ($('#add-venues-content').css('display') == 'none' && $('.timeChange').css('display') == 'none') {
			$("#edit-" + venue.id).show();
		}
	});
	$(row).on('mouseout', function() {
		$("#edit-" + venue.id).hide();
	});
	$(row).on('click', function() {

	});
	// prepopulate date/time pickers with current values
	$("#start-date-picker-" + venue.id).val(getCalendarString(venue.startDate));
	$("#start-time-picker-" + venue.id).val(getInputTimeString(venue.startDate));
	$("#end-date-picker-" + venue.id).val(getCalendarString(venue.endDate));
	$("#end-time-picker-" + venue.id).val(getInputTimeString(venue.endDate));

	var leafletMap = L.map('map' + venue.venue.id, {
		center: [venue.venue.location.lat, venue.venue.location.lng],
		zoom: 16,
		dragging: true,
		scrollWheelZoom: false
	});
	L.tileLayer('http://{s}.tile.cloudmade.com/' + cloudMadeAPIKey + '/997/256/{z}/{x}/{y}.png', {
	    maxZoom: 50
	}).addTo(leafletMap);
	L.marker([venue.venue.location.lat, venue.venue.location.lng]).addTo(leafletMap);

	// more details
}

/* 
 * Goes through all the Foursquare venue.categories for the specified venue and stores the main/"primary"
 * category as venue.category
 * @type helper
 */
var _setVenuePrimaryCategory = function(venueObject) {
	var primary;
	venueObject.venue.categories.forEach(function(category) {
		if (category.primary) {
			primary = category;
		}
	});
	venueObject.venue.category = primary;
	return primary;
}

/*
 * Creates and returns the icon column
 * @type helper
 */
var _createCategoryIconColumn = function(category) {
	var iconColumn;
	if(category != null){
		var iconColumn = $(document.createElement('td')).addClass('icon');
		var iconImg = document.createElement('img');
		$(iconImg).attr("src", category.icon.prefix + "bg_88" + category.icon.suffix).addClass('img-circle');
		var timeline = $(document.createElement('div')).addClass("timeline");
		iconColumn.append(timeline).append(iconImg);
	} else {
		iconColumn = "<td></td>";
	}
	return iconColumn;
}

/* 
 * Creates and returns the venue info table a single venue. 
 * @type helper
 * The venue param is the a venue Object with the injected Foursquare venue
 * Venue info = name, rating, address, category type
 * 
 *  name 				
 * ----------------------
 * |     	| address	|
 * | rating	| category 	|
 *  ---------------------
 */
var _createVenueInfoColumn = function(venue) {
	// name
	var name = $(document.createElement('h4')).addClass('list-group-item-heading').text(venue.venue.name);
	// Now create mini table that holds rating, address, and category
	var infoTable = $(document.createElement('table')).append($(document.createElement('tbody')));
	// rating
	var ratingHeader = $(document.createElement('h3')).addClass('rating');
	var ratingSpan = $(document.createElement('span')).text(venue.venue.rating).addClass('label').addClass('label-success');
	ratingHeader.append(ratingSpan);
	var ratingColumn = $(document.createElement('td')).append(ratingHeader);
	// address & category
	var addressText = $(document.createElement('p')).text(venue.venue.location.address).css("margin-bottom", "0px");
	var categoryText;
	var categoryText = $(document.createElement('p')).html(venue.venue.category.shortName);
	/*
	if(venue.venue.category != null) { 
		$(document.createElement('p')).text(venue.venue.category.shortName);
	} else {
		$(document.createElement('p')).text("(No category)");
	}*/
	var addressCategoryDiv = $(document.createElement('div')).addClass('info').append(addressText).append(categoryText);
	var addressCategoryColumn = $(document.createElement('td')).append(addressCategoryDiv);
	// rating and venue info table
	var row = $(document.createElement('tr')).append(ratingColumn).append(addressCategoryColumn);
	var ratingAddressCategoryTable = $(document.createElement('table')).append($(document.createElement('tbody')).append(row));
	
	// map - create and append the element to DOM before Leaflet loads it
	var map = $(document.createElement('div')).addClass('mini-map').attr('id', 'map' + venue.id);
	var mapEl = $(document.createElement('td')).append(map);

	var venueInfoColumn = $(document.createElement('td')).addClass('venue').append(name).append(ratingAddressCategoryTable).append(map);
	return venueInfoColumn;
}

// display itinerary on page load
displayAllVenues();


function displayAllVenues() {
	if(itinerary.itinerary.length > 0) {
		$("#no-venues-error").hide();
	}
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
	var lastDate = "";
	//display all venues
	itinerary.itinerary.forEach(function(venue){
		// Check if it's a different day
		if (isDifferentDay(lastDate, venue.startDate)) {
			var wordsDate = getWordsDateString(venue.startDate);
			var dateRow = $(document.createElement('tr')).attr("id", "tr-date-" + wordsDate).addClass('tr-date');
			var dateHeader = '<div><h2 class="list-group-item-heading"><span class="label label-info">' + wordsDate + '</span></h2></div>';
			//var floatingDateHeader = '<div id="floating-date-' + wordsDate + '"><h2 class="list-group-item-heading"><span class="label label-info">' + wordsDate + '</span></h2></div>';
			//var timeline = '<div class="timeline"></div>';
			dateRow.html(dateHeader);
			$('tbody#venue-table-tbody').append(dateRow);
			lastDate = venue.startDate;
		}
		// create and append tr element before lookup, async call might mess up order
		var row = $(document.createElement('tr')).attr("id", "tr-" + venue.id);
		//var expand = $(document.createElement('tr')).attr("id", "tr-expand-" + venue.id);

		$('tbody#venue-table-tbody').append(row);
		
		lookupFoursquareVenue(venue, displayVenue);

	});

	detectCollision();
}


//=============================================================================
//=============================================================================
// Adding to current itinerary
//=============================================================================
//=============================================================================



// Hide adding venues div at first
$("#add-venues-content").hide();

var showAddVenuesPanel = function() {
	$('.timeChange').css('display', 'none');
	console.log('showing');

	//$('.timeChange').hide();
	//$('.timeDisplay').show();
	if(document.body.offsetWidth > 1024) {
		$("#itinerary-content").animate({
		   width: '50%'
		}, { duration: durLength, queue: false });
	} else {
		$("#itinerary-content").animate({
		   width: '58%'
		}, { duration: durLength, queue: false });
	}
    $("#add-venues-content").show({
		effect: "slide",
		duration: 400,
		queue: false,
		direction: "right"
	});
	$("#itinerary-content").css("border-right", "1px solid #ccc");
	$("#hide-add-venues").show();
	$("#show-add-venues").hide();
	$(".edit-venue").hide();
}

var durLength = 400;
// When click "Add venues," show search sidebar
$("#show-add-venues").click(showAddVenuesPanel);

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
	$("#add-venue-error-holder").css("display", "none");
	$("#search-results").html(" ");
}

// Gathers parameters and sends search request to Foursquare API
$("#search-for-venues").click(function() {
	//error checking first - must have venue name and geocode for search
	$("#add-venue-error-holder").css("display","none");
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
	$("#add-venue-error-holder").html(error);
	if(error != ""){
		$("#add-venue-error-holder").css("display","block");
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
$('#itinerary-name').keypress(function(e) {
	if(e.which == 13) {
		$("#save-itinerary-name").click();
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

		// Prepopulating the datetime pickers
		var prepopulatedStartTimeDate = getNextAvailableTime();
		$('.start-date-picker-result').val(getCalendarString(prepopulatedStartTimeDate));
		$('.start-time-picker-result').val(getInputTimeString(prepopulatedStartTimeDate));
		var prepopulatedEndTimeDate = addHour(prepopulatedStartTimeDate);
		$('.end-date-picker-result').val(getCalendarString(prepopulatedEndTimeDate));
		$('.end-time-picker-result').val(getInputTimeString(prepopulatedEndTimeDate));

		var mapID = 'panel-map-' + i;
		var lat = venues[i].location.lat;
		var lng = venues[i].location.lng;
		var map = L.map(mapID, {scrollWheelZoom: false}).setView([lat, lng], 16);
		L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
			attribution: '',
			maxZoom: 18
		}).addTo(map);
		L.marker([lat, lng]).addTo(map)
			.bindPopup('Pretty popup. <br> Easily customizable.');
	}

	// When a search result is clicked, show/hide the datetime picker
	// @type event listener
	$('.panel-body-click-target').on('click', function() {
		var id = $(this).find('.hidden-venue-id').text();
		$(this).siblings('.panel-set-time').toggle(400);
	});
	

}

/*
 * Gets the next available time to prepopulate date/time for search results, which
 * is the end date/time of the very last venue on the itinerary.
 */
function getNextAvailableTime() {
	if(itinerary.itinerary.length > 0) {
		var lastVenue = itinerary.itinerary[itinerary.itinerary.length - 1];
		return lastVenue.endDate;
	} else {
		var now = new Date();
		now.setMinutes(0);
		now.setHours(now.getHours() + 1);
		return now;
	}
}

// Builds the panel for a single search result
function buildResultPanel(number, name, address, id, category) {
	//var category = [];
	//var icon = "";
	if(category.icon != null) {
		icon = category.icon.prefix + "bg_88" + category.icon.suffix;
	} else {
		category.name = "(No category)";
	}
	

	var startTimeSetHTML = 
	'<span width="400px;"><b>Start</b></span>' + 
	'<form class="form-inline" role="form">' + 
  		'<div class="form-group">' + 
    		'<label class="sr-only" for="start-date-picker-result-' + number + '">Date</label>' + 
    		'<input type="date" class="start-date-picker-result start-date-picker form-control date-picker" id="start-date-picker-result-' + number + '" placeholder="Date">' + 
  		'</div>' + 
 		 '<div class="form-group">' + 
			'<label class="sr-only" for="start-time-picker-result-' + number + '">Time</label>' + 
			'<input type="time" class="start-time-picker-result start-time-picker form-control time-picker" id="start-time-picker-result-' + number + '" placeholder="Time" size="10" autocomplete="OFF">' + 
  		'</div>' + 
	'</form>';

	var endTimeSetHTML = 
	'<span width="400px;"><b>End</b></span>' + 
	'<form class="form-inline" role="form">' + 
  		'<div class="form-group">' + 
    		'<label class="sr-only" for="end-date-picker-result-' + number + '">Date</label>' + 
    		'<input type="date" class="end-date-picker-result end-date-picker form-control date-picker" id="end-date-picker-result-' + number + '" placeholder="Date">' + 
  		'</div>' + 
 		 '<div class="form-group">' + 
			'<label class="sr-only" for="end-time-picker-result-' + number + '">Time</label>' + 
			'<input type="time" class="end-time-picker-result end-time-picker form-control time-picker" id="end-time-picker-result-' + number + '" placeholder="Time" size="10" autocomplete="OFF">' + 
  		'</div>' + 
	'</form>';

	var html = 
		'<div class="panel panel-default panel-search-result">' +
            '<div class="panel-body panel-body-click-target">' +
            	'<table><tbody>' + 
            		'<tr>' + 
            			'<td><img src="' + icon + '" style="padding-right:10px;"></td>' + 
            			'<td style="width:300px">' +
            				'<h4 class="list-group-item-heading">'+ name + '</h4>' + 
            				'<p>' + address + '</p>' + 
            				'<p>' + category.name + '</p>' + 
            			'</td>' + 
            			'<td><div class="panel-map" id="panel-map-' + number +'"></div></td>' + 
            			'<span class="hidden-venue-id">' + id + '</span></div>' +
            		'</tr>' + 
            	'</tbody></table>' +
            '</div>' +
            '<div class="panel-set-time style="display:none"><table>' + 
            	'<tr>' + 
            		'<div class="alert" id="datetime-status-holder-result-' + number + '" style="display: none;"></div>' +
            		'<td style="width:400px">' + startTimeSetHTML + endTimeSetHTML + '</td>' + 
            		'<td><div class="panel-add-button btn btn-lg btn-primary" id="add-button-result-' + number + '">+<br>Add<br>' + 
            				'<span class="hidden-venue-id">' + id + '</span></div>' +
            			'</td>' + 
            	'</tr>' +
            	
            	
            '</table></div>' +
          '</div>';
	return html;
}


// Takes the new itinerary, sorts it, and displays everything
var sortAndDisplayItinerary = function(newVenue) {
	// hide no-venues-error, just in case was showing from empty
	$("#no-venues-error").hide();
	
	//sort itinerary first
	sortItinerary();
	
	// clear out table
	$("#venue-table-tbody").html(" ");
	
	//go through everything in itinerary and re-display
	var lastDate = "";
	itinerary.itinerary.forEach(function(venue){
		// Check if it's a different day
		if (isDifferentDay(lastDate, venue.startDate)) {
			var wordsDate = getWordsDateString(venue.startDate);
			var dateRow = $(document.createElement('tr')).attr("id", "tr-date-" + wordsDate).addClass('tr-date');
			var dateHeader = '<div><h2 class="list-group-item-heading"><span class="label label-info">' + wordsDate + '</span></h2></div>';
			//var floatingDateHeader = '<div id="floating-date-' + wordsDate + '"><h2 class="list-group-item-heading"><span class="label label-info">' + wordsDate + '</span></h2></div>';
			//var timeline = '<div class="timeline"></div>';
			dateRow.html(dateHeader);
			$('tbody#venue-table-tbody').append(dateRow);
			lastDate = venue.startDate;
		}

		// First create and append tr element before lookup, async call might mess up order
		var row = $(document.createElement('tr')).attr("id", "tr-" + venue.id);
		$('tbody#venue-table-tbody').append(row);
		displayVenue(venue);
	});

	// highlight the newly added venue and fade out
	$('#tr-' + newVenue.id).addClass('highlight-venue');
	var top = $('#tr-' + newVenue.id).offset().top;
	$('html, body').animate({
        scrollTop: $('#tr-' + newVenue.id).offset().top - 50
    }, 1500);
	setTimeout(function() {
		$('#tr-' + newVenue.id).removeClass('highlight-venue');
	}, 2100);

	//see if any time overlaps
	detectCollision();
	
	// store new itinerary
	storeItinerary();
}

//TODO: debug
function detectCollision(){
	if(itinerary.itinerary.length > 2) {
		for (var i = 1; i< itinerary.itinerary.length-1; i++){
			var beforeEnd = new Date(itinerary.itinerary[i-1].endDate);
			var currentStart = new Date(itinerary.itinerary[i].startDate);
			var currentEnd = new Date(itinerary.itinerary[i].endDate);
			var afterStart = new Date(itinerary.itinerary[i+1].startDate);
		

			if (currentStart < beforeEnd){
				console.log("COLLISIONTop");
				$("#tr-" +(itinerary.itinerary[i].id)).css("border-top","5px solid rgba(255, 0, 0, .3)");
				$("#tr-" + (itinerary.itinerary[i].id) + " .time").css("color", "#FF0000");

				//if there is a collison on the second item, change the first one too
				if (i == 1){
					$("#tr-" +(itinerary.itinerary[i-1].id)).css("border-bottom","5px solid rgba(255, 0, 0, .3)");
					$("#tr-" + (itinerary.itinerary[i-1].id) + " .time").css("color", "#FF0000");
				}
			} 
			if (currentStart >= beforeEnd){
				console.log("COLLISIONTop");
				$("#tr-" +(itinerary.itinerary[i].id)).css("border-top","1px solid gray");
				$("#tr-" + (itinerary.itinerary[i].id) + " .time").css("color", "#333333");

				//if there is a collison on the second item, change the first one too
				if (i == 1){
					$("#tr-" +(itinerary.itinerary[i-1].id)).css("border-bottom","1px solid gray");
					$("#tr-" + (itinerary.itinerary[i-1].id) + " .time").css("color", "#333333");
				}
			} 
			if (currentEnd > afterStart){
				console.log("COLLISIONBottom");
				$("#tr-" +(itinerary.itinerary[i].id)).css("border-bottom","5px solid rgba(255, 0, 0, .3)");
				$("#tr-" + (itinerary.itinerary[i].id) + " .time").css("color", "#FF0000");

					//if there is a collison at the 2nd to last item, change the last one too
					if(i == itinerary.itinerary.length-2){
						$("#tr-" +(itinerary.itinerary[i+1].id)).css("border-top","5px solid rgba(255, 0, 0, .3)");
						$("#tr-" + (itinerary.itinerary[i+1].id) + " .time").css("color", "#FF0000");
					}
			}
			if (currentEnd <= afterStart){
				console.log("COLLISIONBottom");
				$("#tr-" +(itinerary.itinerary[i].id)).css("border-bottom","1px solid gray");
				$("#tr-" + (itinerary.itinerary[i].id) + " .time").css("color", "#333333");

					//if there is a collison at the 2nd to last item, change the last one too
					if(i == itinerary.itinerary.length-2){
						$("#tr-" +(itinerary.itinerary[i+1].id)).css("border-top","1px solid gray");
						$("#tr-" + (itinerary.itinerary[i+1].id) + " .time").css("color", "#333333");
					}
			}

		}
	} else if(itinerary.itinerary.length == 2) {
		var firstEnd = new Date(itinerary.itinerary[0].endDate);
		var secondStart = new Date(itinerary.itinerary[1].startDate);
		if(secondStart < firstEnd) {
			console.log("COLLISIONSingle");
			$("#tr-" +(itinerary.itinerary[0].id)).css("border-bottom","5px solid rgba(255, 0, 0, .3)");
			$("#tr-" +(itinerary.itinerary[1].id)).css("border-top","5px solid rgba(255, 0, 0, .3)");
			$("#tr-" + (itinerary.itinerary[0].id) + " .time").css("color", "#FF0000");
			$("#tr-" + (itinerary.itinerary[1].id) + " .time").css("color", "#FF0000");
		}
		if(secondStart >= firstEnd) {
			console.log("COLLISIONSingle");
			$("#tr-" +(itinerary.itinerary[0].id)).css("border-bottom","1px solid gray");
			$("#tr-" +(itinerary.itinerary[1].id)).css("border-top","1px solid gray");
			$("#tr-" + (itinerary.itinerary[0].id) + " .time").css("color", "#333333");
			$("#tr-" + (itinerary.itinerary[1].id) + " .time").css("color", "#333333");
		}
	} else if(itinerary.itinerary.length == 1) {
		$("#tr-" +(itinerary.itinerary[0].id)).css("border-bottom","none");
		$("#tr-" +(itinerary.itinerary[0].id)).css("border-top","1px solid gray");
		$("#tr-" + (itinerary.itinerary[0].id) + " .time").css("color", "#333333");
	}
}

/* Strips the venue info out of itinerary (leaving only id, startDate, endDate)
 * and store just that for efficiency purposes since API calls get venue info anyway
 * TODO: actually strip venue information
 */
function storeItinerary() {
	itineraries[n] = itinerary;
	store.set('fourpeople', JSON.stringify(itineraries));
	console.log(itineraries);
}

/*
 * Sorts the itinerary by startDate
 */
var sortItinerary = function() {
	itinerary.itinerary.sort(function(a,b) {
		var dateA = new Date(a.startDate);
		var dateB = new Date(b.startDate);
		
		if(dateA > dateB) 
			return 1;
		if(dateA < dateB)
			return -1;
		return 0;
	});
}

/* 
 * Add venue button clicked
 * @type event listener
 * Add venue to itinerary when add button clicked 
 * Note: jQuery .click doesn't pick up elements when added to the page after load,
 * so using .on here
 */
$(document).on('click', '.panel-add-button', function(){
	var addButtonEl = event.target;
	// Get the venue ID
	var venueID = $(addButtonEl).children("span.hidden-venue-id").text();

	// First get the result number from button ID: id="add-button-result-' + number
	var buttonID = $(addButtonEl).attr('id');
	var resultNo = buttonID.split("-")[3];
	// Now that we have the number, we can clear the correct error message holder
	var statusHolderID = "#datetime-status-holder-result-" + resultNo;

	// First make sure the venue hasn't already been added
	// ie if it already has a row on the itinerary table
	var $trSelector = $('#tr-' + venueID);
	console.log($trSelector);
	if ($trSelector.length > 0) {
		displayErrorMessage(statusHolderID, "Whoops! You've already added this venue");
	} else {
		// Now we have to read the datetime picker values...
		
		clearStatusHolder(statusHolderID); 
		// Now that we have the number, we can read the values from the correct datetime picker 
		// id="start-date-picker-result-" + number
		var startDate = $('#start-date-picker-result-' + resultNo).val();
		var startTime = $('#start-time-picker-result-' + resultNo).val();
		var endDate = $('#end-date-picker-result-' + resultNo).val();
		var endTime = $('#end-time-picker-result-' + resultNo).val();
		var startDateString = createDateString(startDate, startTime).toString();
		var endDateString = createDateString(endDate, endTime).toString();
		var message = detectDateTimeStatus(startDateString, endDateString);
		if (message != "Venue added!") { 
			// If we detected an error, display error message and don't take any action
			displayErrorMessage(statusHolderID, message);
		} else {
			// create new venue object and directly add it to the itinerary object
			var venue = createVenueObject(venueID, startDateString, endDateString);
			itinerary.itinerary.push(venue);
			// Lookup the Foursquare venue and re-sort and display itinerary
			lookupFoursquareVenue(venue, sortAndDisplayItinerary);
			displaySuccessMessage(statusHolderID, message);
		}
	}

	
	
});

/*
 * Display error message, given the "#status-holder-id" and the error message
 */
var displayErrorMessage = function(statusHolderID, message) {
	$(statusHolderID).html(message);
	$(statusHolderID).removeClass('alert-success').addClass('alert-danger');
	$(statusHolderID).css("display", "block");
}

/*
 * Display success message, given the "#status-holder-id" and the success message
 */
var displaySuccessMessage = function(statusHolderID, message) {
	$(statusHolderID).html(message);
	$(statusHolderID).removeClass('alert-danger').addClass('alert-success');
	$(statusHolderID).css("display", "block");
}

/*
 * Clears the status message given the status holder ID "#status-holder-id"
 */
var clearStatusHolder = function(statusHolderID) {
	$(statusHolderID).css("display", "none");
}

/*
 * Checks the start/end dates and returns either a success or error message
 */
var detectDateTimeStatus = function(startDate, endDate) {
	var start = new Date(startDate);
	var end = new Date(endDate);
	var today = new Date();
	var message = "";
	if (start < today || end < today) {
		message = "Sorry! We don't support trips to the past yet."
		//message = "Venue added!";
	} else if (start > end) {
		message = "Whoops! Your start time is after your end time.";
	} else {
		message = "Venue added!";
	}
	return message;
}

/* 
 * Clear search clicked
 * @type event listener
 * Clears all fields and old search results
 */
$("#clear-search").click(function(){
	clearOldSearch();
});

/*
 * Creates and returns a venue object with id, startDate, and endDate
 * Note: this object does not contain the Foursquare venue
 */
var createVenueObject = function(id, startDate, endDate) {
	var venue = {
		id: id,
		startDate: startDate,
		endDate: endDate
	}
	return venue;
}



//=============================================================================
//=============================================================================
// Editing current itinerary
//=============================================================================
//=============================================================================

//when "edit" button clicked, show edit areas for that venue
$(document).on('click', '.edit-venue', function(){
	$(this).hide();
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
			thisVenue = itinerary.itinerary[i];
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

				$(trChild).hide(600, function() {
					var throwawayNode = tbody.removeChild(trChild);
				});
				
				
				storeItinerary();
				detectCollision();
				
				if(i > 0){
					$("#tr-" +(itinerary.itinerary[i-1].id)).css("border-bottom","1px solid gray");
					$("#tr-" + (itinerary.itinerary[i-1].id) + " .time").css("color", "#333333");
				} 
				if(i < itinerary.itinerary.length) {
					$("#tr-" +(itinerary.itinerary[i].id)).css("border-top","1px solid gray");
					$("#tr-" + (itinerary.itinerary[i].id) + " .time").css("color", "#333333");
				}
			});

				var throwawayNode = tbody.removeChild(trChild);
				//store new itinerary
				storeItinerary();
				
				if(itinerary.itinerary.length == 0) {
					$("#no-venues-error").show();
				}

		});	
			

		
		//when click "done" hide editing areas and show edit button, new time
		$("#done-" + thisVenue.id).click(function(){
			var venueID = thisVenue.id;
			// Before we do anything, first check if valid date/time values
			var startDatePickerID = '#start-date-picker-' + venueID;
			var startTimePickerID = '#start-time-picker-' + venueID;
			var endDatePickerID = '#end-date-picker-' + venueID;
			var endTimePickerID = '#end-time-picker-' + venueID;
			var startDateString = getDateTimeInput(startDatePickerID, startTimePickerID);
			var endDateString = getDateTimeInput(endDatePickerID, endTimePickerID);
			var message = detectDateTimeStatus(startDateString, endDateString);
			// If we detected an error, display the error message and don't take any action
			if (message != "Venue added!") {
				var statusHolderID = "#datetime-status-holder-venue-" + venueID;
				displayErrorMessage(statusHolderID, message);
			}
			else { // It's all good, go on and save the change and update
				saveVenueAndUpdateItinerary(thisVenue);
				timeChangeDiv.hide(500, function() {
					//timeDisplayDiv.show(); //TODO: UPDATE TIME
					editButton.show();
				});
			}
			
		});
	}
});

/*
 * Gets and returns the dateString from a date/time input pair
 */
var getDateTimeInput = function(datePickerID, timePickerID) {
	var date = $(datePickerID).val();
	var time = $(timePickerID).val();
	return createDateString(date, time).toString();
}

var saveVenueAndUpdateItinerary = function(venueObject) {
	// Get the venue ID
	var venueID = venueObject.id;
	// Now we have to read the datetime picker values...
	// We have the id, we can read the values from the correct datetime picker 
	// id="start-date-picker-" + id
	var startDate = $('#start-date-picker-' + venueID).val();
	var startTime = $('#start-time-picker-' + venueID).val();
	var endDate = $('#end-date-picker-' + venueID).val();
	var endTime = $('#end-time-picker-' + venueID).val();
	var startDateString = createDateString(startDate, startTime).toString();
	var endDateString = createDateString(endDate, endTime).toString();

	// Save the new start and end times to that same venueObject
	venueObject.startDate = startDateString;
	venueObject.endDate = endDateString;
	// Lookup the Foursquare venue and re-sort and display itinerary
	lookupFoursquareVenue(venueObject, sortAndDisplayItinerary);
	
}

