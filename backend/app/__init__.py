# Better FRACAS
# Copyright (C) 2023  Insan Basrewan, Peter Tanner
#
# This program is free software: you can redistribute it and/or modify
# it under the terms of the GNU General Public License as published by
# the Free Software Foundation, either version 3 of the License, or
# (at your option) any later version.
#
# This program is distributed in the hope that it will be useful,
# but WITHOUT ANY WARRANTY; without even the implied warranty of
# MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
# GNU General Public License for more details.
#
# You should have received a copy of the GNU General Public License
# along with this program.  If not, see <http://www.gnu.org/licenses/>.

import logging
import os
from flask import Flask
from flask_cors import CORS
from sqlalchemy import MetaData
from flask_jwt_extended import JWTManager
from sqlalchemy import MetaData
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from dotenv import load_dotenv
from flask_mail import Mail

metadata = MetaData(
    naming_convention={
        "ix": "ix_%(column_0_label)s",
        "uq": "uq_%(table_name)s_%(column_0_name)s",
        "ck": "ck_%(table_name)s_%(constraint_name)s",
        "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
        "pk": "pk_%(table_name)s",
    }
)

load_dotenv()

app = Flask(__name__)
CORS(app, origins=Config.CORS_ALLOWED_ORIGINS)

app.config.from_object(Config)
app.logger.setLevel(logging.DEBUG)

convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}

metadata = MetaData(naming_convention=convention)

jwt = JWTManager(app)
db = SQLAlchemy(app, metadata=metadata)
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
