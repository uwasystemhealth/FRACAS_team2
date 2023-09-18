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

from sqlalchemy import false, func
from sqlalchemy_serializer import SerializerMixin
from app import db


class Subsystem(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    subsystem = db.Column(db.String(64), unique=True, nullable=False)


class Record(db.Model, SerializerMixin):
    # Fields that should not change in the record PATCH API
    # These correspond directly to variables in this table
    PROTECTED_FIELDS = (
        "id",
        "created_at",
        "modified_at",
        "creator_id",
        "creator",
        "deleted",
    )

    # THESE FIELDS NEED ADDITIONAL PARSING AND CANNOT BE DIRECTLY INSERTED AS
    # STRINGS
    TIME_FIELDS = (
        "time_of_failure",
        "created_at",
        "modified_at",
    )

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    title = db.Column(db.String(192), nullable=True)
    subsystem_id = db.Column(
        db.Integer, db.ForeignKey("subsystem.id", ondelete="SET NULL"), nullable=True
    )
    subsystem = db.relationship("Subsystem", uselist=False, foreign_keys=[subsystem_id])
    description = db.Column(db.Text, nullable=True)
    impact = db.Column(db.Text, nullable=True)
    cause = db.Column(db.Text, nullable=True)
    mechanism = db.Column(db.Text, nullable=True)
    corrective_action_plan = db.Column(db.Text, nullable=True)
    # Auto filled fields:
    # Creation Date (time when pressed submit, may be changed later)
    time_of_failure = db.Column(
        db.DateTime,
        server_default=func.now(),
        nullable=False,
    )
    # Creation Date (time when pressed submit)
    created_at = db.Column(
        db.DateTime,
        server_default=func.now(),
        nullable=False,
    )
    modified_at = db.Column(
        db.DateTime,
        server_default=func.now(),
        nullable=False,
    )
    # TODO: WAIT UNTIL TEAMS LOGIC IS MERGED INTO ALPHA BUILD.
    # # Team (by default, member's assigned team, but can be changed to other teams
    team_id = db.Column(
        db.Integer, db.ForeignKey("team.id", ondelete="SET NULL"), nullable=True
    )
    team = db.relationship("Team", uselist=False, foreign_keys=[team_id])
    # Car year (current year)
    car_year = db.Column(db.Integer, nullable=True)
    # Creator name & email (prefilled with current user's name and email)
    creator_id = db.Column(
        db.Integer, db.ForeignKey("user.id", ondelete="SET NULL"), nullable=True
    )
    creator = db.relationship("User", uselist=False, foreign_keys=[creator_id])

    deleted = db.Column(db.Boolean, server_default=false(), nullable=False)
