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
import base64
import secrets

basedir = os.path.abspath(os.path.dirname(__file__))
env = os.path.join(basedir, '.env')

class Config(object):
    BACKEND_URI = (os.getenv("BACKEND_URI") or "http://localhost:5000").rstrip("/")
    FRONTEND_URI = (os.getenv("FRONTEND_URI") or "http://localhost:3000").rstrip("/")

    # python -c 'import secrets; secrets.token_urlsafe()'
    SECRET_KEY = os.environ.get("SECRET_KEY")
    if SECRET_KEY is None:
        SECRET_KEY = secrets.token_urlsafe()
        env_file = open(env, "a")  # append mode
        env_file.write("SECRET_KEY='"+str(SECRET_KEY)+"'\n")
        env_file.close()
    
    # import secrets; secrets.SystemRandom().getrandbits(128)
    SECURITY_PASSWORD_SALT = os.environ.get("SECURITY_PASSWORD_SALT")
    if SECURITY_PASSWORD_SALT is None:
        SECURITY_PASSWORD_SALT = secrets.SystemRandom().getrandbits(128)
        env_file = open(env, "a")  # append mode
        env_file.write("SECURITY_PASSWORD_SALT='"+str(SECURITY_PASSWORD_SALT)+"'\n")
        env_file.close()

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL"
    ) or "sqlite:///" + os.path.join(basedir, "app.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY", default=None)
    if JWT_SECRET_KEY is None:
        JWT_SECRET_KEY = base64.b64encode(os.urandom(16)).decode('utf-8')
        env_file = open(env, "a")  # append mode
        env_file.write("JWT_SECRET_KEY='"+str(JWT_SECRET_KEY)+"'\n")
        env_file.close()
    MAIL_SERVER = os.getenv("MAIL_SERVER", default="")
    MAIL_PORT = os.getenv("MAIL_PORT", default=465)
    MAIL_USERNAME = os.getenv("MAIL_USERNAME", default="")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD", default="")
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS", default=None) or False
    MAIL_USE_SSL = os.getenv("MAIL_USE_SSL", default=None) or True
    MAIL_DEFAULT_SENDER = MAIL_USERNAME
