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

from flask_jwt_extended import get_current_user, get_jwt_identity
from sqlalchemy import func
from app import db, jwt
from datetime import datetime

from werkzeug.security import generate_password_hash, check_password_hash

# delete a user for testing
# db.session.delete(User.query.filter_by(email='').first())
# db.session.commit()


class User(db.Model):
    MAX_EMAIL_LENGTH = 64

    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    email = db.Column(
        db.String(MAX_EMAIL_LENGTH), index=True, unique=True, nullable=False
    )
    password_hash = db.Column(db.String(128), nullable=True)
    registered = db.Column(db.Boolean(False), nullable=False, default=False)
    superuser = db.Column(db.Boolean(False), nullable=False, default=False)

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


class Team(db.Model):
    __tablename__ = "teams"

    team_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    team_name = db.Column(db.String, nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=func.now())


class UserTeam(db.Model):
    __tablename__ = "user_teams"

    user_id = db.Column(
        db.Integer, db.ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True
    )
    team_id = db.Column(
        db.Integer, db.ForeignKey("teams.team_id", ondelete="CASCADE"), primary_key=True
    )
    is_leader = db.Column(db.Integer, default=0)


class FailureReport(db.Model):
    __tablename__ = "failures"

    failure_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    creator_id = db.Column(
        db.Integer, db.ForeignKey("users.user_id", ondelete="CASCADE")
    )
    owner_id = db.Column(db.Integer, db.ForeignKey("users.user_id", ondelete="CASCADE"))
    teamleader_id = db.Column(
        db.Integer, db.ForeignKey("users.user_id", ondelete="CASCADE")
    )
    team_id = db.Column(db.Integer, db.ForeignKey("teams.team_id", ondelete="CASCADE"))
    failure_title = db.Column(db.Text)
    description = db.Column(db.Text)
    impact = db.Column(db.Text)
    cause = db.Column(db.Text)
    mechanism = db.Column(db.Text)
    corrective_action = db.Column(db.Text)
    subsystem = db.Column(db.Text)
    car_year = db.Column(db.Integer)
    due_date = db.Column(db.Date)
    created_at = db.Column(db.DateTime, default=func.now())
    failure_time = db.Column(db.DateTime)
    time_resolved = db.Column(db.DateTime)
    record_valid = db.Column(db.Integer)
    analysis_valid = db.Column(db.Integer)
    correction_valid = db.Column(db.Integer)
    is_reviewed = db.Column(db.Integer)


class Comment(db.Model):
    __tablename__ = "comments"

    comment_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id", ondelete="CASCADE"))
    failure_id = db.Column(
        db.Integer, db.ForeignKey("failures.failure_id", ondelete="CASCADE")
    )
    content = db.Column(db.Text, nullable=False)
    timestamp = db.Column(db.DateTime, default=func.now())


class Notification(db.Model):
    __tablename__ = "notifications"

    notification_id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.user_id", ondelete="CASCADE"))
    content = db.Column(db.Text, nullable=False)
    type = db.Column(db.Text)
    is_read = db.Column(db.Integer, default=0)
    timestamp = db.Column(db.DateTime, default=func.now())


class Bookmark(db.Model):
    __tablename__ = "bookmarks"

    user_id = db.Column(
        db.Integer, db.ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True
    )
    failure_id = db.Column(
        db.Integer,
        db.ForeignKey("failures.failure_id", ondelete="CASCADE"),
        primary_key=True,
    )
    timestamp = db.Column(db.DateTime, default=func.now())


class LearningAssignment(db.Model):
    __tablename__ = "learning_assignment"

    user_id = db.Column(
        db.Integer, db.ForeignKey("users.user_id", ondelete="CASCADE"), primary_key=True
    )
    failure_id = db.Column(
        db.Integer,
        db.ForeignKey("failures.failure_id", ondelete="CASCADE"),
        primary_key=True,
    )
    due_date = db.Column(db.Date)


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
