var baseURL = "https://api.foursquare.com/v2/venues/";
var CLIENT_ID = "5CYXNIKAOPTKCKIGHNPPJ3DQJBY4IPL0XJL140TLN121U514";
var CLIENT_SECRET = "RPZTJ5NHBY0L213UKWP3T3DF2QVUXNKMW34FRJOUZFDIFNDM&v=20131124";

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
	$("#itinerary").html(toDisplay);
}

console.log(itinerary);
	
//set title
$("h1#title").html(itinerary.name);

//sort just in case
itinerary.itinerary.sort(function(a,b) {
	var dateA = new Date(a.startDate);
	var dateB = new Date(b.startDate);
	
	if(dateA > dateB) 
		return 1;
	if(dateA < dateB)
		return -1;
	return 0;
});

//go through all venues and display
if(itinerary.itinerary.length > 0) {
	$("#itinerary").html("");
	var lastDate = ""; 
	
	// display framework for each venue
	itinerary.itinerary.forEach(function(venue){
		//check to see if day changed
		if (isDifferentDay(lastDate, venue.startDate)) {
			var wordsDate = getWordsDateString(venue.startDate);
			if(lastDate != "") { $("#itinerary").append('<br>'); }
			$("#itinerary").append('<h2>' + wordsDate + '</h2>');
			lastDate = venue.startDate;
		}
		var venueHTML = '<h3>' + getDisplayTimeString(venue.startDate) + ' - ' + getDisplayTimeString(venue.endDate) + 
			': <span id="name-' + venue.id + '"></span></h3>' + 
			'<p>Address: <span id="address-' + venue.id + '"></span></p>~~~';
		$("#itinerary").append(venueHTML);
	});
	
	// get venue information and add to framework
	itinerary.itinerary.forEach(function(venue){
		var urlToSend = formatVenueLookupURL(venue.id);
		$.ajax({
			  url: urlToSend
			}).done(function(data) {
				// data.response.venue is the Foursquare venue object
				// We inject the Foursquare venue to our venue object to display
				venue.venue = data.response.venue;
				$("span#name-" + venue.id).html(venue.venue.name);
				$("span#address-" + venue.id).html(venue.venue.location.address);
		});
	});
} else {
	$("#itinerary").html("You don't have any venues!");
}

function formatVenueLookupURL(id) {
	var URL = baseURL + encodeURIComponent(id) + "?client_id=" + CLIENT_ID + "&client_secret=" + CLIENT_SECRET;
	return URL;
}