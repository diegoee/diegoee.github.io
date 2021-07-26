@echo off 
cls
echo uninstall ...
rmdir /S /Q node_modules  
rmdir /S /Q output   
rmdir /S /Q outputLog   
rmdir /S /Q undefined  
rmdir /S /Q dist 
del package-lock.json 
TIMEOUT /T 5 


