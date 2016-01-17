

//adds the click event for the settings button
$("#showSettings").click(function() {
	$("#settings").toggle("slow");
});

//adds the click event for showing the mini player
$("#showMiniPlayer").click(function(){
	window.open("miniPlayer/index.html","mywindow", "location=no, menubar=no, status=no, titlebar=no, width=400,height=55,left=0,top=100,screenX=0,screenY=100");
});

//adds the conclick event for the nowPlayingIcon
$("#nowPlayingIcon").click(function(){

		$("#album-display").toggle();
		$("#now-playing-display").toggle();
});
