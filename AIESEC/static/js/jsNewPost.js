var google = google || {};

google.project = google.project || {};

google.project.aiesec = google.project.aiesec || {};

google.project.aiesec.SCOPES = 'https://www.googleapis.com/auth/userinfo.email';
google.project.aiesec.CLIENT_ID = '701424510160-upb8hkmvcem4kg7dgqi14a144q7ted5e.apps.googleusercontent.com';
google.project.aiesec.RESPONSE_TYPE = 'token id_token';
google.project.aiesec.signedIn = false;
google.project.aiesec.ROOT = 'https://aiesecapi.appspot.com/_ah/api';

//API calls

//Insert new post
function insertPost(title,img,post,userID) {
    var l = Ladda.create( document.querySelector( 'button' ) );
    gapi.client.userAPI.post.insert({   'title':title,
                                        'text':post,
                                        'image':img,
                                        'owner':{'user_id': userID}
                                    }).execute(
        function(resp){
            if (!resp.code) {
                l.stop();
                alertify.set({ delay: 2000 });
                alertify.log("Post publicado correctamente.")
                window.location = '/posts/'+resp.eID;
            }
            else
            {
                l.stop();
                alertify.set({ delay: 2000 });
                alertify.error("Ha ocurrido un error al enviar el post.")
            }
        }
    )
}

//Insert new user
function insertUser(user_id,email,user) {
    gapi.client.userAPI.user.insert({
        'user_id': user_id,
        'email': email
    }).execute()
}

function onError(){
    var l = Ladda.create( document.querySelector( 'button' ) );
    l.stop();
    alertify.set({ delay: 2000 });
    alertify.error("Ha ocurrido un error al enviar el post.")
}

function imageTobase64(imgElem) {
    var canvas = document.createElement("canvas");
    canvas.width = imgElem.clientWidth;
    canvas.height = imgElem.clientHeight;
    var ctx = canvas.getContext("2d");
    ctx.drawImage(imgElem, 0, 0);
    var dataURL = canvas.toDataURL("image/png");
    return dataURL;
}

$(document).ready(function() {
  $('#simple-menu').sidr();
});

$(document).ready(function(){
$('#responsive-menu-button').sidr({
            name: 'sidr-main',
            source: '#navigation'
});});

$(document).ready(function(){
     var l = Ladda.create(document.querySelector( 'button' ));
    $('#btnS').click(function (){            
            try {
            var data = "";
            l.start();
            $.ajax({
                url: '/newpost',
                type: 'POST',
                data: data,
                cache: false,
                dataType: 'json',
                contentType: 'application/json',
                success: function(data,status,xhr){
                    var img;
                    if ($('#list').find('#imgS').length) {
                        var img = document.getElementById("list").children.imgS.src;
                        img = img.replace(/^data:image\/(png|jpg|jpeg);base64,/, "");
                    }
                    else{
                        img = ""
                    }
                    var title = $('#txtTitle').val();
                    var post = decodeURIComponent(escape(btoa($('#iddescpost').html())));
                    insertPost(title,img,btoa(post),data);
                },
                error: function(){
                    onError();   
                }
            });}
            catch(e){
                l.stop();
                alertify.set({ delay: 2000 });
                alertify.error("Ha ocurrido un error al enviar el post.")
            }
        return false;
    });
});

function loadUser() {
    $.ajax({
        url: '/loginj',
        async: false,
        type: 'GET',
        cache: false, 
        data: '',
        dataType: 'json',
        contentType: 'application/json',
        success: function (data, status, xhr) {
            console.log(data.userID);
            console.log(data.userMail);
            insertUser(data.userID, data.userMail);
        }
    });
};

$(document).ready(function(){
$('#li1').click(function() {
    $('#li2').removeClass('selected');
    $('#li3').removeClass('selected');
    $(this).addClass('selected');
});
$('#li2').click(function() {
    $('#li1').removeClass('selected');
    $('#li3').removeClass('selected');
    $(this).addClass('selected');
});
$('#li3').click(function() {
    $('#li1').removeClass('selected');
    $('#li2').removeClass('selected');
    $(this).addClass('selected');
});
});

function handleFileSelect(evt){
    var files = evt.target.files;
    var f = files[0];
    var reader = new FileReader();     
    reader.onload = (function(theFile){
        return function(e){
            document.getElementById('list').innerHTML = ['<img id="imgS" src="', e.target.result,'" title=', theFile.name,' height= "auto" width="400"/>'].join('');
        };
    })(f);       
    reader.readAsDataURL(f);
}

function init() {
    var apisToLoad; 
    var callback = function () {
        if (--apisToLoad == 0) {
            document.getElementById('files').addEventListener('change', handleFileSelect, false);

            $(".editor").popline();
            $(".editor").popline({ position: 'fixed' });
            loadUser();
        }
    }
    apisToLoad = 1;
    gapi.client.load('userAPI', 'v1', callback, google.project.aiesec.ROOT);
}