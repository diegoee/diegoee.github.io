@echo off 
cls
echo myTrading: uninstall ...
rmdir /S /Q node_modules  
rmdir /S /Q output   
rmdir /S /Q outputLog   
rmdir /S /Q undefined 
del package-lock.json 
TIMEOUT /T 5 


