from google.appengine.api import users
from google.appengine.api import images
from google.appengine.api import files
from google.appengine.ext import ndb
from google.appengine.ext import blobstore
from google.appengine.api import memcache
from google.appengine.api.images import get_serving_url
from google.appengine.ext.webapp import blobstore_handlers

from functions import functions
import urllib
import os
import webapp2
import jinja2
import json
import logging

template_dir = os.path.join(os.path.dirname(__file__), 'templates')
jinja_env = jinja2.Environment(loader = jinja2.FileSystemLoader(template_dir), autoescape=True)


class User(ndb.Model):
    usermail = ndb.StringProperty()
    info = ndb.StringProperty()
   
    @staticmethod
    def get_user(email):
        mem_key = 'user'
        user_key = ndb.Key('AIESEC','User')
        user = memcache.get(mem_key)
         
        if user is None:
            user = ndb.gql("SELECT * FROM User WHERE ANCESTOR IS :1",user_key)
            logging.debug('Usuario:%s'%user)
            user = list(user)
            memcache.set(mem_key,user)
         
        result = [x[1] for x in enumerate(user) if x[1].usermail == email]
        logging.debug(result)
        return result

class Handler(webapp2.RequestHandler):
    
    def write(self,*a,**kw):
        self.response.out.write(*a,**kw)

    def render_str(self, template, **params):
        t = jinja_env.get_template(template)
        return t.render(params)

    def render(self, template, **kw):
        self.write(self.render_str(template, **kw))
        
        
class login(Handler):
    def get(self):
        self.render('Login.html')
        user = users.get_current_user()
        if user:
            #if(functions.auth_user(user.email())):
                #if User.get_user(user.email()):
                    self.redirect('/newpost')
                #else: 
                #    self.redirect('/timeline')
            #else:
            #    self.redirect(users.create_logout_url('/'))
    def post(self):
        self.redirect(users.create_login_url(self.request.uri))
       
class loginj(Handler):
    def get(self):
        user = users.get_current_user()
        self.response.content_type = 'application/json'
        jUser = {'userID': user.user_id(),'userMail': user.email()}
        self.response.out.write(json.dumps(jUser))

class newPost(Handler,blobstore_handlers.BlobstoreUploadHandler):
    def get(self):
        user = users.get_current_user()
        if user:
            #if functions.auth_user(user.email()):
                logouthref = '%s' % users.create_logout_url('/')
                #if User.get_user(user.email()):
                self.render('newpost.html',logouthref = logouthref,email=user.email())
                #else:
                #    self.redirect('/timeline')
        #else:
        #    self.redirect(users.create_logout_url('/'))
    def post(self):
        user = users.get_current_user()
        self.response.headers['Content-Type'] = 'application/json'
        if user:
            self.response.out.write(json.dumps(user.user_id()))
    
class UploadHandler(blobstore_handlers.BlobstoreUploadHandler):
  def post(self):
    upload_files = self.get_uploads('file')  # 'file' is file upload field in the form
    blob_info = upload_files[0]
    self.redirect('/serve/%s' % blob_info.key())
        
class ServeHandler(blobstore_handlers.BlobstoreDownloadHandler):
    def get(self, resource):
        resource = str(urllib.unquote(resource))
        blob_info = blobstore.BlobInfo.get(resource)
        self.send_blob(blob_info)

class TimelineHandler(Handler): 
    def get(self):
        user = users.get_current_user()
        if user:
            logouthref = '%s' % users.create_logout_url('/')
            self.render('timeline.html',logouthref = logouthref,email = user.email())
        else:
            self.redirect(users.create_logout_url('/'))
    def post(self):
         self.response.headers['Content-Type'] = 'application/json'


class postsHandler(Handler):
    def get(self,id):
        user = users.get_current_user()
        if user:
            logouthref = '%s' % users.create_logout_url('/')
            self.render('posts.html',image=id,logouthref = logouthref,email=user.email())
        else:
            self.redirect(users.create_logout_url('/'))
    def post(self, resource):
        user = users.get_current_user()
        self.response.headers['Content-Type'] = 'application/json'
        jUser = {'userID': user.user_id(),'userMail': user.email()}
        self.response.out.write(json.dumps(jUser))
    
app = webapp2.WSGIApplication([
    ('/', login),
    ('/newpost', newPost),
    ('/upload', UploadHandler),
    ('/serve/([^/]+)?',  ServeHandler),
    ('/posts/([^/]+)?', postsHandler),
    ('/timeline', TimelineHandler),
    ('/loginj', loginj)
    ],
    debug=True) 
