import os

basedir = os.path.abspath(os.path.dirname(__file__))


class Config(object):
    BACKEND_URI = (os.getenv("BACKEND_URI") or "http://localhost:5000").rstrip("/")
    FRONTEND_URI = (os.getenv("FRONTEND_URI") or "http://localhost:3000").rstrip("/")

    CORS_ALLOWED_ORIGINS = [
        BACKEND_URI,
        "https://localhost:3000",
        "https://localhost:3001",
        "https://localhost:3002",
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "https://example.com"
    ]

    # python -c 'import secrets; secrets.token_urlsafe()'
    SECRET_KEY = os.environ.get("SECRET_KEY")

    # import secrets; secrets.SystemRandom().getrandbits(128)
    SECURITY_PASSWORD_SALT = os.environ.get("SECURITY_PASSWORD_SALT")

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL"
    ) or "sqlite:///" + os.path.join(basedir, "app.db")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.getenv("JWT_SECRET_KEY")
    MAIL_SERVER = os.getenv("MAIL_SERVER")
    MAIL_PORT = os.getenv("MAIL_PORT")
    MAIL_USERNAME = os.getenv("MAIL_USERNAME")
    MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
    MAIL_USE_TLS = os.getenv("MAIL_USE_TLS") or False
    MAIL_USE_SSL = os.getenv("MAIL_USE_SSL") or True
