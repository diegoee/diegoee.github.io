@echo off
cls
echo My Portfolio: Uninstall ...
rmdir /S /Q node_modules 
rmdir /S /Q dist
rmdir /S /Q myPhoneGapApp
del package-lock.json 
TIMEOUT /T 5 

