@echo off
cls
call uninstall.bat 
echo https://github.com/JaneaSystems/nodejs-mobile-samples/tree/master/android/native-gradle
echo My Portfolio: Pre-setting Android App ...  
rmdir /S /Q myPortfolioAndroid\app\src\main\assets\www 
rmdir /S /Q myPortfolioAndroid\app\src\main\assets\node_modules
rmdir /S /Q myPortfolioAndroid\app\src\main\assets\nodejs-project
rmdir /S /Q myPortfolioAndroid\app\libnode
del myPortfolioAndroid\app\src\main\assets\package.json
mkdir myPortfolioAndroid\app\src\main\assets\www
mkdir myPortfolioAndroid\app\src\main\assets\nodejs-project
mkdir myPortfolioAndroid\app\libnode
xcopy "%cd%\www" "%cd%\myPortfolioAndroid\app\src\main\assets\www" /s /e  
xcopy "%cd%\main_server.js" "%cd%\myPortfolioAndroid\app\src\main\assets\nodejs-project"
xcopy "%cd%\appPortfolio.js" "%cd%\myPortfolioAndroid\app\src\main\assets\nodejs-project"
xcopy "%cd%\package.json" "%cd%\myPortfolioAndroid\app\src\main\assets" 
::cd myPortfolioAndroid\app\src\main\assets
::call npm install
::cd ..\..\..\..\..
call npm install axios
call npm install progress 
call node downloadfile.js https://github.com/janeasystems/nodejs-mobile/releases/download/nodejs-mobile-v0.1.3/nodejs-mobile-v0.1.3-android.zip nodejs-mobile-v0.1.3-android.zip 
del myPortfolioAndroid\app\libnode\nodejs-mobile-v0.1.3-android.zip
xcopy "%cd%\nodejs-mobile-v0.1.3-android.zip" "%cd%\myPortfolioAndroid\app\libnode"
del nodejs-mobile-v0.1.3-android.zip 
call node downloadfile.js http://stahlworks.com/dev/unzip.exe unzip.exe
xcopy "%cd%\unzip.exe" "%cd%\myPortfolioAndroid\app\libnode"  
del unzip.exe
cd myPortfolioAndroid\app\libnode
call unzip "nodejs-mobile-v0.1.3-android.zip"
del nodejs-mobile-v0.1.3-android.zip 
del unzip.exe
cd ..\..\.. 
TIMEOUT /T 10  