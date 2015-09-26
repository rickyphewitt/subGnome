function SubsonicAPI() {
    this.server = "";
    this.username = "";
    this.password = "";
    this.connectedToServer = false;
    this.albumPlayQueue = "";


    //retreives creds from the userinput form
    //@toDo add validation
    this.getCreds = function() {
        this.server = $('#subServer').val();
        this.username = $('#subUsername').val();
        this.password = $('#subPassword').val();
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
                    $("#checkServer").addClass("btn-success").removeClass("btn-default");
                    $("#statusbar").addClass("bg-success").removeClass("bg-info");
                    //set connected to server as true
                    subAPI.connectedToServer = true;
                    //get the artist data
                    subAPI.getArtists(subAPI);

                } else {
                    $("#checkServer").addClass("btn-default").removeClass("btn-success");
                    $("#statusbar").addClass("bg-info").removeClass("bg-success");
                    subAPI.connectedToServer = false;
                }

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
             var getURL = this.URL('getIndexes.view'); 
            //this.server + '/rest/' + view + '?u=' + this.username + '&p=' + this.password + '&c=subGnome' + '&v=1.13.1&f=json';
            console.log('url: ' + getURL);
            $.get(getURL, function(data) {
                    if(data['subsonic-response'].status == 'ok') {
                        //console.log(data['subsonic-response']);
                        var artistHtml = subAPI.buildArtistView(data['subsonic-response'].indexes.index);
                        $("#artistReplace").replaceWith(artistHtml);
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
                        var albumHtml = subAPI.buildAlbumView(data['subsonic-response'].artist.album);
                        //var artistHtml = subAPI.buildArtistView(data['subsonic-response'].indexes.index);
                        $("#albumList").replaceWith(albumHtml);
                        setAlbumNameClickEvent();
                        //set button to green so we know the status
                        //$("#checkServer").addClass("btn-success").removeClass("btn-default");
                        //$("#statusbar").addClass("bg-success").removeClass("bg-info");

                    } else {
                       console.log('Failed to get Artist in function: getArtistInfo');
                    }

            });

    }




    //gets an albums songs list, and adds an album play queue span next to each album
    this.getAlbumInfo = function(subAPI, albumId) {
    //looking to make this url
        //http://subsonic:4040/rest/getalbum.view?u=username&p=pass&c=subGnome&v=1.13.1&f=json&id=18
        //id is the key here for what album to retreive the info of
         var getURL = subAPI.URL('getAlbum.view', albumId); 
        console.log('url: ' + getURL);
        $.get(getURL, function(data) {
                if(data['subsonic-response'].status == 'ok') {
                    console.log(data['subsonic-response']);
                    var songHtml = subAPI.buildSongView(subAPI, data['subsonic-response'].album.song);
                    //var artistHtml = subAPI.buildArtistView(data['subsonic-response'].indexes.index);
                    $("#albumSongList").replaceWith(songHtml[0]);
                    setSongNameClickEvent();
                    //set album play queue
                    $('#playAlbum' + albumId).html(songHtml[1])
                    //set album play click event
                    setAlbumPlayClickEvent();

                } else {
                   console.log('Failed to get Artist in function: getArtistInfo');
                }

        });
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

        //var streamQ = $('#' + playAlbumId).html();
        //console.log('streamQ' + streamQ);
        //var emptyPlayer = new Player();

        //var playerHTML = player.defaultPlayer(emptyPlayer.newSong($("#playlist li").first().attr("streamURL"), $("#playlist li").first().attr("streamType")));
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
            songListHtml += '<li id="' + song.id + '" class="songName" streamURL="' + subAPI.URL('stream.view', song.id) + '" streamType="' + song.contentType + '">' + song.title + '</li>';
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
        var htmlToReturn = '<ul id="artistList">';
        //loop over the first list, A, B, C, ect
        $.each(artistJson, function(index, artistArray) {
            //add letter as additional li
            htmlToReturn += '<ul id="artist' + artistArray.name + '">' + artistArray.name;
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
                    //final loop that has the individual artist info
                    htmlToReturn += '<li id="' + artist.id +'" class="artistName">' + artist.name + '</li>';
                });
                htmlToReturn += '<li>';

            });
            htmlToReturn += '</ul>';
        });
        htmlToReturn += '</ul>';
        return htmlToReturn;

    }



     //builds the album list
     this.buildAlbumView = function(albumJson) {
        var htmlToReturn = '<ul id="albumList">';
        //loop over the albums and order them
        $.each(albumJson, function(index, album) {
            htmlToReturn += '<li id="' + album.id + '" class="link, albumName">' + album.name + 
                            '<span id="playAlbum' + album.id + '" class="hidden"><!--albumPlayQueueContentHere--></span>'+
                            '</li><span id="'+ album.id +'" class="link glyphicon glyphicon-play albumPlay right"></span>';
            console.log(album.name);
        })
        htmlToReturn += '</ul>';
        return htmlToReturn;
     }

     //builds a playable queue
     this.buildPlayQueueFromAlbum= function(albumJson) {

     }



    //returns a url for the api based on view
    this.URL = function(view) {
        return this.server + '/rest/' + view + '?u=' + this.username + '&p=' + this.password + '&c=subGnome' + '&v=1.13.1&f=json';
    }

    //returns a url for the api based on view, and an ID
    this.URL = function(view, id) {
        return this.server + '/rest/' + view + '?u=' + this.username + '&p=' + this.password + '&id=' + id + '&c=subGnome' + '&v=1.13.1&f=json';
    }

}





//Click bind events for class start here
$("#checkServer").click(function() {
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
        
        var subAPI = new SubsonicAPI();
        subAPI.getCreds();
        subAPI.getArtistInfo(subAPI, $(this).attr("id"))

    });

}

//wrapper function so click events to the album name can be added when loaded from server
function setAlbumNameClickEvent() {
    //click event that is added to each album to return songs when clicked
    $(".albumName").click(function() {
        
        var subAPI = new SubsonicAPI();
        subAPI.getCreds();
        subAPI.getAlbumInfo(subAPI, $(this).attr("id"))

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

//wrapper function so click events to the album play button can be added when loaded from server
function setAlbumPlayClickEvent() {
    //click event that is added to each song to play song when clicked
    $(".albumPlay").click(function() {
        console.log('playAlbumClick');
        var subAPI = new SubsonicAPI();
        subAPI.getCreds();
        subAPI.playAlbum(subAPI, 'playAlbum' + $(this).attr("id"))

    });
}

