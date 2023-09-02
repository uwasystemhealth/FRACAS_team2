# Better FRACAS
# Copyright (C) 2023  Peter Tanner
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

import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    BACKEND_URI = (os.getenv("BACKEND_URI") or "http://localhost:5000").rstrip("/")
    FRONTEND_URI = (os.getenv("FRONTEND_URI") or "http://localhost:3000").rstrip("/")

    CORS_ALLOWED_ORIGINS = [
        BACKEND_URI,
        "https://localhost:3000",
        "https://localhost:3001",
        "https://localhost:3002",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "https://example.com",
    ]

    # python -c 'import secrets; secrets.token_urlsafe()'
    SECRET_KEY = os.environ.get("SECRET_KEY")

    # import secrets; secrets.SystemRandom().getrandbits(128)
    SECURITY_PASSWORD_SALT = os.environ.get("SECURITY_PASSWORD_SALT")

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL"
    ) or "sqlite:///" + os.path.join(basedir, "app.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    MAIL_SERVER = os.getenv("MAIL_SERVER")
    MAIL_PORT = os.getenv("MAIL_PORT")
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS") or False
    MAIL_USE_SSL = os.getenv("MAIL_USE_SSL") or True
