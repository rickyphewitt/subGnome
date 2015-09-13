function SubsonicAPI() {
    this.server = "";
    this.username = "";
    this.password = "";
    this.connectedToServer = false;


    //retreives creds from the userinput form
    //@toDo add validation
    this.getCreds = function() {
        this.server = $('#subServer').val();
        this.username = $('#subUsername').val();
        this.password = $('#subPassword').val();
    }

    //connects (pings the server with the creds
    this.checkStatus = function(view) {
        var connectedToServer = false;
        //looking to create something like:
        //http://subsonic:4040/rest/ping.view?u=rdoge&p=af24frKF2GkK7CSKbld5&c=subGnome&v=1.13.1&f=json
        var getURL = this.server + '/rest/' + view + '?u=' + this.username + '&p=' + this.password + '&c=subGnome' + '&v=1.13.1&f=json';
        console.log('url: ' + getURL);
        $.get(getURL, function(data) {
                if(data['subsonic-response'].status == 'ok') {
                    //set button to green so we know the status
                    $("#checkServer").addClass("btn-success").removeClass("btn-default");
                    $("#statusbar").addClass("bg-success").removeClass("bg-info");

                } else {
                    $("#checkServer").addClass("btn-default").removeClass("btn-success");
                    $("#statusbar").addClass("bg-info").removeClass("bg-success");
                }

        });
    }


    this.getRequest = function() {

    }

}





//Click bind events for class start here
$("#checkServer").click(function(){
    var subAPI = new SubsonicAPI();
    subAPI.getCreds();
    //now send a check to the server
    subAPI.checkStatus('ping.view')
});
