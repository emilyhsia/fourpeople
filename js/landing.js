/** JavaScript functionality for landing page */

store.set('fourpeople', JSON.stringify(itineraries));
console.log(JSON.parse(store.get('fourpeople')));

// when user clicks create new itinerary, use input
// as name and create new itinerary
// rewrite to storage and redirect to new itinerary
$("#create-new-itinerary").click(function(){
	var itineraryName = $("#itinerary-name").val();
	var itineraryID = nextItineraryID;
	nextItineraryID++;

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
$("#itinerary-name").keypress(function(e){
	if(e.which == 13) {
		$("#create-new-itinerary").click();
	}
});


// when user clicks search for itinerary, check input
// and redirect accordingly
$("#search-itinerary-by-id").click(function(){
	var idNum = parseInt($("#search-id-input").val());
	if(isNaN(idNum)) {
		//TODO: display error
		alert("The id must be a number");
	}
	else {
		window.location.href = "itinerary.html?id=" + idNum;
	}
});

// allow user to search for itinerary by pressing enter
$("#search-id-input").keypress(function(e){
	if(e.which == 13) {
		$("#search-itinerary-by-id").click();
	}
});