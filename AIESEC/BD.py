from google.appengine.ext import endpoints
from google.appengine.ext import ndb
from protorpc import remote

from endpoints_proto_datastore.ndb import EndpointsModel

class User(EndpointsModel):
    user = ndb.UserProperty(required=True)
    role = ndb.StringProperty(required=True)
    
class Post(EndpointModel):
    title = ndb.StringProperty(required=True)
    date  = ndb.DateProperty(auto_now_add=True)
    text  = ndb.StringProperty()
    image = ndb.BlobProperty()
    owner = ndb.ReferenceProperty(User,collection_name='users')
    status = ndb.BooleanProperty()
    
class Comments(EndpointModel):
    text = ndb.StringProperty()
    post = ndb.ReferenceProperty(Post,collection_name='posts')


@endpoints.api(name='aiesecAPI',version='v1',description='API for AIESEC users.')
class UserApi(remote.Service):
    
    @User.method(user_required=True,
                 request_field=('role',),
                 path='user',
                 name='user.insert')
    def insert_user(self, user):
        user.user = endpoints.get_current_user()
        user.put()
        return user
    
application = endpoints.api_server([AiesecApi])

    


    