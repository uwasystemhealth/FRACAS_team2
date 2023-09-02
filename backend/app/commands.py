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

from pwinput import pwinput
from app import app, db
from app.models.authentication import User
from app.routes.authentication import send_signup_request_email


def create_db_():
    db.create_all()
    print("created db!")


def create_superuser_():
    email = ""
    password = ""
    while email.strip() == "":
        email = input("Enter superuser email: ")
    while password == "":
        password = pwinput(prompt="Enter superuser password: ")

    su: User = User(email=email, registered=False, superuser=True)
    su.set_password_and_register(password)
    db.session.add(su)
    db.session.commit()
    print("Superuser created.")


@app.cli.command("quickstart")
def quickstart():
    create_db_()
    create_superuser_()


@app.cli.command("create-db")
def create_db():
    create_db_()


@app.cli.command("create-superuser")
def create_superuser():
    create_superuser_()


# TODO: turn this into backend API for admin dashboard
@app.cli.command("make-superuser")
def make_superuser():
    email = ""
    while email.strip() == "":
        email = input("Enter email of user to grant superuser status: ")
        user: User = User.query.filter_by(email=email).first()
        if user.is_superuser():
            print("User is already a superuser.")
        else:
            user.set_superuser(True)
            db.session.commit()
            print("Set superuser status.")
        return


# TODO: temporary, remove
@app.cli.command("invite-user")
def invite_user():
    email = ""
    while email.strip() == "":
        email = input("Enter email of user to invite: ")
        if email is None:
            return print({"err": "bad_request", "msg": "email is required"})
        if len(email) > User.MAX_EMAIL_LENGTH:
            return print({"err": "long_email", "msg": "email is too long"})
        user = User(email=email, registered=False)
        db.session.add(user)
        db.session.commit()

        send_signup_request_email(email)
        return print({"msg": "signup email sent"})
