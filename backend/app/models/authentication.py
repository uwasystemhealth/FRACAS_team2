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
