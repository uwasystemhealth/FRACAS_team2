import os
from dotenv import load_dotenv

wsgi_app = "app:app"
bind = "127.0.0.1:5000"
workers = 2

for env_file in ('.env', '.flaskenv'):
    env = os.path.join(os.getcwd(), env_file)
    if os.path.exists(env):
        load_dotenv(env)
