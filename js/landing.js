/** JavaScript functionality for landing page */

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

// when user clicks create new itinerary, use input
// as name and create new itinerary
// rewrite to storage and redirect to new itinerary
$("#create-new-itinerary").click(function(){
	var itineraryName = $("#new-itinerary-name").val();
	var itineraryID = parseInt(store.get('fourpeopleID'));
	nextItineraryID++;
	store.set('fourpeopleID', nextItineraryID);

	itineraries.push({
		name: itineraryName,
		id: itineraryID,
		itinerary: []
	});
	
	store.set('fourpeople', JSON.stringify(itineraries));
	console.log(JSON.parse(store.get('fourpeople')));
		
	window.location.href = "itinerary.html?id=" + itineraryID;
});

// allow user to create new itinerary by pressing enter
$("#new-itinerary-name").keypress(function(e){
	if(e.which == 13) {
		$("#create-new-itinerary").click();
	}
});


// when user clicks search for itinerary, check input
// and redirect accordingly
$("#search-itinerary-by-id").click(function(){

	var inputInt = parseInt($("#search-id-input").val());
	var inputStr = $("#search-id-input").val();
	if(isNaN(inputInt) && inputStr == "") {
		//TODO: display error
		alert("The id must be a number");
	}
	else {
		var idNum;
		var allItineraries = JSON.parse(store.get('fourpeople'));
		if (typeof inputInt == "number" && !isNaN(inputInt)) {
			idNum = inputInt;
			console.log('number');
		} else {
			allItineraries.forEach(function(itinerary) {
				console.log(itinerary);
				if (inputStr.toLowerCase() == itinerary.name.toLowerCase()) {
					idNum = itinerary.id;
				}
			});
		}
		
		window.location.href = "itinerary.html?id=" + idNum;
	}
});

// allow user to search for itinerary by pressing enter
$("#search-id-input").keypress(function(e){
	if(e.which == 13) {
		$("#search-itinerary-by-id").click();
	}
});