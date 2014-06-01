var google = google || {};

google.project = google.project || {};

google.project.aiesec = google.project.aiesec || {};


google.project.aiesec.SCOPES = 'https://www.googleapis.com/auth/plus.me';
google.project.aiesec.CLIENT_ID = '32806639128-k02cm94eha4os48uuvo622tdp7af9970.apps.googleusercontent.com';
google.project.aiesec.RESPONSE_TYPE = 'token id_token';
google.project.aiesec.API_KEY = 'AIzaSyD82KBTCccXRrMOweIDLqYLo3e8cwXwoHg';
google.project.aiesec.signedIn = false;
google.project.aiesec.ROOT = 'https://aiesec-t2014.appspot.com/_ah/api';


//Function that validates users and their domain
google.project.aiesec.validUser = function(email){
    gapi.client.userAPI.user.login({'email': email }).execute(function(resp){
        if (!resp.code) {
            google.project.aiesec.signedIn = true;
            window.location = '/newpost';
        }
        else{
            google.project.aiesec.signedIn = false;
        };
    });                                           
};

//Functions for Login using OAuth 2.0
google.project.aiesec.handleClientLoad = function() {
    gapi.client.setApiKey(google.project.aiesec.API_KEY);
    window.setTimeout(google.project.aiesec.checkAuth,1);
}

google.project.aiesec.checkAuth = function() {
    gapi.auth.authorize({client_id: google.project.aiesec.CLIENT_ID, scope: google.project.aiesec.SCOPES, inmediate: true},
                        google.project.aiesec.handleAuthResult);
}

google.project.aiesec.handleAuthResult = function(authResult) {
    var loginButton = document.getElementById('signinBTN');
    if (authResult && !authResult.error) {
        google.project.aiesec.makeApiCall();
    }
    else{
        loginButton.onclick = google.project.aiesec.handleAuthClick;
    }
}

google.project.aiesec.handleAuthClick = function() {
    gapi.auth.authorize({client_id: google.project.aiesec.CLIENT_ID, scope: google.project.aiesec.SCOPES, inmediate: false},
                        google.project.aiesec.handleAuthResult);
    return false;
}

google.project.aiesec.makeApiCall = function() {
    gapi.client.load('plus', 'v1', function() {
       var request = gapi.client.plus.people.get({
            'userId': 'me'
        });
       request.execute(function(resp){
            google.project.aiesec.validUser(resp.result.emails[0].value);
        });
    });
}

google.project.aiesec.init = function() {
    var apisToLoad;
    var callback = function(){
        if (--apisToLoad == 0) {
            document.getElementById('file').addEventListener('change', handleFileSelect, false);
        }
    }
    apisToLoad = 1;
    gapi.client.load('userAPI','v1',callback, google.project.aiesec.ROOT);
}




