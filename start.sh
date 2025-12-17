#!/bin/bash

echo "===================================="
echo "  Starting Zoey's E-Commerce"
echo "===================================="
echo ""

# Start Backend in background
echo "Starting Backend Server..."
cd backend
npm start &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 5

# Start Frontend
echo "Starting Frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "===================================="
echo "  Zoey's E-Commerce Started!"
echo "===================================="
echo ""
echo "Backend: http://localhost:5000"
echo "Frontend: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop all servers"

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
