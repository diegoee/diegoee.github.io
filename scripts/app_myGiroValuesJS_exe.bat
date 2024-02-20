@echo off 
::call app_myGiroValuesJS_install.bat
cls
echo app_myGiroValues.js
echo %cd%
::rmdir /S /Q node_modules 
del package-lock.json 
::call npm install 
call node %cd%/app_myGiroValues.js  
timeout 1  
::call %cd%\CarteraGiroJS.pdf 
timeout 1  
del %cd%\CarteraGiroJS.pdf 