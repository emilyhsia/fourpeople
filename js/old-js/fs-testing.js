$(function(){
	initializeFS();
	
	/* Tester callback function for read */
	function alertTest(toDisplay) {
		alert("WOOHOO WE MADE IT! " + toDisplay);
	}
	
	$("#show-file-text").click(function() {
		fileSystem.root.getFile(
			'test.txt', 
			{}, 
			function(fileEntry) { 
				read(fileEntry, alertTest); 
			}, 
			errorHandler
		);
	});

	$("#remove-file").click(function() {
		fileSystem.root.getFile(
			'test.txt', 
			{}, 
			function(fileEntry) { 
				remove(fileEntry); 
			}, 
			errorHandler
		);
	});

	$("#write-to-file").click(function(){
		fileSystem.root.getFile(
			'test.txt', 		
			{create: true}, 	
			function(fileEntry) { 
				write(fileEntry, 'Hello world!'); 	
			}, 
			errorHandler
		);
	});
});