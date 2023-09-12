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
from app.models.authentication import TokenBlacklist, User, Team

from app.messages import MESSAGES
from app.utils import superuser_jwt_required, user_jwt_required

@app.route("/api/v1/get/member_list")
def get_member_list():
    member_list = db.session.query( \
        User.id, User.email, User.fullname, \
        Team.name.label('team')) \
        .outerjoin(Team, User.team_id == Team.id) \
        .all()
    member_dict = [member._asdict() for member in member_list]
    return jsonify(member_dict), 200

@app.route("/api/v1/get/team_list")
def get_team_list():
    team_list = db.session.query( \
        Team.id, Team.name.label('team'), \
        User.fullname.label('leader')) \
        .outerjoin(User, Team.leader_id == User.id) \
        .all()
    team_dict = [team._asdict() for team in team_list]
    return jsonify(team_dict), 200