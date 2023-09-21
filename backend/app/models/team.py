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

from sqlalchemy import func
from sqlalchemy.sql import expression
from sqlalchemy_serializer import SerializerMixin
from app import db


class Team(db.Model, SerializerMixin):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    created_at = db.Column(
        db.DateTime,
        server_default=func.now(),
        nullable=False,
    )
    name = db.Column(db.String(128), server_default="?", nullable=False)
    inactive = db.Column(
        db.Boolean(False), nullable=False, server_default=expression.false()
    )
    leader_id = db.Column(db.Integer, db.ForeignKey("user.id", ondelete="SET NULL"))
    leader = db.relationship(
        "User", uselist=False, back_populates="leading_team", foreign_keys=[leader_id]
    )
    members = db.relationship(
        "User", back_populates="team", foreign_keys="User.team_id"
    )
