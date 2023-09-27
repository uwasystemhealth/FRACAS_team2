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

from functools import wraps
import json
from typing import Callable, Literal
from flask import jsonify

from flask_jwt_extended import get_jwt_identity, jwt_required
from jwt import ExpiredSignatureError
import app

from app.models.authentication import User


def handle_exceptions(func):
    @wraps(func)
    def decorated_function(*args, **kwargs):
        try:
            result = func(*args, **kwargs)
            if result[1] < 200 or result[1] >= 300:
                app.logging.error(
                    f"{str(func)} {result[0].response[0]} code={result[1]}"
                )
            return result
        except ExpiredSignatureError as e:  # Pass-through expired tokens for refresh
            raise e
        except Exception as e:
            app.logging.error(f"{str(func)} {e} {type(e)} code=500")
            return jsonify({"err": "generic_error", "msg": str(e)}), 500

    return decorated_function


def u_jwt_required__(type: Literal["superuser", "user"]) -> Callable:
    def decorator(fn):
        @wraps(fn)
        @jwt_required()  # Apply jwt_required decorator first
        def wrapper(*args, **kwargs):
            requestor_email = get_jwt_identity()

            if requestor_email is None:
                return jsonify({"err": "bad_request", "msg": "email is required"}), 400

            requestor: User = User.query.filter_by(email=requestor_email).first()

            if requestor is None:
                return (
                    jsonify(
                        {
                            "err": "invalid_credentials",
                            "msg": "Bad email or password, or user does not exist",
                        }
                    ),
                    401,
                )

            if type == "superuser" and not requestor.is_superuser():
                return (
                    jsonify(
                        {
                            "err": "invalid_permissions",
                            "msg": "endpoint requires superuser status",
                        }
                    ),
                    401,
                )

            return fn(*args, **kwargs)

        return wrapper

    return decorator


superuser_jwt_required = u_jwt_required__("superuser")
user_jwt_required = u_jwt_required__("user")
