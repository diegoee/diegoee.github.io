@echo off
cls
call uninstall.bat 
echo My Portfolio: Installing ...  
call npm install
echo My Portfolio: Starting server ...
call node main_server.js

