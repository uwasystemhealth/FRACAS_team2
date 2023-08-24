import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_login import LoginManager
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)  # , origins=Config.CORS_ALLOWED_ORIGINS)
app.config.from_object(Config)
app.config["JWT_SECRET_KEY"] = os.getenv("JWT_SECRET_KEY")
jwt = JWTManager(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
login = LoginManager(app)
login.login_view = "login"

from app import routes, models, forms  # noqa
