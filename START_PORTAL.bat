@echo off
echo =====================================
echo JECRC GRIEVANCE PORTAL LAUNCHER
echo By: Ruchin Audichya (23BCON0208)
echo =====================================
echo.

echo Checking if Node.js is installed...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js is not installed!
    echo Please install Node.js from https://nodejs.org
    pause
    exit
)

echo Node.js found!
echo.

if not exist "node_modules" (
    echo Installing dependencies for first time...
    echo This may take 2-3 minutes...
    npm install
    echo.
)

echo Starting JECRC Grievance Portal...
echo.
echo Portal will open at: http://localhost:8080
echo Press Ctrl+C to stop the server
echo.

npm run dev

pause