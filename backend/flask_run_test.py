import os

basedir = os.path.abspath(os.path.dirname(__file__))
os.environ["DATABASE_URL"] = "sqlite:///" + os.path.join(basedir, "tests/test.db")

os.system("flask run")
