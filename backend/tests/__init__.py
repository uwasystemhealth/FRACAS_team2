import os

# Set default database to tests/test.db
basedir = os.path.abspath(os.path.dirname(__file__))
os.environ["DATABASE_URL"] = "sqlite:///" + os.path.join(basedir, "test.db")