function SubsonicAPI() {
    this.server             = "";
    this.username           = "";
    this.password           = "";
    this.connectedToServer  = false;
    this.albumPlayQueue     = "";
    this.token              = "";
    this.salt               = "";


    //retreives creds from the userinput form
    //and creates the token/salt for the user auth
    //@toDo add validation
    this.getCreds = function() {
        this.server = $('#subServer').val();
        this.username = $('#subUsername').val();
        this.password = $('#subPassword').val();

        //generate rando string for salt and add time in microseconds for noise
        this.salt = Math.random().toString(36).substring(7) + $.now();
        this.token = $.md5(this.password + this.salt);

    }

    //connects (pings the server with the creds
    this.checkStatus = function(subAPI, view) {
        var connectedToServer = false;
        //looking to create something like:
        //http://subsonic:4040/rest/ping.view?u=username&p=pass&c=subGnome&v=1.13.1&f=json
        var getURL = this.URL(view);
        //this.server + '/rest/' + view + '?u=' + this.username + '&p=' + this.password + '&c=subGnome' + '&v=1.13.1&f=json';
        console.log('url: ' + getURL);
        $.get(getURL, function(data) {
                if(data['subsonic-response'].status == 'ok') {
                    //set button to green so we know the status
                    $("#loginStatus").html('Connected!');
                    //set connected to server as true
                    subAPI.connectedToServer = true;
                    //hide the credentials
                    $("#settings").toggle("slow");
                    $("#sidbarRow").toggle("slow");
                    //get the artist data
                    subAPI.getArtists(subAPI);

                } else {
                    $("#loginStatus").html('Connection Failed. Check Server Creds!');
                    subAPI.connectedToServer = false;
                }

                //toggle the loader
                $("#loginLoading").toggle();

        });
    }


    //grabs artists from server
    this.getArtists = function(subAPI) {
        console.log('this is inside get artists');
        if(subAPI.connectedToServer == false) {
            artistContent = 'Not connected to server, unable to pull artist info';
        } else {
            //looking to make this url
            //http://subsonic:4040/rest/getIndexes.view?u=username&p=pass&c=subGnome&v=1.13.1&f=json
             var getURL = this.URL('getArtists.view');
            //this.server + '/rest/' + view + '?u=' + this.username + '&p=' + this.password + '&c=subGnome' + '&v=1.13.1&f=json';
            console.log('url: ' + getURL);
            $.get(getURL, function(data) {
                    if(data['subsonic-response'].status == 'ok') {
                        //console.log(data['subsonic-response']);
                        var artistHtml = subAPI.buildArtistView(data['subsonic-response'].artists.index);
                        $("#artistReplace").replaceWith(artistHtml[0]);
                        //set artist info for amplitude
                        $("#artistSlidePlaceholder").replaceWith(artistHtml[1]);
                        //set click event on artists
                        setArtistNameClickEvent();

                    } else {
                        console.log('Failed to get Indexes in function: getArtists');
                        //$("#checkServer").addClass("btn-default").removeClass("btn-success");
                        //$("#statusbar").addClass("bg-info").removeClass("bg-success");
                    }

            });

        }
    }




    //grabs the artist info from the server, including album info
    this.getArtistInfo = function(subAPI, artistId) {
            //looking to make this url
            //http://subsonic:4040/rest/getArtist.view?u=username&p=pass&c=subGnome&v=1.13.1&f=json&id=18
            //id is the key here for what artist to retreive the info of
             var getURL = subAPI.URL('getArtist.view', artistId);
            console.log('url: ' + getURL);
            $.get(getURL, function(data) {
                    if(data['subsonic-response'].status == 'ok') {
                        console.log(data['subsonic-response']);
                        var albumHtml = [];
                        albumHtml = subAPI.buildAlbumView(data['subsonic-response'].artist.album);

                        //var artistHtml = subAPI.buildArtistView(data['subsonic-response'].indexes.index);
                        $("#albumList").replaceWith(albumHtml[0]);
                        $("#albumSlidePlaceholder").replaceWith(albumHtml[1]);
                        setAlbumNameClickEvent();
                        setAlbumLoadAndPlayClickEvent();
                        //set button to green so we know the status
                        //$("#checkServer").addClass("btn-success").removeClass("btn-default");
                        //$("#statusbar").addClass("bg-success").removeClass("bg-info");

                    } else {
                       console.log('Failed to get Artist in function: getArtistInfo');
                    }

            });

    }




    //gets an albums songs list, and adds an album play queue span next to each album
    this.getAlbumInfo = function(subAPI, albumId, play) {
    //looking to make this url
        //http://subsonic:4040/rest/getalbum.view?u=username&p=pass&c=subGnome&v=1.13.1&f=json&id=18
        //id is the key here for what album to retreive the info of
         var getURL = subAPI.URL('getAlbum.view', albumId);
        console.log('url: ' + getURL);
        $.get(getURL, function(data) {
                if(data['subsonic-response'].status == 'ok') {
                    //console.log('AlbumInfo'+data['subsonic-response']);
                    var songHtml = subAPI.buildSongView(subAPI, data['subsonic-response'].album.song);
                    var amplitudeSongContentsArray = subAPI.buildAmplitudeSongView(subAPI, data['subsonic-response'].album.song);

                    console.log('AmplitudeInfo: ' + amplitudeSongContentsArray);
                    //set amp json and html
                    $("#ampPlaylistInfo").attr("ampJSON", amplitudeSongContentsArray[0]);
                    $("#ampPlaylistInfo").attr("ampHTML", amplitudeSongContentsArray[1]);

                    //var artistHtml = subAPI.buildArtistView(data['subsonic-response'].indexes.index);
                    $("#albumSongList").replaceWith(songHtml[0]);
                    setSongNameClickEvent();
                    //set album play queue
                    $('#playAlbum' + albumId).html(songHtml[1])
                    //set album play click event
                    setAlbumPlayClickEvent();
                    //mark currently selected album
                    $("#" + albumId).addClass("text-success");
                    //check if we should play the album
                    if(play == true) {
                        subAPI.playAlbum(subAPI, 'playAlbum' + albumId)
                    }

                } else {
                   console.log('Failed to get Artist in function: getArtistInfo');
                }


        });
    }



    //creates the json for the amplitude song object
    this.buildAmplitudeSongView = function(subAPI, songJson) {
        /*JSON we are looking to create
        {
			"songs": [
				{
					"name": "Living Proof",
					"artist": "Gregory Alan Isakov",
					"album": "The Weatherman",
					"url": "http://a1537.phobos.apple.com/us/r30/Music4/v4/60/af/eb/60afeba7-f8d9-a920-ff5b-b8666fdc2de4/mzaf_3379426683594665460.plus.aac.p.m4a",
					"live": false,
					"cover_art_url": "images/theweatherman.jpg"
				},
				{
					"name": "Rooms",
					"artist": "Mia and Jonah",
					"album": "Rooms For Adelaide",
					"url": "http://a656.phobos.apple.com/us/r30/Music/2d/d1/52/mzm.oymgnziu.aac.p.m4a",
					"live": false,
					"cover_art_url": "images/roomsforadelaide.jpg"
				},
				{
					"name": "Suburban War",
					"artist": "The Arcade Fire",
					"album": "The Suburbs",
					"url": "https://p.scdn.co/mp3-preview/f5b1bef707e8be7052a1efa5a39555c48e913d36",
					"live": false,
					"cover_art_url": "images/thesuburbs.jpeg"
				}
			],
			"default_album_art": "images/no-cover-large.png"
		}
        With matching HTML at correct indexes

        <div class="amplitude-song-container amplitude-play-pause playlist-item" amplitude-song-index="0">
				<img src="images/theweatherman.jpg" class="album-art"/>
				<div class="playlist-meta">
					<div class="now-playing-title">Living Proof</div>
					<div class="album-information">Gregory Alan Isakov - The Weatherman</span></div>
				</div>
				<div style="clear: both;"></div>
			</div>
			<div class="amplitude-song-container amplitude-play-pause playlist-item" amplitude-song-index="1">
				<img src="images/roomsforadelaide.jpg" class="album-art"/>
				<div class="playlist-meta">
					<div class="now-playing-title">Rooms</div>
					<div class="album-information">Mia and Jonah - Rooms For Adelaide</span></div>
				</div>
				<div style="clear: both;"></div>
			</div>
			<div class="amplitude-song-container amplitude-play-pause playlist-item" amplitude-song-index="2">
				<img src="images/thesuburbs.jpeg" class="album-art"/>
				<div class="playlist-meta">
					<div class="now-playing-title">Suburban War</div>
					<div class="album-information">The Arcade Fire - The Suburbs</span></div>
				</div>
				<div style="clear: both;"></div>
			</div>

        */


        var amplitudeInfo = [];
        var playQueueHTML = '';
        var playQueueJSON = '';
        var currentIndex = 0;
        var defaultAlbumArt = 'images/no-cover-large.png';
        var songListHtml = '<ul id="albumSongList">';
        $.each(songJson, function(index, song) {

            console.log('SongInfo' + song);
            //convert seconds to minutes & seconds
            var durrationOfSong = subAPI.convertSeconds(song);
            //Ceate the JSON for amplitude
            var singleSongJSON = '{';
            singleSongJSON += '"name" : "' + song.title + '",';
            singleSongJSON += '"artist" : "' + song.artist + '",';
            singleSongJSON += '"album" : "' + song.album + '" ,';
            singleSongJSON += '"url" : "' + subAPI.URL('stream.view', song.id) + '",';
            singleSongJSON += '"live" : "false",';
            singleSongJSON += '"cover_art_url" : "'+subAPI.URL('getCoverArt.view', song.coverArt)+'",';
            singleSongJSON += '"duration_minutes" : "'+durrationOfSong[0]+'",';
            singleSongJSON += '"duration_seconds" : "'+durrationOfSong[1]+'",';
            singleSongJSON += '"duration_total" : "'+durrationOfSong[2]+'"';

            singleSongJSON += '},';

            console.log('SingleSongJSON: ' + singleSongJSON);

            playQueueJSON = playQueueJSON + singleSongJSON;




            //Create the HTML for apmplitude
            singleSongHTML = '<div class="amplitude-song-container amplitude-play-pause playlist-item" amplitude-song-index="'+ currentIndex +'"> \n';
            singleSongHTML += '<img src="' + subAPI.URL('getCoverArt.view', song.coverArt) + '" class="album-art"/>';
            singleSongHTML += '<div class="playlist-meta"> \n';
            singleSongHTML += '<div class="now-playing-title">' + song.title + '</div>\n';
            singleSongHTML += '<div class="album-information">' + song.artist + ' - ' + song.album + '</span></div>\n';
            //singleSongHTML += '<span id="' + song.artist + song.title +'minutes" class="duration-minutes" style="display:none;">' + minutes + '</span>\n';
            //singleSongHTML += '<span id="'+ song.artist + song.title +'seconds" class="duration-seconds" style="display:none;">' + seconds + '</span>\n';
            singleSongHTML += '</div> \n <div style="clear: both;"></div> \n </div>';
            //playQueueHTML

            playQueueHTML += singleSongHTML;

            //imcrement index
            currentIndex++;
        });

        //remove last character (,) before wrapping json
        playQueueJSON = playQueueJSON.substring(0, playQueueJSON.length - 1);
        //wrap in song JSON
        playQueueJSON = '{"debug": true, "songs": ['+ playQueueJSON +'],'+subAPI.registerCallbacks(subAPI)+'}';
        console.log('NewplayQueueJSON' + playQueueJSON);
        amplitudeInfo[0] = playQueueJSON;


        amplitudeInfo[1] = playQueueHTML;

        return amplitudeInfo
    }


    //registers callbacksfor amplitude.js
    this.registerCallbacks = function(subAPI) {
        return ' "callbacks": { '+
        '"after_init":"after_init_callback",'+
        '"after_next":"after_next_callback",'+
        '"after_prev":"after_prev_callback"'+
        '}';
    }



    //plays a single song
    this.playSong = function(subAPI, songId) {
        var audio = $("#player");

        $("#nowPlayingSource").attr("src", subAPI.URL('stream.view', songId));
        audio[0].pause();
        audio[0].load();
        audio[0].oncanplaythrough = audio[0].play();
    }

    //play a full album
    this.playAlbum = function(subAPI, playAlbumId) {
        console.log('play: ' + playAlbumId);
        //gets the album play list html
        var albumPlayList = $("#albumSongList").html();
        //set it to the playlist area
        $("#playlist").html(albumPlayList);
        //set the first one as the source, and add the active class

        //gets existing player element
        var player = $("#player");
        //sets sources to new song

       setExistingPlayerSource("#nowPlayingSource", $("#playlist li").first().attr("streamURL"), $("#playlist li").first().attr("streamType"));

        //set this as active
        $("#playlist li").first().addClass("text-success");

        startNewSong("#player");
    }



    //builds the list of songs from an album json
    this.buildSongView = function(subAPI, songJson) {
        var albumPlayQueueHtml = '';
        var songListHtml = '<ul id="albumSongList">';
        $.each(songJson, function(index, song) {
            //this html will be visible by the user
            songListHtml += '<li id="' + song.id + '" class="songName" streamURL="' +
                            subAPI.URL('stream.view', song.id) + '" streamType="' +
                            song.contentType + '" coverArt="'+
                            subAPI.URL('getCoverArt.view', song.coverArt)+'">' +
                            song.title + '</li>';
            //this html5 audo info will not be visible to the user, but will be used to play
            //the album
            albumPlayQueueHtml += '<li id="song' + song.id + '"src="' + subAPI.URL('stream.view', song.id) + '" type="' + song.contentType+ '">';
        });
        songListHtml += '</ul>';
        var htmlToReturnArray = [songListHtml, albumPlayQueueHtml];
        console.log('playQ'+htmlToReturnArray);
        return htmlToReturnArray;
    }


    //builds a list of id to artists from json
    this.buildArtistView = function(artistJson) {
        var htmlToReturn = [];
        var artistStartViewOpen = '<div class="artist-container">' +
                                '<div class="artist">';
        var artistStartViewClose = '</div> </div>';

        var artistSlideHtml;

        htmlToReturn[0] = '<ul id="artistList" class="list-unstyled">';
        //loop over the first list, A, B, C, ect
        $.each(artistJson, function(index, artistArray) {

            //add letter as additional li
            htmlToReturn[0] += '<ul id="artist' + artistArray.name + '" class="list-unstyled">' + artistArray.name;
            //console.log(artistArray.name);
            //now loop thrown the artist array
            $.each(artistArray, function(x, artists) {
                if(!$.isArray(artists)) {
                    //skip this iteration
                    return true;
                    //this is same as continue
                }
                //console.log('x' + x);
                $.each(artists, function(y, artist){
                    artistSlideHtml += artistStartViewOpen;
                    //final loop that has the individual artist info
                    htmlToReturn[0] += '<li id="' + artist.id +'" class="artistName">' + artist.name + '</li>';
                    artistSlideHtml += '<div id="' + artist.id +'" class="artistName">'+artist.name+"</div>";
                    artistSlideHtml += artistStartViewClose;
                });
                htmlToReturn[0] += '<li>';

            });
            htmlToReturn[0] += '</ul>';
        });
        htmlToReturn[0] += '</ul>';

        htmlToReturn[1] = artistSlideHtml;
        return htmlToReturn;

    }



     //builds the album list
     this.buildAlbumView = function(albumJson) {
        var albumSlideHtml = '';
        var albumSlideOpen = '<div class="album-container">';
        var albumSlideImage = '<img src="images/theweatherman.jpg" />';
        var albumSlideMeta = '<div class="album-meta">';
        var albumSlideClose = '</div> </div>';
        var htmlToReturn = [];
        htmlToReturn[0] = '<ul id="albumList" class="list-unstyled">';

        //loop over the albums and order them
        $.each(albumJson, function(index, album) {
            albumSlideHtml += albumSlideOpen + albumSlideImage + albumSlideMeta;
            albumSlideHtml += '<div class="artist">' + album.artist + '</div>';
            albumSlideHtml += '<div id="album' + album.id + '"  albumId="' + album.id +' class="album-info albumName">' + album.name + '</div>';
            albumSlideHtml += albumSlideClose;
            htmlToReturn[0] += '<span class="link glyphicon glyphicon-play albumPlay pull-left"></span>' +
                            '<li id="album' + album.id +'" albumId="' + album.id +'" class="link albumName list-unstyled ">' + album.name +
                            '<span id="playAlbum' + album.id + '" class="hidden"><!--albumPlayQueueContentHere--></span>'+
                            '</li>';
            console.log(album.name);
        })
        htmlToReturn[0] += '</ul>';
        htmlToReturn[1] = albumSlideHtml;
        return htmlToReturn;
     }

     //builds a playable queue
     this.buildPlayQueueFromAlbum= function(albumJson) {

     }



    //returns a url for the api based on view
    this.URL = function(view) {
        return this.server + '/rest/' + view + '?u=' + this.username + '&t=' + this.token + '&s=' + this.salt + '&c=subGnome' + '&v=1.13.1&f=json';
    }

    //returns a url for the api based on view, and an ID
    this.URL = function(view, id) {
        return this.server + '/rest/' + view + '?u=' + this.username + '&t=' + this.token + '&s=' + this.salt + '&id=' + id + '&c=subGnome' + '&v=1.13.1&f=json';
    }


    //gets id of album
    this.getAlbumIdFromId = function(id) {
        return $("#" + id).closest("li").attr("albumId");
    }


    //takes in seconds and converts it to minutes and seconds
    //returning an array
    //[0] = minutes
    //[1] = seconds
    this.convertSeconds = function(song) {
        //convert seconds to minutes and seconds
        var songDuration = [];
        //defaults
        songDuration[0] = 0;
        songDuration[1] = 00;
        songDuration[2] = 0;

        //check if duration is available for this song
        if(song.hasOwnProperty('duration')) {
            //minutes
            songDuration[0] = Math.floor(song.duration / 60);
            //seconds
            songDuration[1] = song.duration - songDuration[0] * 60;
            //set total seconds to use later
            songDuration[2] = song.duration;
            //check if we need to pad the seconds to display properly
            if(songDuration[1] < 10 ) {
                songDuration[1] = '0' + songDuration;
            }


        }
    return songDuration;
    }


}







//Click bind events for class start here
$("#checkServer").click(function() {
    //put up loading gif
    $("#loginLoading").toggle();

    var subAPI = new SubsonicAPI();
    subAPI.getCreds();
    //now send a check to the server
    subAPI.checkStatus(subAPI, 'ping.view')
    //now get artists
});

//wrapper function so click events to the artist name can be added when loaded from server
function setArtistNameClickEvent() {
    //click event that is added to each artist to return albums when clicked
    $(".artistName").click(function() {
        $("#artistList").find(".lowlightText").removeClass("lowlightText");
        var subAPI = new SubsonicAPI();
        subAPI.getCreds();
        subAPI.getArtistInfo(subAPI, $(this).attr("id"))
        $("#" + $(this).attr("id")).addClass("lowlightText");
        //hide the artist pane and show the album pane
        $("#artistPane").hide();
        $("#albumPane").show();

    });

}

//wrapper function so click events to the album name can be added when loaded from server
function setAlbumNameClickEvent() {
    //click event that is added to each album to return songs when clicked
    $(".albumName").click(function() {

        //remove existing chosen album css
        $("#albumList").find(".lowlightText").removeClass("lowlightText");
        var subAPI = new SubsonicAPI();
        var albumId = subAPI.getAlbumIdFromId($(this).attr("id"));
        subAPI.getCreds();
        subAPI.getAlbumInfo(subAPI, albumId, false);
        $("#" + $(this).attr("id")).addClass("lowlightText");


    });
}

//wrapper function so click events to the song name can be added when loaded from server
function setSongNameClickEvent() {
    //click event that is added to each song to play song when clicked
    $(".songName").click(function() {

        var subAPI = new SubsonicAPI();
        subAPI.getCreds();
        subAPI.playSong(subAPI, $(this).attr("id"))

    });
}

//wrapper function to load and play album info via the play button next to album
function setAlbumLoadAndPlayClickEvent() {
    //click event that is added to each album to return songs when clicked
    $(".albumPlay").click(function() {

        //remove existing chosen album css
        $("#albumList").find(".lowlightText").removeClass("lowlightText");
        var subAPI = new SubsonicAPI();
        var albumId = subAPI.getAlbumIdFromId($(this).next().attr("id"));
        subAPI.getCreds();
        subAPI.getAlbumInfo(subAPI, albumId, true);
        $("#" + $(this).next().attr("id")).addClass("lowlightText");

    });
}



//wrapper function so click events to the album play button can be added when loaded from server
function setAlbumPlayClickEvent() {
    //click event that is added to each song to play song when clicked
    $(".albumPlay").click(function() {
        console.log('playAlbumClick');

        var subAPI = new SubsonicAPI();
        //get the album id
        var albumId = subAPI.getAlbumIdFromId($(this).attr("id"));
        subAPI.getCreds();
        subAPI.playAlbum(subAPI, 'playAlbum' + albumId)

    });
}
