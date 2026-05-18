#!/bin/bash

# Kill any existing processes
pkill -f "bun.*index.html" 2>/dev/null
pkill -f chokidar 2>/dev/null

# Start CSS watcher in background
echo "Starting SASS watcher..."
bunx chokidar "src/styles/**/*.scss" -c "bun run build:css" --initial &
CSS_PID=$!

# Start Bun dev server in background
echo "Starting Bun dev server..."
bun --hot index.html &
BUN_PID=$!

echo "Development server started!"
echo "CSS watcher PID: $CSS_PID"
echo "Bun dev server PID: $BUN_PID"
echo "Press Ctrl+C to stop both processes"

# Wait for interrupt
trap "echo 'Stopping development server...'; kill $CSS_PID $BUN_PID 2>/dev/null; exit" INT
wait
