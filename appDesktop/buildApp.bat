@echo off
cls
call install.bat 
echo Starting electron Builder ...
call npm run electronBuilder  
TIMEOUT /T 5 