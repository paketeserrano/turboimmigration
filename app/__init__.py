from flask import Flask
from config import Config
from flask_login import LoginManager
from sqlalchemy import create_engine, MetaData
from flask_blogging import SQLAStorage, BloggingEngine

app = Flask(__name__)
login = LoginManager(app)
login.login_view = 'login'
app.config.from_object(Config)

app.config["BLOGGING_URL_PREFIX"] = "/legal-advice"
app.config["BLOGGING_SITEURL"] = "http://localhost:8000"
app.config["BLOGGING_SITENAME"] = "HelloMigration"
app.config["BLOGGING_TWITTER_USERNAME"] = "@me"
app.config["FILEUPLOAD_LOCALSTORAGE_IMG_FOLDER"] = "fileupload"
app.config["FILEUPLOAD_PREFIX"] = "/fileupload"
app.config["FILEUPLOAD_ALLOWED_EXTENSIONS"] = ["png", "jpg", "jpeg", "gif"]
app.config['BLOGGING_ALLOW_FILEUPLOAD'] = True

engine = create_engine('mysql+pymysql://TIAdmin:admin@localhost/turboimmigration')
meta = MetaData()
sql_storage = SQLAStorage(engine, metadata=meta)
blog_engine = BloggingEngine(app, sql_storage)
meta.create_all(bind=engine)

app.config['ALLOWED_FILE_EXTENSIONS'] = ['jpg', 'png', 'pdf']

from app import routes