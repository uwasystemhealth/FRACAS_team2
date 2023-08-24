import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    CORS_ALLOWED_ORIGINS = [
        "https://localhost:3000",
        "https://localhost:3001",
        "https://localhost:3002",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "https://example.com",
    ]
    SECRET_KEY = os.environ.get("SECRET_KEY") or "F/+VYEI5Bg2gPMWym+s5rw=="
    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL"
    ) or "sqlite:///" + os.path.join(basedir, "app.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
