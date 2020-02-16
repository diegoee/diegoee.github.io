@echo off
cls  
rmdir /S /Q download 
echo Download a File in folder: download  
mkdir download
xcopy "%cd%\downloadfile.js" "%cd%\download"
cd download
call npm install axios
call npm install progress 

::MANUAL: call node downloadfile.js  url  fileName
call node downloadfile.js  https://github.com/janeasystems/nodejs-mobile/releases/download/nodejs-mobile-v0.1.3/nodejs-mobile-v0.1.3-android.zip  nodejs-mobile-v0.1.3-android.zip

::call node downloadfile.js http://stahlworks.com/dev/unzip.exe unzip.exe 
::MANUAL: call unzip fileName
::call unzip nodejs-mobile-v0.1.3-android.zip

echo Copy de file ...
TIMEOUT /T 360 
cd ..
rmdir /S /Q download
TIMEOUT /T 10   