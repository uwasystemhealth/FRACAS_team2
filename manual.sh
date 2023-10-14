
export NODE_ENV=development
export CHOKIDAR_USEPOLLING=true
export WATCHPACK_POLLING=true
# Start the first script in the background and store its PID
cd ./frontend
./docker-run.sh | while IFS= read -r line; do
  echo "[FRONTEND] $line"
done  &

# Start the second script in the background and store its PID
cd ../backend
./docker-run.sh | while IFS= read -r line; do
  echo "[BACKEND] $line"
done 

fg