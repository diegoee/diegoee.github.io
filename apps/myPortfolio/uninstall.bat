@echo off
cls
echo My Portfolio: Uninstall ...
rmdir /S /Q node_modules
rmdir /S /Q release-builds
rmdir /S /Q dist
del package-lock.json
del data\data.json
TIMEOUT /T 15 

