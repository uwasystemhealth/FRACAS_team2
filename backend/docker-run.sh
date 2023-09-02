#!/bin/sh

exit_handler() {
  echo "Stop flask server"
  exit 0
}

trap exit_handler EXIT TERM

source .venv/bin/activate
ls -al
flask run --host 0.0.0.0 --debug