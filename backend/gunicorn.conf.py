import multiprocessing
import os
from dotenv import load_dotenv

bind = "127.0.0.1:5000"
workers = multiprocessing.cpu_count() * 2 + 1

for env_file in ('.env', '.flaskenv'):
    env = os.path.join(os.getcwd(), env_file)
    if os.path.exists(env):
        load_dotenv(env)
