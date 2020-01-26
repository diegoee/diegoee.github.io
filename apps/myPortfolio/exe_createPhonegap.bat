@echo off
cls
::call uninstall.bat 
echo https://github.com/JaneaSystems/nodejs-mobile-samples/tree/master/cordova/UseNativeModules
echo My Portfolio: Create Phonegap App ... 
rmdir /S /Q myPhonegapApp 
call phonegap create myPhonegapApp --id "com.diegoee.myporfolio" --name "myPorfolio"
cd myPhonegapApp
call phonegap plugin add nodejs-mobile-cordova  
::call export ANDROID_NDK_HOME=/Users/username/Library/Android/sdk/ndk-bundle
rmdir /S /Q www
mkdir www
mkdir www\nodejs-project
cd ..
xcopy "%cd%\www" "%cd%\myPhonegapApp\www" /s /e  
xcopy "%cd%\main_phonegap.js" "%cd%\myPhonegapApp\www\nodejs-project"
xcopy "%cd%\appPortfolio.js" "%cd%\myPhonegapApp\www\nodejs-project"
xcopy "%cd%\package.json" "%cd%\myPhonegapApp\www\nodejs-project"
cd myPhonegapApp\www\nodejs-project
call npm install 
cd ..\..  
call phonegap serve  