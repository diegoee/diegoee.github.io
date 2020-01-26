@echo off
cls
echo My Portfolio: Uninstall ...
rmdir /S /Q node_modules 
rmdir /S /Q dist
rmdir /S /Q myPortfolioAndroid\app\src\main\assets\www 
rmdir /S /Q myPortfolioAndroid\app\src\main\assets\nodejs-project
rmdir /S /Q myPortfolioAndroid\app\libnode
del package-lock.json 
del nodejs-mobile-v0.1.3-android.zip
del myPortfolioAndroid\app\libnode\nodejs-mobile-v0.1.3-android.zip 
del unzip.exe
TIMEOUT /T 5 

