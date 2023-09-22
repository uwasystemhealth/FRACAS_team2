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
    leader_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    leader = db.relationship("User", back_populates="leading", uselist=False, foreign_keys=[leader_id])
    members = db.relationship("User", back_populates="team", foreign_keys="User.team_id")
    subsystems = db.relationship("Subsystem", back_populates='team')
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