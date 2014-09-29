var google = google || {};

google.project = google.project || {};

google.project.aiesec = google.project.aiesec || {};

google.project.aiesec.SCOPES = 'https://www.googleapis.com/auth/userinfo.email';
google.project.aiesec.CLIENT_ID = '701424510160-upb8hkmvcem4kg7dgqi14a144q7ted5e.apps.googleusercontent.com';
google.project.aiesec.RESPONSE_TYPE = 'token id_token';
google.project.aiesec.signedIn = false;
google.project.aiesec.ROOT = 'https://aiesecapi.appspot.com/_ah/api';


function returnPost(key) {
    gapi.client.userAPI.post.getById({'key':JSON.parse(key)}).execute(function(resp){
        if (!resp.code) {
            var image = resp.image;
            $('#img').attr('src',image);
            $('#ldescription').append(atob( resp.text ));
            $('#ltitle').append(resp.title);
            $('#lfecha').append(resp.date);
            $('#luser').append(resp.ownerEmail);
            $('#comentarios').append('<em >Comentarios (' + resp.commentsCount + ') </em>')
            setDivH();
        }
    })
}

function addComment(text, email, date){
    var tr = ' \
                <tr><td><br /></td></tr>\
                <tr><td></td><td colspan="2"><hr size="2"  style="color: #000000;" /></td></tr>\
                <tr> \
                <td></td> \
                <td colspan="2">' + text +  '</td> \
                <td></td> \
                </tr> \
                <tr> \
                <td></td> \
                <td style="color: #999;">' + email + '</td> \
                <td style="text-align:right;color: #999;">' + date + '</td> \
                <td></td> \
                </tr> \
            ';
    $('#tblComments').append(tr);
}

$(document).ready(function () {
    $('#btnS').click(function () {
        $.ajax({
            url: '/posts/',
            type: 'POST',
            data: '',
            cache: false,
            dataType: 'text',
            contentType: 'application/json',
            success: function (data) {
                loadNextPage($('#postID').val(), $('#hdnNextPage').val());
            },
            error: function (ts) {

            }
        });
        return false;
    });
});

function loadNextPage(postID,nextPageToken) {
    gapi.client.userAPI.comment.list({'PageToken': nextPageToken, 'postID': String(postID) }).execute(function (resp) {
        if (resp.items) {
            for (var i = 0; i < resp.items.length; i++) {
                addComment(resp.items[i].text, resp.items[i].owner, resp.items[i].date);
            }
        }
        if (resp.next) {
            document.getElementById("btnS").style.visibility = 'visible';
            $('#hdnNextPage').val(resp.next);
        }
        else {
            document.getElementById("btnS").style.visibility = 'hidden';
        }
    });
}

function loadFirstCommentList(postID) {
    gapi.client.userAPI.comment.list({ 'postID': String(postID) }).execute(function (resp) {
        if (resp.items) {
            for (var i = 0; i < resp.items.length; i++) {
                addComment(resp.items[i].text, resp.items[i].owner, resp.items[i].date);
            }
        }
        if (resp.next) {
            document.getElementById("btnS").style.visibility = 'visible';
            $('#hdnNextPage').val(resp.next);
        }
        else {
            document.getElementById("btnS").style.visibility = 'hidden';
        }
    });
}

function addNewComment(comment, postID, userID ,email) {
    gapi.client.userAPI.comment.insert({
        'text': comment,
        'post': { 'title': '', 'eID': postID},
        'owner': {'user_id':userID , 'email': email}
       
    }).execute(function (resp) {
        if (!resp.code) {
            var date = new Date(resp.date);
            var tr = ' \
                <tr><td><br /></td></tr>\
                <tr><td></td><td colspan="2"><hr size="2"  style="color: #000000;" /></td></tr>\
                <tr> \
                <td></td> \
                <td colspan="2">' + resp.text +  '</td> \
                <td></td> \
                </tr> \
                <tr> \
                <td></td> \
                <td style="color: #999;">' + resp.owner.email + '</td> \
                <td style="text-align:right;color: #999;">' + date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + '</td> \
                <td></td> \
                </tr> \
            ';
            $('#tblComments').append(tr);
        }
    }
    )
}

$(document).ready(function () {
    $('#postComment').click(function () {
        try {
            var data = "";
            $.ajax({
                url: '/posts/',
                type: 'POST',
                data: data,
                cache: false,
                dataType: 'json',
                contentType: 'application/json',
                success: function (data, status, xhr) {
                    var comment = $('#txtComment').val();
                    var postID = $('#postID').val();
                    addNewComment(comment, postID, data.userID, data.userMail);
                    var comment = $('#txtComment').val('');
                },
                error: function () {
                   
                }
            });
        }
        catch (e) {
            alertify.set({ delay: 2000 });
            alertify.error("Ha ocurrido un error al enviar el post.")
        }
        return false;
    });
});


function setDivH()
{
    var div = $('#post');
    var fh = String(Math.round($(document).height()/$(window).height() *100).toFixed())+'%';
    div.css("height", fh);
}

$(document).ready(function() {
  $('#simple-menu').sidr();
});

$(document).ready(function(){
$('#responsive-menu-button').sidr({
            name: 'sidr-main',
            source: '#navigation'
});});

function init() {
    var apisToLoad;
    var callback = function(){
        if (--apisToLoad == 0) {
            var url = $(location).attr('href').split("/");
            var key = url[url.length - 1]
            $('#postID').val(key);
            returnPost(key);
            loadFirstCommentList(key);
        }
    }
    apisToLoad = 1;
    gapi.client.load('userAPI','v1',callback, google.project.aiesec.ROOT);
}

