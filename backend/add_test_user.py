from app import app, db
from app.models import User  # noqa

email = "Test@dev.com"
password = "Test"

with app.app_context():
    user = User(email=email)
    user.set_password_and_register(password)
    db.session.add(user)
    db.session.commit()
