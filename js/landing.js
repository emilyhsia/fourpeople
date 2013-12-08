
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