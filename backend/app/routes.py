import time
from typing import Callable
from flask import (
    Config,
    jsonify,
    render_template,
    flash,
    request,
    redirect,
    url_for,
    session,
)
from flask_jwt_extended import create_access_token, create_refresh_token
from flask_login import current_user, login_user, logout_user
from flask_mail import Mail, Message
from itsdangerous import URLSafeTimedSerializer

from app import app, db, mail
from app.forms import LoginForm, SignUpForm, ButtonForm
from app.models import User

from werkzeug.urls import url_parse
from app.messages import MESSAGES


@app.route("/")
@app.route("/index")
def index():
    if current_user.is_authenticated:
        user = User.query.filter_by(id=current_user.id).first()
        session["email"] = user.email
        session["user_id"] = user.id
        return render_template("index.html", title="Home")
    else:
        return redirect(url_for("login"))


# @app.route("/api/v1/authentication/login", methods=["GET", "POST"])
# def login():
#     if current_user.is_authenticated:
#         return redirect(url_for("index"))
#     form = LoginForm()
#     if form.validate_on_submit():
#         user = User.query.filter_by(email=form.email.data).first()
#         if user is None or not user.get_password(form.password.data):
#             flash("Invalid email or password")
#             return redirect(url_for("login"))
#         login_user(user, remember=form.remember_me.data)
#         session["email"] = user.email
#         session["user_id"] = user.id
#         flash("Login successful")
#         return redirect(url_for("index"))
#     return render_template("login.html", title="Sign In", form=form)


@app.route("/api/v1/authentication/login", methods=["GET", "POST"])
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
    user = User.query.filter_by(email=email).first()
    if user is None or not user.get_password(password):
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


@app.route("/api/v1/authentication/logout")
def logout():
    logout_user()
    return redirect(url_for("login"))


@app.route("/api/v1/authentication/login/signup_request", methods=["POST"])
def signup_request():
    start_time = time.time()
    email = request.json.get("email", None)
    if email is None:
        return jsonify({"err": "bad_request", "msg": "email is required"}), 400
    user = User(email=email, registered=False)
    db.session.add(user)
    db.session.commit()

    serializer = URLSafeTimedSerializer(app.config["SECRET_KEY"])
    token = serializer.dumps(email, salt=app.config["SECURITY_PASSWORD_SALT"])
    registration_link = f"{app.config['FRONTEND_URI']}/signup?token={token}"
    mail.send_message(
        MESSAGES["REGISTRATION_MAIL"]["SUBJECT"],
        sender=app.config["MAIL_USERNAME"],
        recipients=[email],
        body=MESSAGES["REGISTRATION_MAIL"]["BODY"].format(registration_link),
    )
    app.logger.info(f"Sent email to {email} in {time.time() - start_time} seconds.")
    return jsonify({"msg": "signup email sent"}), 200


@app.route("/api/v1/authentication/login/signup", methods=["POST"])
def signup():
    email = request.json.get("email", None)
    password = request.json.get("password", None)
    if email is None:
        return jsonify({"err": "bad_request", "msg": "email is required"}), 400
    if password is None:
        return jsonify({"err": "bad_request", "msg": "password is required"}), 400
    if len(email) < 1:
        return jsonify({"err": "username_length", "msg": "email is too short"}), 400
    if len(password) < 3:
        return jsonify({"err": "password_length", "msg": "password is too short"}), 400
    if User.query.filter_by(email=email).first() is not None:
        return jsonify({"err": "username_taken", "msg": "email is already taken"}), 409

    # TODO: email validation (only commit to database on successful validation)
    user = User.query.filter_by(email=email).first()
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "user created"}), 200


def get_username(user_id):
    user = User.query.filter_by(id=user_id).first()
    if user is not None:
        return user.email
    else:
        return None
