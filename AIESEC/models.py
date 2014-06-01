from google.appengine.ext import endpoints
from google.appengine.ext import ndb
from endpoints_proto_datastore.ndb import EndpointsModel

class User(EndpointsModel):
    user_id = ndb.IntegerProperty(required=True)
    email = ndb.StringProperty(required=True)
    user  = ndb.StringProperty(required=True)
   
class Post(EndpointsModel):
    title = ndb.StringProperty(required=True)
    date  = ndb.DateProperty(auto_now_add=True)
    text  = ndb.StringProperty()
    url_image = ndb.StringProperty()
    owner = ndb.StructuredProperty(User)
    status = ndb.BooleanProperty()
    
class Comments(EndpointsModel):
    text = ndb.StringProperty()
    post = ndb.StructuredProperty(Post)