@echo off
cls
call uninstall.bat 
echo My Server Test: Installing ...  
call npm install
echo My Server Test: Starting server ...
call node server.js

