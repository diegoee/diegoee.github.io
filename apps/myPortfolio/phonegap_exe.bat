@echo off
cls
call uninstall.bat  
echo My Portfolio: Starting phonegap...  
call npm run phonegap
cd phonegap 
del package.json
rmdir /S /Q www
cd ..
robocopy www phonegap/www /E
copy package.json phonegap 
cd phonegap
echo My Portfolio: Installing ... 
call npm install 
call phonegap serve 
call cd ..
TIMEOUT /T 5