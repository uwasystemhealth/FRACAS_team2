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
from typing import Callable, Literal
from flask import jsonify

from flask_jwt_extended import get_jwt_identity, jwt_required

from app.models.authentication import User


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