

# Function to trap Ctrl+C and terminate both scripts
cleanup() {
  echo "Terminating scripts..."
  kill "$SCRIPT1_PID" "$SCRIPT2_PID"
  exit 0
}

# Trap Ctrl+C signal to call the cleanup function
trap cleanup INT

export NODE_ENV=development
export CHOKIDAR_USEPOLLING=true
export WATCHPACK_POLLING=true
# Start the first script in the background and store its PID
cd ./frontend
./docker-run.sh | while IFS= read -r line; do
  echo "[FRONTEND] $line"
done  &
SCRIPT1_PID=$!

# Start the second script in the background and store its PID
cd ../backend
./docker-run.sh | while IFS= read -r line; do
  echo "[BACKEND] $line"
done  &
SCRIPT2_PID=$!

# Wait for both scripts to finish
wait "$SCRIPT1_PID" "$SCRIPT2_PID"