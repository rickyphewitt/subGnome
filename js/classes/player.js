





/*****************************************************************************
*
* Album Build/Play Functionality
*
******************************************************************************/



//uses the subsonic api to get album info and add to page
function getAlbumInfo(){
    //click event that is added to each album to return songs when clicked
    $(".albumName").click(function() {

        var subAPI = new SubsonicAPI();
        var albumId = $(this).attr("albumId");
        console.log("albumID: " + albumId);
        subAPI.getCreds();
        subAPI.getAlbumInfo(subAPI, albumId, false);
        $("#" + $(this).attr("id")).addClass("lowlightText");

        var swatchHex = $(this).attr("swatch");
        //set the background album header to match vibrant color of album
        //set color of css
        $(".album-header").fadeIn( "slow", function() {
                // Animation complete
                $(this).css("background-color", swatchHex);
        });

    });
}







/************ Album Bindings bindings ************/



//shows album playlist pane if hidden
function showAlbumContent() {
    $("#now-playing-display").hide();
    $("#album-display").show();
    setPlayAlbumClickEvent();
    setAddToPlaylistEvent();
}

//wrapper function so click events to the album name can be added when loaded from server
function setAlbumNameClickEvent() {
    getAlbumInfo();
}

//sets the click event for play album
function setPlayAlbumClickEvent(){
    //plays album from the albumMediaControls
    $('.playAlbum').click(function(){
        //get song info to play
        clearPlaylist();
        addAllToPlaylist('.albumSong');
        playSong($('.amplitude-song-container').first());
        //set now playing icon background
        indicatePlaylistUpdate();

    });
}


//sets the playlist add functinality
function setAddToPlaylistEvent(){
    $('.addToPlaylist').click(function(){
        addAllToPlaylist('.amplitude-song-container ');
    });
}



/*****************************************************************************
*
* Playlist Functionality
*
******************************************************************************/


//adds a list of songs to a playlist
function addAllToPlaylist(songClass){
    //loop over passed in class and add each to queue
    $(songClass).each(function(){
        addSongToPlaylist($(this));
    });
}

function clearPlaylist(){
    $('#play-queue-body').html('');
}

//adds a single song to a playlist
function addSongToPlaylist(songToAdd) {
    $('#play-queue-body').append(convertSongToPlaylistItem(songToAdd));
}


//converts a song to a playlist item
function convertSongToPlaylistItem(songToConvert) {
    var songJSON = JSON.parse(songToConvert.find('span').text());
    var amplitudeSongIndex = 'amplitude-song-index="' + getNextAvailablePlaylistPosition() +'"';
    var ampClasses = ' song-title';
    var ampPlayInfo = '<span class="amplitudeSongJSON" style="display:none;">' + JSON.stringify(songJSON) + '</span>';
    var playlistRow = '<div class="tableRow amplitude-song-container amplitude-play-pause playlist-item"><div class="tableCell playlistSongTitle' + ampClasses +'" '+amplitudeSongIndex+'>';
    var nowPlayingImage = '<img src="images/now-playing.png" />';
    playlistRow += nowPlayingImage +  songJSON.name + ampPlayInfo + '</div><div class="tableCell playlistSongArtist">';
    playlistRow += songJSON.artist + '</div><div class="tableCell playlistSongAlbum">';
    playlistRow += songJSON.album + '</div><div class="tableCell playlistSongLength">';
    playlistRow +=  songJSON.duration_minutes + ':' + songJSON.duration_seconds + '</div></div>';
    return playlistRow;
}

//gets the playlist position of last element
function getNextAvailablePlaylistPosition() {
    var playlistPosition = $('.amplitude-song-container').last().attr('amplitude-song-index');
    if(!isNaN(parseFloat(playlistPosition)) && isFinite(playlistPosition)) {
        return parseInt(playlistPosition) + parseInt(1);
    } else {
        return 0;

    }

}


//fades in then out the background of the playlist icon
function indicatePlaylistUpdate() {
    $('#nowPlayingIcon').fadeOut("fast");
    $('#nowPlayingIcon').fadeIn("fast");

}


/*****************************************************************************
*
* Song Next/Prev Functionality
*
******************************************************************************/
//logic that switches active song to next or previous song
function nextSong(isPrev) {
    //get the single song JSON for curently playing song
    //@ToDo dig deeper into amp and current implementation as this
    //bug is probably created by the implementation
    var firstSongAmpHackIndex = $('.amplitude-active-song-container').attr('amplitude-song-index');
    var activeSong = $('.amplitude-active-song-container').first();



    var nextElement
    //check if isPrev is set
    if(isPrev) {
        nextElement = activeSong.prev();
    } else {
        nextElement = activeSong.next();
    }

    //check if there is a next element, loop
    if(!nextElement.hasClass('amplitude-song-container')) {
        // console.log('should only fire on last element');
        firstSongAmpHackIndex = 0;
        nextElement = $('.amplitude-song-container').first();
    }

    playSong(nextElement);

    nextElement.addClass('amplitude-active-song-container');
    activeSong.removeClass('amplitude-active-song-container');
    if(firstSongAmpHackIndex != 0 && nextElement.attr('amplitude-song-index') != 0) {
        $('.amplitude-song-container').first().removeClass('amplitude-active-song-container')
    }

    if(isPrev && nextElement.attr('amplitude-song-index') == 0) {
        nextElement.addClass('amplitude-active-song-container');
    }


}

/************ Next/Prev song bindings ************/

//sets binding for next
$('.custom-next').click(function(){
    nextSong(false);
});

//sets binding for previous
$('.custom-prev').click(function(){
        nextSong(true);
});








/*****************************************************************************
*
* Song Functionality
*
******************************************************************************/

//plays the song element passed in
function playSong(songToPlay){
    Amplitude.playNow(JSON.parse(songToPlay.find('span').text()));
    songToPlay.addClass('amplitude-active-song-container');
    //always set duration when playing a song
    //set duration of song
    setDurationOfActiveSong();

}



//Sets duration of active song and adds an event listener to
//update the music progress slider
function setDurationOfActiveSong() {
    //get song and album name to use as id for min/sec duration
    var currentSongMetadata = Amplitude.getActiveSongMetadata();
    //set the current playing seconds/minutes
    //it seems amplitude does this for some songs, automatically
    //but does not seem to be the case for subsonic streams
    $(".amplitude-duration-minutes").first().text(currentSongMetadata.duration_minutes);
    $(".amplitude-duration-seconds").first().text(currentSongMetadata.duration_seconds);
    //also reset the width slider
    $(".amplitude-song-time-visualization-status").first().width("0");

    var timer = setTimeout(updateSongTimeVisualizationStatus, 1000);

}

//looks at the current play time in seconds, then updates the
//visualizer width to show for both middle and large bars
function updateSongTimeVisualizationStatus() {
    var currentSongMetadata = Amplitude.getActiveSongMetadata();
    //Set slider
    var currentPlayTimeInSeconds = getCurrentTotalPlayTimeInSeconds();
    var incrementSlider = 341 / currentSongMetadata.duration_total;

    //next update
    var visualUpdate = Number((currentPlayTimeInSeconds * incrementSlider));

    //check if the song is playing
    if($("#play-pause").hasClass("amplitude-paused")) {
        //do not update as music is paused
    } else {
        //if music is playing, update slider
        $(".amplitude-song-time-visualization-status")[0].style.width = visualUpdate + "px";
    }

    function getCurrentTotalPlayTimeInSeconds() {
        return Number((parseInt(getCurrentPlayTimeMinutesInSeconds()) + parseInt(getCurrentPlayTimeInSeconds())));
    }

    function getCurrentPlayTimeMinutesInSeconds() {
        var currentMinutes = $(".amplitude-current-minutes").first().text();
        //change to seeconds
        return currentMinutes * 60;
    }

    function getCurrentPlayTimeInSeconds() {
        return $(".amplitude-current-seconds").first().text();
    }

    //check if song has ended based on current time and total time
    //if so move to next song
    if((getCurrentTotalPlayTimeInSeconds() + 1) >= currentSongMetadata.duration_total) {
        console.log('Song has ended!');
        nextSong(false);
    }

    timer = setTimeout(updateSongTimeVisualizationStatus, 960);
    //clear previous timer
    clearTimeout(timer-1);
    //should implement a more elegant solution:
    //http://stackoverflow.com/questions/2814919/does-the-browser-keep-track-of-active-timer-ids
}
