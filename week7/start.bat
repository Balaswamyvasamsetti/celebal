@echo off
echo Starting JWT Authentication Demo...
echo.

echo Installing backend dependencies...
cd backend
call npm install
echo.

echo Installing frontend dependencies...
cd ..\frontend
call npm install
echo.

echo Starting backend server...
start cmd /k "cd ..\backend && npm run dev"
echo.

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo Starting frontend development server...
start cmd /k "npm run dev"
echo.

echo Application started! Access at:
echo Backend API: http://localhost:5000
echo Frontend: http://localhost:5173