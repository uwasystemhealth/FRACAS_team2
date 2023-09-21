#  Better FRACAS
#  Copyright (C) 2023  Peter Tanner
#
#  This program is free software: you can redistribute it and/or modify
#  it under the terms of the GNU General Public License as published by
#  the Free Software Foundation, either version 3 of the License, or
#  (at your option) any later version.
#
#  This program is distributed in the hope that it will be useful,
#  but WITHOUT ANY WARRANTY; without even the implied warranty of
#  MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
#  GNU General Public License for more details.
#
#  You should have received a copy of the GNU General Public License
#  along with this program.  If not, see <http://www.gnu.org/licenses/>.

from flask import jsonify, request
from flask_jwt_extended import get_jwt_identity
from app import app, db
from app.models.authentication import User
from app.models.team import Team
from app.utils import handle_exceptions, superuser_jwt_required, user_jwt_required
from app.models.record import Record


def user_json(users):
    # User JSON Schema
    user_json = [
        {
            "id": user.id,
            "email": user.email,
            "name": user.name,
            "superuser": user.superuser,
            "team_id": user.team_id,
            "team_name": get_teamname(user),
            "is_leader": isLeader(user),
        }
        for user in users
    ]
    return jsonify(user_json)


@app.route("/api/v1/user", methods=["GET"])
# Get list of Users
def list_users():
    users = User.query.filter_by(registered=True).all()
    return user_json(users)


@app.route("/api/v1/user/<int:user_id>", methods=["GET"])
# Get User via id
def get_user(user_id):
    user = User.query.get(user_id)
    if user is None:
        return jsonify({"err": "no_user", "msg": "User not found"}), 404
    return user_json(user)


@app.route("/api/v1/user", methods=["POST"])
# Add user
def add_user():
    data = request.get_json()
    print(data)

    user = User()

    if "name" in data:
        user.name = data["name"]
    else:
        return jsonify({"error": "Required Fields Missing"}), 400
    if "email" in data:
        user.email = data["email"]
    else:
        return jsonify({"error": "Required Fields Missing"}), 400
    if "password" in data:
        user.set_password_and_register(data["password"])
    else:
        return jsonify({"error": "Required Fields Missing"}), 400

    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User added successfully"}), 200


@app.route("/api/v1/user/<int:user_id>", methods=["DELETE"])
# Delete Team (Mark Inactive)
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    user.registered = False
    db.session.commit()
    return jsonify({"message": "User is deregistered"}), 200


# Updates user record (with json header referencing data type)
@app.route("/api/v1/user/<int:user_id>", methods=["PUT"])
def set_superuser(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404
    data = request.get_json()
    print(data)
    if "name" in data:
        user.name = data["name"]
    if "email" in data:
        user.email = data["email"]
    if "superuser" in data:
        user.superuser = data["superuser"]
    if "email" in data:
        user.email = data["email"]
    if "team_id" in data:
        team = Team.query.get(data["team_id"])
        user.team = team

    db.session.commit()
    return jsonify({"message": "User Records Updated"}), 200


def get_teamname(user):
    if user.team_id is None:
        return "N/A"
    team = Team.query.get(user.team_id)
    return team.name


def isLeader(user):
    if user.leading_team:
        return True
    return False
