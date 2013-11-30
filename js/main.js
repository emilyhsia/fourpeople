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
          '<a class="navbar-brand" href="#">Project name</a>' +
        '</div>' +
        '<div class="collapse navbar-collapse">' +
          '<ul class="nav navbar-nav">' +
            '<li class="active"><a href="#">Home</a></li>' +
            '<li><a href="#about">About</a></li>' +
            '<li><a href="#contact">Contact</a></li>' +
          '</ul>' +
        '</div><!--/.nav-collapse -->' +
      '</div>';
	$(".navbar").html(navbarHTML);
	
	//load footer
	var footerHTML = 'Powered by &nbsp;' +
		'<a href="http://www.foursquare.com" target="_blank"><img src="images/foursquare-logo.png" id="foursquare-logo" /></a>';
	$("#footer").append(footerHTML);
});