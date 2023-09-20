#!/bin/sh

exit_handler() {
  echo "Stop frontend server"
  exit 0
}

trap exit_handler EXIT TERM

ls -al
yarn dev