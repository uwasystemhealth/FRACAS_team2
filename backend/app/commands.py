from pwinput import pwinput
from app import app, db
from app.models import User


def create_db_():
    db.create_all()
    print("created db!")


def create_superuser_():
    email = ""
    password = ""
    while email.strip() == "":
        email = input("Enter superuser email: ")
    while password == "":
        password = pwinput(prompt="Enter superuser password: ")

    su: User = User(email=email, registered=False, superuser=True)
    su.set_password_and_register(password)
    db.session.add(su)
    db.session.commit()
    print("Superuser created.")


@app.cli.command("quickstart")
def quickstart():
    create_db_()
    create_superuser_()


@app.cli.command("create-db")
def create_db():
    create_db_()


@app.cli.command("create-superuser")
def create_superuser():
    create_superuser_()


# TODO: turn this into backend API for admin dashboard
@app.cli.command("make-superuser")
def make_superuser():
    email = ""
    while email.strip() == "":
        email = input("Enter email of user to grant superuser status: ")
        user: User = User.query.filter_by(email=email).first()
        if user.is_superuser():
            print("User is already a superuser.")
        else:
            user.set_superuser(True)
            db.session.commit()
            print("Set superuser status.")
        return
