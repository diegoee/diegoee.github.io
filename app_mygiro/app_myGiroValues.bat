@echo off 
cls
set script_name=%~nx0
set script_name=%script_name:.bat=%
set script_root=%~dp0
title script_name  
echo Script root: %script_root%
echo Script name: %script_name%.js
echo %cd%
rmdir /S /Q node_modules 
del package-lock.json 
call npm install 
call node %cd%/%script_name%.js  
timeout 1   
set webNavegator="C:\Program Files\Google\Chrome\Application\chrome.exe"
call %webNavegator% %cd%\%script_name%_result.html 
timeout 1  
del %cd%\%script_name%_result.html
rmdir /S /Q node_modules 
del package-lock.json 