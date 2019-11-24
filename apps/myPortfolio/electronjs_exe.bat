@echo off
cls
call uninstall.bat 
echo My Portfolio: Installing ...  
call npm install
echo My Portfolio: Starting electron ...
call npm run start  

