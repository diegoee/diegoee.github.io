@echo off
cls 
set tempFolder = download
rmdir /S /Q %tempFolder%  
echo Download a File in folder: %tempFolder%  
mkdir %tempFolder%
xcopy "%cd%\downloadfile.js" "%cd%\%tempFolder%"
cd %tempFolder%
call npm install axios
call npm install progress 

set fileUrl = https://github.com/janeasystems/nodejs-mobile/releases/download/nodejs-mobile-v0.1.3/nodejs-mobile-v0.1.3-android.zip
set fileName = nodejs-mobile-v0.1.3-android.zip 

call node downloadfile.js  %fileUrl%  %fileName%
::call node downloadfile.js http://stahlworks.com/dev/unzip.exe unzip.exe 
::call unzip %fileName% 

echo Copy de file ...
TIMEOUT /T 360 
cd ..
rmdir /S /Q download 
TIMEOUT /T 10   