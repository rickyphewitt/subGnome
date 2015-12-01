

//adds the click event for the settings button
$("#showSettings").click(function() {
	$("#settings").toggle("slow");
});

//adds the click event for showing the mini player
$("#showMiniPlayer").click(function(){
	window.open("miniPlayer/index.html");
});
