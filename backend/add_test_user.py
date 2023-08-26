from app import app, db
from app.models import User  # noqa

email = "Test"
password = "Test"

with app.app_context():
    user = User(email=email)
    user.set_password(password)
    db.session.add(user)
    db.session.commit()
