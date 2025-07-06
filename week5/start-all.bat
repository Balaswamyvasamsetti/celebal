@echo off
start "Backend" cmd /k "npm run backend"
start "Frontend" cmd /k "cd frontend && npm start"