import pytest, os

from sqlalchemy import delete
from app.models.authentication import User
from app.models.record import Record,Subsystem

from add_test_userteams import add_test_userteams
from add_test_records import add_test_records

from app import app, db


app.config.update({"TESTING" : True,})

@pytest.fixture()
def client(autouse=True):

    testing_client = app.test_client()
    yield testing_client


@pytest.fixture()
def user_data():

    with app.app_context():

        # buildup
        add_test_userteams()

        yield

        # teardown
        db.session.query(User).delete()
        db.session.commit()


@pytest.fixture()
def record_data():

    with app.app_context():

        # buildup
        add_test_records()

        yield

        # teardown
        db.session.query(Record).delete()
        db.session.commit
        db.session.query(Subsystem).delete()
        db.session.commit()