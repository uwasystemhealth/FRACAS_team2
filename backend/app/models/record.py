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
from app.models.team import Team


class Subsystem(db.Model, SerializerMixin):
    serialize_rules = (
        "-team.subsystems",
        "-record.subsystem",
    )

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    name = db.Column(db.String(64), unique=True, nullable=False)
    team_id = db.Column(db.Integer, db.ForeignKey("team.id"), nullable=True)
    team = db.relationship("Team", back_populates="subsystems")
    records = db.relationship("Record", back_populates="subsystem")

    def clean_up(cls):
        subsystems = cls.query.all()
        for subsys in subsystems:
            if subsys.records is None:
                db.session.delete(subsys)

    def exists(cls, id):
        record = cls.query.get(id)
        return record is not None

    def get_by_team(team_id):
        subsystems = Subsystem.query.filter_by(team_id=team_id).all()
        return subsystems


class Comment(db.Model, SerializerMixin):
    serialize_rules = ("-record",)
    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    text = db.Column(db.Text, nullable=True)
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
    user_id = db.Column(
        db.Integer, db.ForeignKey("user.id", ondelete="SET NULL"), nullable=False
    )
    user = db.relationship("User", back_populates="comments", foreign_keys=[user_id])
    record_id = db.Column(
        db.Integer, db.ForeignKey("record.id", ondelete="SET NULL"), nullable=False
    )
    record = db.relationship(
        "Record", back_populates="comments", foreign_keys=[record_id]
    )


class Record(db.Model, SerializerMixin):
    serialize_rules = (
        "-creator.created_records",
        "-creator.owned_records",
        "-creator.team.records",
        "-creator.bookmarked",
        "-owner.created_records",
        "-owner.owned_records",
        "-owner.team.records",
        "-owner.bookmarked",
        "-subsystem.records",
        "-subsystem.team.records",
        "-team.records",
        "-team.members",
        "-team.subsystems",
        "-comments",
    )

    # Fields that should not change in the record PATCH API
    # These correspond directly to variables in this table
    PROTECTED_FIELDS = (
        "id",
        "created_at",
        "modified_at",
        "creator_id",
        "creator",
        "deleted",
        "comments",
    )

    # THESE FIELDS NEED ADDITIONAL PARSING AND CANNOT BE DIRECTLY INSERTED AS
    # STRINGS
    TIME_FIELDS = ("time_of_failure", "created_at", "modified_at", "time_resolved")

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    title = db.Column(db.String(192), nullable=True)
    # TODO: why did we use a string for this database relation??? Change it to
    # use subsystem_id instead.
    subsystem_name = db.Column(
        db.String, db.ForeignKey("subsystem.name"), nullable=True
    )
    subsystem = db.relationship("Subsystem", back_populates="records")
    description = db.Column(db.Text, nullable=True)
    impact = db.Column(db.Text, nullable=True)
    cause = db.Column(db.Text, nullable=True)
    mechanism = db.Column(db.Text, nullable=True)
    corrective_action_plan = db.Column(db.Text, nullable=True)
    # notes = db.Column(db.Text, nullable=True)
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
    team_id = db.Column(
        db.Integer, db.ForeignKey("team.id", ondelete="SET NULL"), nullable=True
    )
    team = db.relationship("Team", foreign_keys=[team_id])
    # Car year (current year)
    car_year = db.Column(db.Integer, nullable=True)
    # Creator name & email (prefilled with current user's name and email)
    creator_id = db.Column(
        db.Integer, db.ForeignKey("user.id", ondelete="SET NULL"), nullable=False
    )
    creator = db.relationship(
        "User", back_populates="created_records", foreign_keys=[creator_id]
    )
    owner_id = db.Column(
        db.Integer, db.ForeignKey("user.id", ondelete="SET NULL"), nullable=True
    )
    owner = db.relationship(
        "User", back_populates="owned_records", foreign_keys=[owner_id]
    )
    draft = db.Column(db.Boolean, server_default=false(), nullable=False)
    marked_for_deletion = db.Column(db.Boolean, server_default=false(), nullable=False)
    time_resolved = db.Column(db.DateTime, nullable=True)
    record_valid = db.Column(db.Boolean, nullable=True)
    analysis_valid = db.Column(db.Boolean, nullable=True)
    corrective_valid = db.Column(db.Boolean, nullable=True)
    comments = db.relationship(
        "Comment", back_populates="record", cascade="all, delete-orphan"
    )
