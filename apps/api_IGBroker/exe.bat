@echo off
cls 
call uninstall.bat 
echo Installing ...  
call npm install
echo node main.js exe 
node main.js exe
