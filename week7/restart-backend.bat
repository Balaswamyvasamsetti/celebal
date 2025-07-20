@echo off
echo Stopping any running Node.js processes...
taskkill /f /im node.exe 2>nul

echo Starting the backend server with extended token expiration...
cd backend
npm run dev