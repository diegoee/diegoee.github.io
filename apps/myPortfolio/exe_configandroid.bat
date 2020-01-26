@echo off
cls
call uninstall.bat 
echo https://github.com/JaneaSystems/nodejs-mobile-samples/tree/master/android/native-gradle
echo My Portfolio: Pre-setting Android App ...  
rmdir /S /Q myPortfolioAndroid\app\src\main\assets\www 
rmdir /S /Q myPortfolioAndroid\app\src\main\assets\nodejs-project
mkdir myPortfolioAndroid\app\src\main\assets\www 
mkdir myPortfolioAndroid\app\src\main\assets\nodejs-project
xcopy "%cd%\www" "%cd%\myPortfolioAndroid\app\src\main\assets\www" /s /e  
xcopy "%cd%\main_server.js" "%cd%\myPortfolioAndroid\app\src\main\assets\nodejs-project"
xcopy "%cd%\appPortfolio.js" "%cd%\myPortfolioAndroid\app\src\main\assets\nodejs-project"
xcopy "%cd%\package.json" "%cd%\myPortfolioAndroid\app\src\main\assets\nodejs-project" 
xcopy "%cd%\package.json" "%cd%\myPortfolioAndroid\app\src\main\assets\www" 
::xcopy "https://github.com/janeasystems/nodejs-mobile/releases/download/nodejs-mobile-v0.1.3/nodejs-mobile-v0.1.3-android.zip" "%cd%\myPortfolioAndroid\app\libnode"
::cd myPortfolioAndroid\app\src\main\assets\nodejs-project
::call npm install
::cd ..\www 
::call npm install
::cd ..\..\..\..\..\..  
TIMEOUT /T 10  