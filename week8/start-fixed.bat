@echo off
echo Starting Week 8 Application with fixes...
echo.

echo Installing dependencies...
cd backend
call npm install
cd ..\frontend
call npm install
cd ..

echo.
echo Starting backend server...
start "Backend Server" cmd /k "cd backend && npm start"

timeout /t 3 /nobreak > nul

echo Starting frontend development server...
start "Frontend Server" cmd /k "cd frontend && npm run dev"

echo.
echo ✅ Both servers should be starting...
echo 📱 Frontend: http://localhost:5173
echo 🔗 Backend: http://localhost:5000
echo.
echo Press any key to exit...
pause > nul