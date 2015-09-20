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