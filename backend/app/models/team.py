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
    serialize_rules = (
        "-leader.leading",
        "-members.team",
        "-subsystems.team",
        "-records.team",
    )
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
    leader_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    leader = db.relationship(
        "User", back_populates="leading", uselist=False, foreign_keys=[leader_id]
    )
    members = db.relationship(
        "User", back_populates="team", foreign_keys="User.team_id"
    )
    subsystems = db.relationship("Subsystem", back_populates="team")
    records = db.relationship("Record", back_populates="team")

    def change_leader(self, user):
        # Set the previous leader's can_validate attribute to False
        if self.leader:
            self.leader.can_validate = False

        self.leader_id = user.id
        user.can_validate = True

    def exists(cls, id):
        record = cls.query.get(id)
        return record is not None

    # Also removes members of that team, but leaves the leader, for previous records
    def remove(self):
        if self.records is None:
            db.session.delete(self)
        else:
            # Iterate over the team members and disassociate them from the team
            for user in self.members:
                user.team_id = None
            # Remove the team's reference to users (optional)
            self.members.clear()
            self.inactive = True
