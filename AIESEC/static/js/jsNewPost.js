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
function insertUser(user_id,email,user,university,state) {
    gapi.client.userAPI.user.insert({
        'user_id': user_id,
        'email': email,
        'user': user,
        'university': university,
        'state': state
    }).execute(
        function (resp) {
            if (!resp.code) {
                alert("User added");
            }
        }
    )
}
                        
function onError(){
    var l = Ladda.create( document.querySelector( 'button' ) );
    l.stop();
    alertify.set({ delay: 2000 });
    alertify.error("Ha ocurrido un error al enviar el post.")
}

$(document).ready(function(){
    $('#btnS').click(function (){            
            var l = Ladda.create( document.querySelector( 'button' ) );
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
                        img = document.getElementById("list").children.imgS.src;
                    }
                    else{
                        img = ""
                    }
                    var title = $('#txtTitle').val();
                    var post =  $('#iddescpost').val();
                    insertPost(title,img,post,data);
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

function handleFileSelect(evt){
    var files = evt.target.files;
    var f = files[0];
    var reader = new FileReader();     
    reader.onload = (function(theFile){
        return function(e){
            document.getElementById('list').innerHTML = ['<img id="imgS" src="', e.target.result,'" title=', theFile.name,' height= "250" width="400"/>'].join('');
        };
    })(f);       
    reader.readAsDataURL(f);
}

function init() {
    var callback = function(){
        document.getElementById('file').addEventListener('change', handleFileSelect, false);
    }
    gapi.client.load('userAPI','v1',callback, google.project.aiesec.ROOT);
}