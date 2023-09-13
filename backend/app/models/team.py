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
