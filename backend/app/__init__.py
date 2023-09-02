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

from app import commands  # noqa

# Import models
model_dir = os.path.join(os.path.dirname(__file__), "models")
for filename in os.listdir(model_dir):
    if filename.endswith(".py") and filename != "__init__.py":
        module_name = filename[:-3]  # Remove the '.py' extension
        module = __import__(f"app.models.{module_name}", fromlist=["*"])

# Import routes
route_dir = os.path.join(os.path.dirname(__file__), "routes")
for filename in os.listdir(route_dir):
    if filename.endswith(".py") and filename != "__init__.py":
        module_name = filename[:-3]  # Remove the '.py' extension
        module = __import__(f"app.routes.{module_name}", fromlist=["*"])
