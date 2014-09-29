var google = google || {};

google.project = google.project || {};

google.project.aiesec = google.project.aiesec || {};

google.project.aiesec.SCOPES = 'https://www.googleapis.com/auth/userinfo.email';
google.project.aiesec.CLIENT_ID = '701424510160-upb8hkmvcem4kg7dgqi14a144q7ted5e.apps.googleusercontent.com';
google.project.aiesec.RESPONSE_TYPE = 'token id_token';
google.project.aiesec.signedIn = false;
google.project.aiesec.ROOT = 'https://aiesecapi.appspot.com/_ah/api';
//google.project.aiesec.ROOT = 'http://localhost:1234/_ah/api';

function createTable(title,user,description,image,date,key,count) {
    var table = ' \
    \
    <table style="width:100%;" border="0"> \
        <tr><td></td></tr> \
        <tr><td></td></tr> \
        <tr><td></td></tr> \
        <tr><td></td></tr> \
        <tr><td></td></tr> \
        <tr><td></td></tr> \
        <tr><td></td></tr> \
        <tr><td></td></tr> \
        <tr><td></td></tr> \
        <tr><td></td></tr> \
        <tr><td></td></tr> \
        <tr><td></td></tr> \
        <tr><td></td></tr> \
        <tr><td></td></tr> \
        <tr><td></td></tr> \
        <tr><td></td></tr> \
        <tr><td></td></tr> \
        <tr style="border-spacing:1px; padding-bottom:1em;"> \
            <td width="30%" height="5"></td> \
            <td colspan="2" style="vertical-align:text-bottom;font-size:x-large"> \
                <div style="border-bottom: 3px solid #666;"> \
                    <table style="width:100%"> \
                        <tr> \
                            <td width="70%" valign="bottom" style="color: #333;"><a style="text-decoration:none;color: black;" href=' + '/posts/' + key + '>' + title + '</a></td> \
                            <td width="30%" valign="bottom" align="right" style="font-size: medium; color: #999;">'+user+'</td> \
                        </tr> \
                    </table> \
                </div> \
            </td> \
            <td width="30%" height="5"> </td> \
        </tr> \
        <tr> \
            <td></td> \
            <td colspan="2"></td> \
            <td></td> \
        </tr> \
        <tr> \
            <td height="124"></td> \
            <td colspan="2"> \
                <span style="text-align: center"></span> \
                <div class="divimage" id="divimage" style="text-align: center"><img id="img" src="'+image+'" width="100%" height="auto" /></div> \
            <td></td> \
        </tr> \
        <tr> \
            <td></td> \
            <td colspan="2" style="text-align:justify;">' + description + '</td> \
            <td></td> \
        </tr> \
        <tr> \
            <td></td> \
            <td style="color: #999;">'+date+'</td> \
            <td style="text-align: right"><em>Comentarios ('+count+')</em> \
            <td></td> \
        </tr> \
</table>'
    return table;
};


function loadFirstPage() {
    gapi.client.userAPI.post.timeline({
        'PageToken': ''
    }).execute(
        function (resp) {
            if (resp.items) {
                var post = "";
                for (var i = 0; i < resp.items.length; i++) {
                    post = createTable(resp.items[i].title, resp.items[i].ownerEmail,
                                        atob(resp.items[i].text), resp.items[i].image,
                                        resp.items[i].date, resp.items[i].key, resp.items[i].commentsCount);
                    $("form").append(post);
                }          
            }
            if (resp.next) {
                document.getElementById("btnS").style.visibility = 'visible';
                $('#hdnNextPage').val(resp.next);
            }
            else {
                document.getElementById("btnS").style.visibility = 'hidden';
            }
        }
    )
}

$(document).ready(function () {
    $('#btnS').click(function () {
            $.ajax({
                url: '/timeline',
                type: 'POST',
                data: '',
                cache: false,
                dataType: 'text',
                contentType: 'application/json',
                success: function (data) {
                    loadNextPage($('#hdnNextPage').val());
                },
                error: function (ts) {
                       
                }
            });
        return false;
    });
});

function loadNextPage(cursor) {
    gapi.client.userAPI.post.timeline({
        'PageToken': cursor
    }).execute(
        function (resp) {
            if (resp.items) {
                var post = "";
                for (var i = 0; i < resp.items.length; i++) {
                    post = createTable(resp.items[i].title, resp.items[i].ownerEmail,
                                         atob(resp.items[i].text), resp.items[i].image,
                                         resp.items[i].date, resp.items[i].key, resp.items[i].commentsCount);
                    $("form").append(post);
                }
            }

            if (resp.next) {
                document.getElementById("btnS").style.visibility = 'visible';
                $('#hdnNextPage').val(resp.next);
            }
            else {
                document.getElementById("btnS").style.visibility = 'hidden';
            }
        }
    )
}

function init() {
    var callback = function () {
        loadFirstPage();
    }
    gapi.client.load('userAPI', 'v1', callback, google.project.aiesec.ROOT);
}
