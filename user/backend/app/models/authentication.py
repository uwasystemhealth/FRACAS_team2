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

from enum import Enum
from sqlalchemy_serializer import SerializerMixin

from flask_jwt_extended import get_current_user, get_jwt_identity
from sqlalchemy import func
from sqlalchemy.sql import expression
from app import db, jwt
from datetime import datetime
from app.models.record import Record

from werkzeug.security import generate_password_hash, check_password_hash

# import app.models.team

# delete a user for testing
# db.session.delete(User.query.filter_by(email='').first())
# db.session.commit()

class User(db.Model, SerializerMixin):
    serialize_only = (
        "registered",
        "id",
        "superuser",
        "name",
        "created_at",
        "can_validate",
        "team_id",
        "team",
        "leading",
        "bookmarked.id",
    )
    serialize_rules = (
        "-password_hash",
        "-team.reports",
        "-created_records",
        "-owned_records",
        "-team.leader",
        "-team.members",
        "-team.records",
        "-team.subsystems",
        "-leading.leader",
        "-leading.members",
        "-leading.records",
        "-leading.subsystems",
        # Future proofing
        "-created_records.creator",
        "-owned_records.owner",
    )

    MAX_EMAIL_LENGTH = 64

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    email = db.Column(
        db.String(MAX_EMAIL_LENGTH), index=True, unique=True, nullable=False
    )
    password_hash = db.Column(db.String(128), nullable=True)
    registered = db.Column(
        db.Boolean(False), nullable=False, server_default=expression.false()
    )
    superuser = db.Column(
        db.Boolean(False), nullable=False, server_default=expression.false()
    )
    name = db.Column(db.String(128), nullable=False)
    created_at = db.Column(
        db.DateTime,
        server_default=func.now(),
        nullable=False,
    )
    can_validate = db.Column(db.Boolean, default=False)

    team_id = db.Column(db.Integer, db.ForeignKey("team.id", ondelete="SET NULL"))
    team = db.relationship("Team", back_populates="members", foreign_keys=[team_id])

    leading = db.relationship(
        "Team", back_populates="leader", uselist=False, foreign_keys="Team.leader_id"
    )

    created_records = db.relationship(
        "Record", back_populates="creator", foreign_keys="Record.creator_id"
    )
    owned_records = db.relationship(
        "Record", back_populates="owner", foreign_keys="Record.owner_id"
    )
    bookmarked = db.relationship(
        "Record", secondary='user_record'
    )

    def __repr__(self):
        return f"<User {self.email} {'(UNREGISTERED)' if not self.registered else ''}>"

    def set_password_and_register(self, password: str) -> None:
        self.registered = True
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return self.is_registered() and check_password_hash(
            self.password_hash, password
        )

    def unregister(self):
        self.registered = False

    def is_registered(self) -> bool:
        return self.registered

    def is_superuser(self) -> bool:
        return self.superuser

    def set_superuser(self, superuser: bool) -> None:
        self.superuser = superuser

    def is_leading_team(self) -> bool:
        if (self.leading):
            return True
        else:
            return False

    def remove(self):
        if (self.created_records is None) & (self.created_records is None):
            self.leading.clear()
            db.session.delete(self)
        else:
            self.registered = False


class TokenBlacklist(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, index=True)
    type = db.Column(db.String(16), nullable=False)
    user_id = db.Column(
        db.ForeignKey("user.id"),
        default=lambda: get_current_user().id,
        nullable=False,
    )
    created_at = db.Column(
        db.DateTime,
        server_default=func.now(),
        nullable=False,
    )

user_record = db.Table("user_record",
                db.Column("user_id", db.ForeignKey(User.id), primary_key=True),
                db.Column("record_id", db.ForeignKey(Record.id), primary_key=True),
                )


@jwt.user_lookup_loader
def user_loader_callback(jwt_header, jwt_payload):
    """Function for app, to return user object"""

    if jwt_header:
        email = jwt_payload["sub"]
        return User.query.filter_by(email=email).one_or_none()
    else:
        return None


@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlacklist.id).filter_by(jti=jti).scalar()

    return token is not None
