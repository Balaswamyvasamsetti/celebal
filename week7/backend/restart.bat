@echo off
echo Stopping any running Node.js processes...
taskkill /f /im node.exe 2>nul

echo Starting the server with Week6 compatibility...
echo.
echo This server includes both Week7 JWT authentication endpoints (/api/...)
echo and Week6 compatibility endpoints (/users, /products, /orders)
echo.
npm run dev