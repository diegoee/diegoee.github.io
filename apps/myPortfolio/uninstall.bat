@echo off
cls
echo My Portfolio: Uninstall ...
rmdir /S /Q node_modules
rmdir /S /Q phonegap
rmdir /S /Q dist
del package-lock.json 
TIMEOUT /T 5 

