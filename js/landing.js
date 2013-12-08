/** JavaScript functionality for landing page */

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