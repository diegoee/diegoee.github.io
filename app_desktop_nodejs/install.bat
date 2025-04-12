@echo off
cls
call uninstall.bat 
echo Installing ...  
call npm install --force
TIMEOUT /T 5 