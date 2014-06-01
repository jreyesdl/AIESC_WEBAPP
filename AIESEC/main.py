from google.appengine.ext import endpoints
from google.appengine.ext import ndb
from protorpc import message_types
from protorpc import remote

from endpoints_proto_datastore.ndb import EndpointsModel

#Messages for login With AIESEC.net
from messages import LoginResponse

#Messages for users' permissions
from messages import PermissionResponse
from messages import EmaiRequest

#Global functions
from models import User 
from models import Post
from models import Comments

from functions import functions

import json

#Clients IDs
WEB_CLIENT_ID = '32806639128-k02cm94eha4os48uuvo622tdp7af9970.apps.googleusercontent.com'
EMAIL_SCOPE = 'https://www.googleapis.com/auth/userinfo.email'

@endpoints.api(name='userAPI',version='v1',
               allowed_client_ids=[WEB_CLIENT_ID,endpoints.API_EXPLORER_CLIENT_ID],
               scopes = [EMAIL_SCOPE],
               description='API for AIESEC users.')
class UserApi(remote.Service):

    @User.method(user_required=True,
                 http_method = 'POST',
                 name ='user.insert',
                 path ='user')   
    def insert_user(self, user):
        if (functions.auth_user(user.email)):
            user.put()
            return user
        else:
            raise endpoints.UnauthorizedException('This method requires you to be authenticated. You may need to activate the toggle above to authorize your request using OAuth 2.0.')

    @endpoints.method(EmaiRequest,LoginResponse,
                 path = 'login',
                 name = 'user.login',
                 http_method = 'POST')
    def singin_user(self,request):
        current_user = request.email
        if current_user is None:
            raise endpoints.UnauthorizedException('No user is logged in.')
    
        if (functions.auth_user(current_user)):
            return (LoginResponse(signedIn = True))
        else:
            raise endpoints.UnauthorizedException('Ivalid token.')
    
    @endpoints.method(EmaiRequest,PermissionResponse,
                      path = 'permission',
                      name = 'user.permission',
                      http_method = 'GET')
    def permission_user(self,request):
        current_user = request.email
        if current_user is None:
            raise  endpoints.UnauthorizedException('Invalid token.')
        
        if (functions.auth_user(current_user)):
            return PermissionResponse(permission = functions.permission_user(current_user))
        else:
            raise endpoints.UnauthorizedException('Invalid token.')
        
    

application = endpoints.api_server([UserApi])