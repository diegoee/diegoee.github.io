@echo off
cls
echo My Server Test: Uninstall ...
rmdir /S /Q node_modules  
del package-lock.json  
TIMEOUT /T 5 

