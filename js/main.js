/** Javascript functionality for all pages (e.g., load navbar) */
$(function(){
	//load navbar
	var navbarHTML = '<div class="container">' + 
		'<div class="navbar-header">' +
          '<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-collapse">' + 
            '<span class="sr-only">Toggle navigation</span>' +
            '<span class="icon-bar"></span>' +
            '<span class="icon-bar"></span>' +
            '<span class="icon-bar"></span>' +
          '</button>' + 
          '<a class="navbar-brand" href="index.html">AdventureReady</a>' +
        '</div>' +
        '<div class="collapse navbar-collapse">' +
          '<ul class="nav navbar-nav">' +
            '<li id="home-tab-li"><a href="existing-itineraries.html">Home</a></li>' +
            '<li id="about-tab-li"><a href="about.html">About</a></li>' +
            '<li id="help-tab-li"><a href="UserManual.pdf" target="_blank">Help</a></li>' +
          '</ul>' +
        '</div><!--/.nav-collapse -->' +
      '</div>';
	$(".navbar").html(navbarHTML);
	
	//highlight the correct tab in navbar for active page
	var path = window.location.pathname;
	if(path.indexOf("existing-itineraries.html") != -1) {
		$("#home-tab-li").addClass("active");
	} else if(path.indexOf("about.html") != -1) {
		$("#about-tab-li").addClass("active");
	} else if(path.indexOf("help.html") != -1) {
		$("#help-tab-li").addClass("active");
	}
	
	//load footer
	var footerHTML = 'Powered by &nbsp;' +
		'<a href="http://www.foursquare.com" target="_blank"><img src="images/foursquare-logo.png" id="foursquare-logo" /></a>';
	$("#footer").append(footerHTML);
});