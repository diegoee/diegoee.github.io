@echo off
call uninstall.bat 
cls
echo running server ...  
npm run start && TIMEOUT /T 15  
exit 

