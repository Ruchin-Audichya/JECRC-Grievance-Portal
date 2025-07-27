@echo off
setlocal enabledelayedexpansion

echo ========================================================
echo  JECRC Grievance Portal - Push to New Repository Script
echo ========================================================
echo.

REM Colors don't work well in batch, so using simple text
echo [STEP 1] Removing existing remotes...
git remote remove origin 2>nul
git remote remove new-origin 2>nul
echo [OK] Cleaned up remotes
echo.

echo [STEP 2] Adding your new repository...
git remote add origin https://github.com/Ruchin-Audichya/JECRC-Grievance-Portal.git
if %errorlevel% neq 0 (
    echo [ERROR] Failed to add remote
    pause
    exit /b 1
)
echo [OK] Remote added successfully
echo.

echo [STEP 3] Checking current branch...
for /f "tokens=*" %%i in ('git branch --show-current') do set CURRENT_BRANCH=%%i
echo Current branch: %CURRENT_BRANCH%
echo.

echo [STEP 4] Creating a clean commit history...
echo Do you want to create a single clean commit? (recommended)
echo This will combine all changes into one professional commit.
set /p response="Enter Y for Yes, N for No: "

if /i "%response%"=="Y" (
    echo Creating backup branch...
    git branch backup-before-push 2>nul
    
    echo Creating clean commit...
    for /f "tokens=*" %%i in ('git rev-list --max-parents^=0 HEAD') do set FIRST_COMMIT=%%i
    git reset --soft %FIRST_COMMIT%
    git add -A
    git commit -m "Initial Commit: JECRC Grievance Portal v2.0 - Professional Grievance Management System for JECRC University. Developed by: Ruchin Audichya (23BCON0208)"
    echo [OK] Clean commit created
)
echo.

echo [STEP 5] Ready to push!
echo.
echo Your repository: https://github.com/Ruchin-Audichya/JECRC-Grievance-Portal
echo.
echo IMPORTANT: You'll need to authenticate with GitHub.
echo Options:
echo 1. Use your GitHub password
echo 2. Use a Personal Access Token (recommended)
echo    - Go to: GitHub - Settings - Developer settings - Personal access tokens
echo    - Generate new token with 'repo' scope
echo.
pause

echo.
echo Pushing to GitHub...
git push -u origin main --force

if %errorlevel% equ 0 (
    echo.
    echo ====================================
    echo  SUCCESS! Your code is now on GitHub!
    echo ====================================
    echo.
    echo Next steps:
    echo 1. Visit: https://github.com/Ruchin-Audichya/JECRC-Grievance-Portal
    echo 2. Add description: 'Professional Grievance Management System for JECRC University'
    echo 3. Add topics: grievance-portal, jecrc, react, typescript, supabase
    echo 4. Create release: v2.0.0
    echo 5. Share with CP Beniwal Sir!
) else (
    echo.
    echo [ERROR] Push failed. Common solutions:
    echo 1. Create a Personal Access Token on GitHub
    echo 2. Try: git push https://YOUR_USERNAME:YOUR_TOKEN@github.com/Ruchin-Audichya/JECRC-Grievance-Portal.git main
    echo 3. Or use GitHub Desktop for easier authentication
)

echo.
echo Script completed!
pause