@echo off
echo ========================================
echo Fixing TurboModule Error
echo ========================================
echo.

echo [1/5] Removing node_modules...
if exist node_modules rmdir /s /q node_modules

echo [2/5] Removing package-lock.json...
if exist package-lock.json del package-lock.json

echo [3/5] Removing .expo cache...
if exist .expo rmdir /s /q .expo

echo [4/5] Installing dependencies (this may take a few minutes)...
call npm install --legacy-peer-deps

echo.
echo [5/5] Starting Expo with clear cache...
echo.
echo ========================================
echo IMPORTANT: 
echo 1. Close the app on your phone completely
echo 2. Uninstall the app if installed
echo 3. Scan the NEW QR code
echo ========================================
echo.
call npm start -- --clear
