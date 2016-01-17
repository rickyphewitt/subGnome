











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


    var songToPlay;

    //check if there is a next element, loop
    if(!nextElement.hasClass('amplitude-song-container')) {
        // console.log('should only fire on last element');
        firstSongAmpHackIndex = 0;
        nextElement =  $('.amplitude-song-container').first();
        songToPlay = JSON.parse(nextElement.find('span').text());
    } else {
        songToPlay = JSON.parse(nextElement.find('span').text());

    }

    Amplitude.playNow(songToPlay);

    nextElement.addClass('amplitude-active-song-container');
    activeSong.removeClass('amplitude-active-song-container');
    if(firstSongAmpHackIndex != 0 && nextElement.attr('amplitude-song-index') != 0) {
        $('.amplitude-song-container').first().removeClass('amplitude-active-song-container')
    }

    if(isPrev && nextElement.attr('amplitude-song-index') == 0) {
        nextElement.addClass('amplitude-active-song-container');
    }

    //set duration of song
    setDurationOfActiveSong();

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
* Song Duration Functionality
*
******************************************************************************/




function setDurationOfActiveSong() {
    //get song and album name to use as id for min/sec duration
    var currentSongMetadata = Amplitude.getActiveSongMetadata();
    console.log(currentSongMetadata	);
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
    console.log("total:" +currentSongMetadata.duration_total);
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
