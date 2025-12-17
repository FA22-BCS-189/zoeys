@echo off
echo ====================================
echo   Starting Zoey's E-Commerce
echo ====================================
echo.

REM Start Backend
echo Starting Backend Server...
cd backend
start cmd /k "npm start"
cd ..

REM Wait a bit for backend to start
timeout /t 5 /nobreak > nul

REM Start Frontend
echo Starting Frontend...
cd frontend
start cmd /k "npm run dev"
cd ..

echo.
echo ====================================
echo   Zoey's E-Commerce Started!
echo ====================================
echo.
echo Backend: http://localhost:5000
echo Frontend: http://localhost:5173
echo.
echo Press any key to exit...
pause > nul
