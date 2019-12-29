from flask_login import UserMixin

from werkzeug.security import generate_password_hash, check_password_hash

class User(UserMixin):
	
	def __init__(self,id=None,username=None,email=None,firstname=None,lastname=None):
		self.id = id
		self.username = username
		self.email = email
		self.password_hash = None
		self.firstname = firstname
		self.lastname = lastname

	def set_hash_password(self, password):
		self.password_hash = password

	def set_password(self, password):
		self.password_hash = generate_password_hash(password)

	def check_password(self, password):
		return check_password_hash(self.password_hash, password)
