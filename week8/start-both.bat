@echo off
echo ========================================
echo   Starting Week 8 - Full Stack App
echo ========================================
echo.

echo Installing dependencies...
cd backend
call npm install
cd ..\frontend
call npm install
cd ..

echo.
echo Starting backend server (Port 5000)...
start "Backend API" cmd /k "cd backend && npm start"

echo Waiting for backend to start...
timeout /t 3 /nobreak > nul

echo.
echo Starting frontend server (Port 5173)...
start "Frontend App" cmd /k "cd frontend && npm run dev"

echo.
echo ========================================
echo   Both servers started successfully!
echo ========================================
echo Backend API: http://localhost:5000
echo Frontend App: http://localhost:5173
echo.
echo Test the API in Postman with these endpoints:
echo   GET  http://localhost:5000/api/health
echo   POST http://localhost:5000/api/auth/register
echo   POST http://localhost:5000/api/auth/login
echo   GET  http://localhost:5000/api/auth/me
echo   POST http://localhost:5000/api/upload
echo.
pause