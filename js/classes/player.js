function Player() {
    this.defaultPlayerStart = '<audio id="player" preload="auto" controls autoplay>';
    this.defaultPlayerEnd = 'Your browser does not support the audio element.</audio>';

    //returns the html for a default player
    this.defaultPlayer = function(source) {
        return this.defaultPlayerStart + source + this.defaultPlayerEnd;
    }
    //wraps a sources in a source tag
    this.newSong = function(streamURL, type) {
    	return '<source src="' + streamURL + '" type="' + type + '" />';
    }




}

//Sets an existing players source
function setExistingPlayerSource(sourceId, source, type) {
	$(sourceId).attr("src", source);
	$(sourceId).attr("type", type);
}


//function starts a new song
function startNewSong(playerId) {
	var player = $(playerId);
	player[0].pause();
    player[0].load();
    player[0].oncanplaythrough = player[0].play();
}

//function plays the next/previous song
function playNextPrevious(playlistId, nextOrPrevious) {
	var newSongSource 	= '';
	var newSongType 	= '';
	//find the curreintly playing song via the id
	console.log('Playing: ' + nextOrPrevious);
	var currentPlaylist = $(playlistId);
	//console.log(currentlyPlayingSong);
	if(nextOrPrevious == "next") {
		console.log("lenghtNext: " + currentPlaylist.find(".text-success").next().length);
		//check if there is a next
		if(currentPlaylist.find(".text-success").next().length < 1) {
			//no next element, so skip to top element
			currentPlaylist.children().first().addClass("text-success");
			currentPlaylist.find(".text-success").last().removeClass("text-success");
		} else {
			currentPlaylist.find(".text-success").next().addClass("text-success");
			currentPlaylist.find(".text-success").first().removeClass("text-success");
			
		}
	} else {
		if(currentPlaylist.find(".text-success").prev().length < 1) {
			//no previous element, play current element
			//and no class manipulation is needed

		} else {
			currentPlaylist.find(".text-success").prev().addClass("text-success");
			currentPlaylist.find(".text-success").last().removeClass("text-success");
		}
		console.log("lenghtPrev: " + currentPlaylist.find(".text-success").prev().length);
		

		
		
	}

	//set audio source and type
	newSongSource = currentPlaylist.find(".text-success").first().attr("streamURL");
	newSongType = currentPlaylist.find(".text-success").first().attr("streamType");

	//set source on player and play song
	console.log('newSongSource: ' + newSongSource);
	console.log('newSongType: ' + newSongType);
	setExistingPlayerSource("#nowPlayingSource", newSongSource, newSongType);
	startNewSong("#player");

	
}









//Click bind events for class start here


//click events to play next song
$("#playerNext").click(function() {
	playNextPrevious("#playlist", "next");
	startNewSong("#player");
});


//click events to play prev song
$("#playerPrev").click(function() {
	playNextPrevious("#playlist", "prev");
	startNewSong("#player");
});

//click events for ended song
$("#player").bind('ended', function(){
	console.log('SongEnded');
    playNextPrevious("#playlist", "next");
	startNewSong("#player");
});