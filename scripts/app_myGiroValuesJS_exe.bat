@echo off 
cls
echo app_myGiroValues.js
echo %cd%
rmdir /S /Q node_modules 
del package-lock.json 
call npm install 
call node %cd%/app_myGiroValues.js  
timeout 1   
set webNavegator="C:\Program Files\Google\Chrome\Application\chrome.exe"
call %webNavegator% %cd%\app_myGiroValues_result.html 
timeout 1  
del %cd%\app_myGiroValues_result.html
rmdir /S /Q node_modules 
del package-lock.json 