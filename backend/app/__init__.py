import os
from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv
from flask_mail import Mail

load_dotenv()

app = Flask(__name__)
CORS(app, origins=Config.CORS_ALLOWED_ORIGINS)

app.config.from_object(Config)

jwt = JWTManager(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)
mail = Mail(app)

from app import routes, models, commands  # noqa
