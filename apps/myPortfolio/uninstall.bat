@echo off
cls
echo My Portfolio: Uninstall ...
rmdir /S /Q node_modules 
rmdir /S /Q dist
rmdir /S /Q myPortfolioAndroid\app\src\main\assets\www 
rmdir /S /Q myPortfolioAndroid\app\src\main\assets\nodejs-project
del package-lock.json 
TIMEOUT /T 5 

