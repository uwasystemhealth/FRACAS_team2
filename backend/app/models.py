from app import login, db
from datetime import datetime

from flask_login import UserMixin
from werkzeug.security import generate_password_hash, check_password_hash


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True, autoincrement=True, nullable=False)
    email = db.Column(db.String(64), index=True, unique=True, nullable=False)
    password_hash = db.Column(db.String(128), nullable=True)
    registered = db.Column(db.Boolean(False), nullable=False)

    def __repr__(self):
        return f"<User {self.email} {'(UNREGISTERED)' if not self.registered else ''}>"

    def set_password(self, password):
        self.registered = True
        self.password_hash = generate_password_hash(password)

    def check_password(self, password: str) -> bool:
        return self.is_registered() and check_password_hash(
            self.password_hash, password
        )

    def is_registered(self) -> bool:
        return self.registered


@login.user_loader
def load_user(id):
    return User.query.get(id)
