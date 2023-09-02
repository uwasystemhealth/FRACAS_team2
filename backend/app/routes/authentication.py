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

import datetime
import time
from typing import Literal
from flask import (
    jsonify,
    request,
)
from flask_jwt_extended import (
    create_access_token,
    create_refresh_token,
    get_jwt,
    get_jwt_identity,
    jwt_required,
)
from itsdangerous import URLSafeTimedSerializer

from app import app, db, mail
from app.models.authentication import TokenBlacklist, User

from app.messages import MESSAGES
from app.utils import superuser_jwt_required, user_jwt_required


@app.route("/api/v1/authentication/login", methods=["POST"])
def login():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email is None or password is None:
        return (
            jsonify(
                {
                    "err": "invalid_credentials",
                    "msg": "Bad email or password, or user does not exist",
                }
            ),
            401,
        )
    user: User = User.query.filter_by(email=email).first()
    if user is None or not user.check_password(password):
        return (
            jsonify(
                {
                    "err": "invalid_credentials",
                    "msg": "Bad email or password, or user does not exist",
                }
            ),
            401,
        )
    access_token = create_access_token(identity=email)
    refresh_token = create_refresh_token(identity=email)
    return jsonify(access_token=access_token, refresh_token=refresh_token), 200


# Revoke token for added security
@app.route("/api/v1/authentication/logout", methods=["DELETE"])
@jwt_required(verify_type=False)
def logout():
    token = get_jwt()
    jti = token["jti"]
    ttype = token["type"]
    now = datetime.datetime.now(datetime.timezone.utc)
    db.session.add(TokenBlacklist(jti=jti, type=ttype, created_at=now))
    db.session.commit()
    print(f"Revoked token type={ttype.capitalize()}")
    return jsonify(msg=f"Revoked token type={ttype.capitalize()}"), 200


def send_signup_request_email(
    email: str,
    pwd_recovery: Literal["REGISTRATION_MAIL", "RECOVERY_MAIL"] = "REGISTRATION_MAIL",
) -> bool:
    start_time = time.time()
    serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"])
    token = serializer.dumps(email, salt=app.config["SECURITY_PASSWORD_SALT"])
    registration_link = f"{app.config['FRONTEND_URI']}/signup?token={token}"
    mail.send_message(
        MESSAGES[pwd_recovery]["SUBJECT"],
        sender=app.config["MAIL_USERNAME"],
        recipients=[email],
        body=MESSAGES[pwd_recovery]["BODY"].format(registration_link),
    )
    app.logger.info(f"Sent email to {email} in {time.time() - start_time} seconds.")
    return True


# TODO:UNTESTED
@app.route("/api/v1/authentication/reset_password", methods=["POST"])
@superuser_jwt_required
def reset_password():
    email = request.json.get("email", None)
    if email is None:
        return jsonify({"err": "bad_request", "msg": "email is required"}), 400
    user: User = User.query.filter_by(email=email).first()
    if user is None:
        return (
            jsonify(
                {
                    "err": "user_does_not_exist",
                    "msg": "user is not yet requested to join",
                }
            ),
            404,
        )
    user.unregister()
    send_signup_request_email(email)
    return jsonify({"msg": "recovery email sent"}), 200


@app.route("/api/v1/authentication/resend_signup_request", methods=["POST"])
@superuser_jwt_required
def resend_signup_request():
    email = request.json.get("email", None)
    if email is None:
        return jsonify({"err": "bad_request", "msg": "email is required"}), 400
    if User.query.filter_by(email=email).first() is None:
        return (
            jsonify(
                {
                    "err": "user_does_not_exist",
                    "msg": "user is not yet requested to join",
                }
            ),
            404,
        )
    send_signup_request_email(email)
    return jsonify({"msg": "signup email sent"}), 200


@app.route("/api/v1/authentication/signup_request", methods=["POST"])
@superuser_jwt_required
def signup_request():
    email = request.json.get("email", None)
    if email is None:
        return jsonify({"err": "bad_request", "msg": "email is required"}), 400
    if len(email) > User.MAX_EMAIL_LENGTH:
        return jsonify({"err": "long_email", "msg": "email is too long"}), 400
    user = User(email=email, registered=False)
    db.session.add(user)
    db.session.commit()

    send_signup_request_email(email)
    return jsonify({"msg": "signup email sent"}), 200


@app.route("/api/v1/authentication/signup", methods=["POST"])
def signup():
    serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"])
    password = request.json.get("password", None)
    token = request.json.get("token", None)
    if token is None:
        return jsonify({"err": "bad_request", "msg": "token is required"}), 400
    if password is None:
        return jsonify({"err": "bad_request", "msg": "password is required"}), 400
    try:
        # TODO: can set max_age as well for security
        email = serializer.loads(token, salt=app.config["SECURITY_PASSWORD_SALT"])
        user: User = User.query.filter_by(email=email).first()
        if user is None:
            return (
                jsonify(
                    {
                        "err": "user_does_not_exist",
                        "msg": "user is not yet requested to join",
                    }
                ),
                404,
            )
        if user.is_registered():
            return (
                jsonify(
                    {
                        "err": "user_already_registered",
                        "msg": "user has already been registered! please try logging in with your registered credentials",
                    }
                ),
                400,
            )
        user.set_password_and_register(password)
        db.session.commit()
        app.logger.info(f"user {email} has been registered.")
        return jsonify({"msg": "user is registered, welcome!"}), 200
    except Exception:
        pass
    return (
        jsonify(
            {
                "err": "invalid_token",
                "msg": "token is invalid or expired",
            }
        ),
        400,
    )


@app.route("/api/v1/authentication/refresh", methods=["POST"])
@jwt_required(refresh=True)
def refresh():
    identity = get_jwt_identity()
    access_token = create_access_token(identity=identity)
    return jsonify(access_token=access_token)


@app.route("/api/v1/authentication/test_logged_in", methods=["GET"])
@user_jwt_required
def test_logged_in():
    identity = get_jwt_identity()
    user: User = User.query.filter_by(email=identity).first()
    return jsonify({"msg": "Logged in!", "email": user.email}), 200
